import { collection, getDocs, query, where, getDoc, doc, orderBy, limit, onSnapshot } from "firebase/firestore";

import { db } from "~/config";

// Chuẩn hóa timestamp Firestore hoặc giá trị ngày về kiểu Date của JavaScript.
function toDateValue(value) {
    if (!value) return null;
    if (typeof value?.toDate === "function") return value.toDate();
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

// Lấy thông tin user và trả về dạng map theo userId.
async function fetchUserDetailsMap(userIds) {
    if (!userIds || userIds.length === 0) {
        return {};
    }

    const userDetailsMap = {};
    const uniqueIds = [...new Set(userIds)];

    await Promise.all(
        uniqueIds.map(async (userId) => {
            try {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    userDetailsMap[userId] = userSnap.data();
                }
            } catch (error) {
                // Bỏ qua trường hợp không tìm thấy document user.
            }
        })
    );

    return userDetailsMap;
}

// Gộp memberInfo đang có với dữ liệu hồ sơ user mới nhất.
function enrichMemberInfo(cachedMemberInfo, freshUserData) {
    const enriched = { ...cachedMemberInfo };

    Object.entries(freshUserData).forEach(([userId, userData]) => {
        enriched[userId] = {
            ...enriched[userId],
            name: userData.name || userData.displayName || enriched[userId]?.name || userId,
            avatar: userData.avatar || userData.avatarUrl || userData.photoURL || enriched[userId]?.avatar || "",
            displayName: userData.displayName || enriched[userId]?.displayName,
        };
    });

    return enriched;
}

// Xác định tên hiển thị của người gửi tin nhắn gần nhất.
function getLastSenderName(chatData, memberInfo, userId, latestMessage) {
    const lastSenderId = chatData.lastSenderId || latestMessage?.id_user;

    if (!lastSenderId) {
        return "User";
    }

    if (lastSenderId === userId) {
        return "Bạn";
    }

    return memberInfo[lastSenderId]?.name || memberInfo[lastSenderId]?.displayName || lastSenderId;
}

// Tạo trạng thái đã xem cho UI dựa trên tin nhắn mới nhất và lastRead.
function getReadReceiptState({ messages, chatData, userId, memberInfo }) {
    const latestMessage = messages[messages.length - 1];

    if (!latestMessage) {
        return { check: true, imageSub: "" };
    }

    const latestMessageTime = toDateValue(latestMessage.time);
    if (!latestMessageTime) {
        return { check: false, imageSub: "" };
    }

    const lastReadMap = chatData.lastRead || {};

    if (latestMessage.id_user !== userId) {
        const myLastRead = toDateValue(lastReadMap[userId]);
        return {
            check: Boolean(myLastRead && myLastRead >= latestMessageTime),
            imageSub: "",
        };
    }

    const readerId = (chatData.members || [])
        .filter((memberId) => memberId !== userId)
        .find((memberId) => {
            const memberLastRead = toDateValue(lastReadMap[memberId]);
            return Boolean(memberLastRead && memberLastRead >= latestMessageTime);
        });

    return {
        check: true,
        imageSub: readerId ? memberInfo[readerId]?.avatar || "" : "",
    };
}

