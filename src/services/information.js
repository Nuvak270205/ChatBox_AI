import {
    collection,
    doc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
} from "firebase/firestore";

import { db } from "~/config";
import { buildCurrentUserMemberInfo, fetchUserDetailsMap, mergeMemberInfo } from "~/services/chatMember.js";

// Tạo dữ liệu thông tin cuộc chat để hiển thị ở panel Information.
function buildInformationChatInfo(chatData, userId, enrichedMemberInfo) {
    const otherMembers = (chatData.members || []).filter((memberId) => memberId !== userId);
    const isMuted = Boolean(enrichedMemberInfo[userId]?.bell);
    const otherMemberNames = otherMembers
        .map((memberId) => enrichedMemberInfo[memberId]?.name || enrichedMemberInfo[memberId]?.displayName || memberId)
        .filter(Boolean);
    const otherMemberAvatars = otherMembers
        .map((memberId) => enrichedMemberInfo[memberId]?.avatar || enrichedMemberInfo[memberId]?.avatarUrl || enrichedMemberInfo[memberId]?.photoURL || "")
        .filter(Boolean);

    return {
        name: chatData.name || chatData.title || otherMemberNames.join(", ") || "Unknown",
        subname:
            chatData.subname ||
            chatData.description ||
            (otherMemberNames.length > 1 ? `${otherMemberNames.length} thành viên` : otherMemberNames[0] || ""),
        images: otherMemberAvatars,
        memberInfo: enrichedMemberInfo,
        isMuted,
    };
}

// Lắng nghe thông tin cuộc chat cho panel Information theo thời gian thực.
function listenToInformationChatInfo({ chatId, user, onUpdate, onMissing, onError }) {
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
                const otherMembers = (chatData.members || []).filter((memberId) => memberId !== user.uid);
                const freshUserData = await fetchUserDetailsMap(otherMembers);
                const enrichedMemberInfo = mergeMemberInfo(memberInfo, freshUserData);

                const currentUserInfo = buildCurrentUserMemberInfo(memberInfo, null, user.uid, user);
                const existingCurrentUserInfo = memberInfo[user.uid] || {};
                const shouldSyncCurrentUser =
                    existingCurrentUserInfo.name !== currentUserInfo.name ||
                    existingCurrentUserInfo.avatar !== currentUserInfo.avatar ||
                    existingCurrentUserInfo.displayName !== currentUserInfo.displayName;

                if (shouldSyncCurrentUser) {
                    updateDoc(chatRef, {
                        [`memberInfo.${user.uid}`]: currentUserInfo,
                    }).catch((error) => {
                        console.error("Failed to sync current user memberInfo:", error);
                    });
                }

                onUpdate?.(buildInformationChatInfo(chatData, user.uid, enrichedMemberInfo));
            })().catch((error) => {
                if (onError) {
                    onError(error);
                    return;
                }
                console.error("Failed to process information chat:", error);
            });
        },
        (error) => {
            if (onError) {
                onError(error);
                return;
            }
            console.error("Failed to listen information chat:", error);
        }
    );

    return unsubscribe;
}

// Bật/tắt trạng thái thông báo của người dùng trong cuộc chat.
async function toggleInformationNotification({ chatId, userId, muted }) {
    if (!chatId || !userId) {
        return;
    }

    await updateDoc(doc(db, "chatbox", chatId), {
        [`memberInfo.${userId}.bell`]: muted,
    });
}

// Lấy danh sách ảnh và file gần đây từ tin nhắn trong cuộc chat.
async function getInformationMediaAndFiles({ chatId, mediaLimit = 500 }) {
    if (!chatId) {
        return { images: [], files: [] };
    }

    const messagesQuery = query(collection(db, "chatbox", chatId, "messages"), orderBy("createAt", "desc"), limit(mediaLimit));
    const messagesSnapshot = await getDocs(messagesQuery);

    const imageList = [];
    const fileList = [];

    messagesSnapshot.docs.forEach((messageDoc) => {
        const msgData = messageDoc.data();

        if (msgData.content_image && msgData.type !== "file") {
            imageList.push({
                id: messageDoc.id,
                url: msgData.content_image,
                createAt: msgData.createAt,
            });
        }

        if (msgData.titlefile && msgData.type === "file") {
            fileList.push({
                id: messageDoc.id,
                name: msgData.titlefile,
                url: msgData.content_image,
                size: msgData.sizefile || 0,
                createAt: msgData.createAt,
            });
        }
    });

    return {
        images: imageList,
        files: fileList,
    };
}

export {
    listenToInformationChatInfo,
    toggleInformationNotification,
    getInformationMediaAndFiles,
};
