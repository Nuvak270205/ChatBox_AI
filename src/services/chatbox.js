import {
    addDoc,
    collection,
    doc,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

import { db } from "~/config";
import { buildCurrentUserMemberInfo, fetchUserDetailsMap, mergeMemberInfo } from "~/services/chatMember.js";

// Tạo nội dung xem trước cho tin nhắn cuối cùng của cuộc chat.
function buildLastMessagePreview(content = "", type = "normal", attachmentData = null, isReply = false) {
    if (type === "icon") {
        return "👍";
    }
    if (attachmentData?.url) {
        if (type === "file") {
            return "Đã gửi một file";
        }
        return "Đã gửi một hình ảnh";
    }
    if (isReply && !content.trim()) {
        return "Đã trả lời một tin nhắn";
    }
    return content.trim() || "Tin nhắn";
}

// Cập nhật thông tin tóm tắt chatbox sau khi gửi tin nhắn.
async function updateChatboxSummary(chatId, userId, preview) {
    if (!chatId || !userId) {
        return;
    }

    await updateDoc(doc(db, "chatbox", chatId), {
        lastMessage: preview,
        lastMessageAt: serverTimestamp(),
        lastSenderId: userId,
        [`lastRead.${userId}`]: serverTimestamp(),
    });
}

// Gửi một tin nhắn mới (văn bản, ảnh, file hoặc trả lời).
async function sendChatboxMessage({ chatId, userId, content = "", type = "normal", attachmentData = null, replyId = null }) {
    if (!chatId || !userId || (!content.trim() && !attachmentData)) {
        return;
    }

    const messageRef = collection(db, "chatbox", chatId, "messages");
    const messageData = {
        senderId: userId,
        content: content.trim(),
        createAt: serverTimestamp(),
        status: "Đã gửi",
        type: replyId ? "reply" : type,
    };

    if (attachmentData) {
        if (type === "image") {
            messageData.content_image = attachmentData.url;
        } else if (type === "file") {
            messageData.titlefile = attachmentData.name;
            messageData.sizefile = attachmentData.size;
            messageData.content_image = attachmentData.url;
        }
    }

    if (replyId) {
        messageData.rep = replyId;
        messageData.replyToId = replyId;
        messageData.replyType = type;
    }

    await addDoc(messageRef, messageData);
    const preview = buildLastMessagePreview(content, type, attachmentData, Boolean(replyId));
    await updateChatboxSummary(chatId, userId, preview);
}

// Gửi biểu tượng thích (thumbs up), có thể kèm ngữ cảnh trả lời.
async function sendChatboxThumbsUp({ chatId, userId, replyId = null }) {
    if (!chatId || !userId) {
        return;
    }

    const messageRef = collection(db, "chatbox", chatId, "messages");
    const messageData = {
        senderId: userId,
        content: "",
        createAt: serverTimestamp(),
        status: "Đã gửi",
        type: replyId ? "reply" : "icon",
        Icon: "ThumbsUp",
    };

    if (replyId) {
        messageData.rep = replyId;
        messageData.replyToId = replyId;
        messageData.replyType = "icon";
    }

    await addDoc(messageRef, messageData);
    await updateChatboxSummary(chatId, userId, "👍");
}

// Đồng bộ thông tin memberInfo của người dùng hiện tại vào chatbox.
async function syncChatboxCurrentUserMemberInfo({ chatId, userProfile, chatData }) {
    if (!chatId || !userProfile?.uid || !chatData) {
        return;
    }

    const freshUserData = await fetchUserDetailsMap([userProfile.uid]);
    const currentMemberInfo = chatData.memberInfo || {};
    const nextCurrentUserInfo = buildCurrentUserMemberInfo(
        currentMemberInfo,
        freshUserData[userProfile.uid],
        userProfile.uid,
        userProfile
    );
    const existingCurrentUserInfo = currentMemberInfo[userProfile.uid] || {};
    const shouldUpdate =
        existingCurrentUserInfo.name !== nextCurrentUserInfo.name ||
        existingCurrentUserInfo.avatar !== nextCurrentUserInfo.avatar ||
        existingCurrentUserInfo.displayName !== nextCurrentUserInfo.displayName;

    if (!shouldUpdate) {
        return;
    }

    await updateDoc(doc(db, "chatbox", chatId), {
        [`memberInfo.${userProfile.uid}`]: nextCurrentUserInfo,
    });
}

// Đánh dấu cuộc chat đã được người dùng hiện tại đọc.
async function markChatboxAsRead({ chatId, userId }) {
    if (!chatId || !userId) {
        return;
    }

    await updateDoc(doc(db, "chatbox", chatId), {
        [`lastRead.${userId}`]: serverTimestamp(),
    });
}

// Lắng nghe thông tin chi tiết của một cuộc chat theo thời gian thực.
function listenToChatboxDetail({ chatId, user, onUpdate, onMissing, onError }) {
    if (!chatId || !user?.uid) {
        return () => {};
    }

    const chatRef = doc(db, "chatbox", chatId);

    const unsubscribe = onSnapshot(
        chatRef,
        (chatSnapshot) => {
            if (!chatSnapshot.exists()) {
                onMissing?.();
                return;
            }

            (async () => {
                const chatData = chatSnapshot.data();
                const memberInfo = chatData.memberInfo || {};
                const memberIds = chatData.members || [];
                const freshUserData = await fetchUserDetailsMap(memberIds);
                const enrichedMemberInfo = mergeMemberInfo(memberInfo, freshUserData);
                const otherMembers = memberIds.filter((memberId) => memberId !== user.uid);
                const otherMemberNames = otherMembers.map(
                    (memberId) => enrichedMemberInfo[memberId]?.name || enrichedMemberInfo[memberId]?.displayName || memberId
                );

                await syncChatboxCurrentUserMemberInfo({
                    chatId,
                    userProfile: user,
                    chatData,
                });

                onUpdate?.({
                    id: chatSnapshot.id,
                    members: memberIds,
                    memberInfo: enrichedMemberInfo,
                    lastRead: chatData.lastRead || {},
                    images: otherMembers.map((memberId) => enrichedMemberInfo[memberId]?.avatar || "").filter(Boolean),
                    user: otherMemberNames.join(", ") || "Unknown",
                });
            })().catch((error) => {
                if (onError) {
                    onError(error);
                    return;
                }
                console.error("Failed to process chat detail:", error);
            });
        },
        (error) => {
            if (onError) {
                onError(error);
                return;
            }
            console.error("Failed to listen chat detail:", error);
        }
    );

    return unsubscribe;
}

// Lắng nghe danh sách tin nhắn trong cuộc chat theo thời gian thực.
function listenToChatboxMessages({ chatId, onUpdate, onError, messageLimit = 200 }) {
    if (!chatId) {
        return () => {};
    }

    const messagesQuery = query(collection(db, "chatbox", chatId, "messages"), orderBy("createAt", "asc"), limit(messageLimit));

    const unsubscribe = onSnapshot(
        messagesQuery,
        (messagesSnapshot) => {
            const nextMessages = messagesSnapshot.docs.map((msgDoc) => {
                const msgData = msgDoc.data();
                return {
                    id: msgDoc.id,
                    id_user: msgData.senderId,
                    content: msgData.content || "",
                    content_image: msgData.content_image || "",
                    titlefile: msgData.titlefile || "",
                    sizefile: msgData.sizefile || 0,
                    time: msgData.createAt?.toDate?.() || new Date(0),
                    status: msgData.status || "Đã gửi",
                    arrUser: msgData.type === "forward" ? [msgData.senderId] : [],
                    type: msgData.type || "normal",
                    rep: msgData.rep || msgData.replyToId || null,
                    iconType: msgData.type === "icon" ? "ThumbsUp" : null,
                };
            });

            onUpdate?.(nextMessages);
        },
        (error) => {
            if (onError) {
                onError(error);
                return;
            }
            console.error("Failed to listen messages:", error);
        }
    );

    return unsubscribe;
}

export {
    sendChatboxMessage,
    sendChatboxThumbsUp,
    markChatboxAsRead,
    listenToChatboxDetail,
    listenToChatboxMessages,
};