// Chuyển document chat thành dữ liệu hiển thị cho UI.
async function buildChatItem(chatDoc, userId) {
    const chatData = chatDoc.data();
    const memberInfo = chatData.memberInfo || {};
    const userMemberInfo = memberInfo[userId] || { bell: false };
    const memberIds = chatData.members || [];

    const freshUserData = await fetchUserDetailsMap(memberIds);
    const enrichedMemberInfo = enrichMemberInfo(memberInfo, freshUserData);

    const messages = [];
    try {
        const messagesRef = collection(chatDoc.ref, "messages");
        const messagesQuery = query(messagesRef, orderBy("createAt", "desc"), limit(50));
        const messagesSnapshot = await getDocs(messagesQuery);

        messagesSnapshot.forEach((msgDoc) => {
            const msgData = msgDoc.data();
            messages.unshift({
                id: msgDoc.id,
                id_user: msgData.senderId,
                content: msgData.content || "",
                time: msgData.createAt?.toDate?.() || new Date(0),
                status: msgData.status || "Đã gửi",
                arrUser: msgData.type === "forward" ? [msgData.senderId] : [],
                type: msgData.type || "normal",
                content_image: msgData.content_image || "",
                titlefile: msgData.titlefile || "",
                sizefile: msgData.sizefile || 0,
                rep: msgData.rep || null,
                Icon: msgData.Icon || null,
            });
        });
    } catch (error) {
        // Bỏ qua trường hợp chat chưa có subcollection messages.
    }

    const otherMembers = (chatData.members || []).filter((memberId) => memberId !== userId);
    const otherMemberNames = otherMembers.map((memberId) => enrichedMemberInfo[memberId]?.name || enrichedMemberInfo[memberId]?.displayName || memberId);
    const latestMessage = messages[messages.length - 1];
    const readReceiptState = getReadReceiptState({
        messages,
        chatData,
        userId,
        memberInfo: enrichedMemberInfo,
    });

    return {
        id: chatDoc.id,
        members: chatData.members || [],
        memberInfo: enrichedMemberInfo,
        images: otherMembers.map((memberId) => enrichedMemberInfo[memberId]?.avatar || "").filter(Boolean),
        user: otherMemberNames.join(", ") || "Unknown",
        content: chatData.lastMessage || latestMessage?.content || "No message",
        time: chatData.lastMessageAt?.toDate?.() || latestMessage?.time || new Date(0),
        bell: Boolean(userMemberInfo.bell),
        imageSub: readReceiptState.imageSub || enrichedMemberInfo[chatData.lastSenderId]?.avatar || "",
        check: readReceiptState.check,
        senderName: getLastSenderName(chatData, enrichedMemberInfo, userId, latestMessage),
        data_Message: messages,
    };
}

// Dùng chung hàm build để giữ mapping dữ liệu chat nhất quán.
async function processChatData(chatDoc, userId) {
    return buildChatItem(chatDoc, userId);
}

// Lắng nghe realtime chat theo status và trả danh sách đã chuẩn hóa/sắp xếp.
function listenToChatItems(status, userId, onUpdate) {
    if (!userId) {
        return () => {};
    }

    const chatsQuery = query(
        collection(db, "chatbox"),
        where("members", "array-contains", userId)
    );

    const unsubscribe = onSnapshot(
        chatsQuery,
        async (chatsSnapshot) => {
            const filteredDocs = chatsSnapshot.docs.filter((chatDoc) => chatDoc.data()?.status === status);
            const chatItems = await Promise.all(filteredDocs.map((chatDoc) => processChatData(chatDoc, userId)));
            onUpdate(chatItems.sort((a, b) => b.time - a.time));
        },
        () => {
            onUpdate([]);
        }
    );

    return unsubscribe;
}

// Danh sách realtime các chat đang hoạt động của user hiện tại.
function listenToActiveChatItems(userId, onUpdate) {
    return listenToChatItems("active", userId, onUpdate);
}

// Danh sách realtime các chat marketplace của user hiện tại.
function listenToMarketChatItems(userId, onUpdate) {
    return listenToChatItems("market", userId, onUpdate);
}

// Danh sách realtime các chat chờ duyệt của user hiện tại.
function listenToOpendingChatItems(userId, onUpdate) {
    return listenToChatItems("pending", userId, onUpdate);
}

// Danh sách realtime các chat spam của user hiện tại.
function listenToSpamChatItems(userId, onUpdate) {
    return listenToChatItems("spam", userId, onUpdate);
}

// Danh sách realtime các chat đã lưu trữ của user hiện tại.
function listenToArchivedChatItems(userId, onUpdate) {
    return listenToChatItems("archived", userId, onUpdate);
}

// Danh sách realtime chat kênh theo group id.
function listenToChannelChatsByGroupId(groupId, userId, onUpdate) {
    if (!groupId || !userId) {
        return () => {};
    }

    const chatsQuery = query(
        collection(db, "chatbox"),
        where("members", "array-contains", userId)
    );

    const unsubscribe = onSnapshot(
        chatsQuery,
        async (chatsSnapshot) => {
            const filteredDocs = chatsSnapshot.docs.filter((chatDoc) => {
                const chatData = chatDoc.data();
                return chatData?.type === "channel" && String(chatData?.group_id) === String(groupId);
            });

            const chatItems = await Promise.all(filteredDocs.map((chatDoc) => processChatData(chatDoc, userId)));
            onUpdate(chatItems.sort((a, b) => b.time - a.time));
        },
        () => {
            onUpdate([]);
        }
    );

    return unsubscribe;
}

export {
    listenToActiveChatItems,
    listenToMarketChatItems,
    listenToOpendingChatItems,
    listenToSpamChatItems,
    listenToArchivedChatItems,
    listenToChannelChatsByGroupId,
};