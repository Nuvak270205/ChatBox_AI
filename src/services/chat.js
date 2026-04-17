import { collection, getDocs, query, where, getDoc, doc, orderBy, limit, onSnapshot } from "firebase/firestore";

import { db } from "~/config";

function toDateValue(value) {
    if (!value) return null;
    if (typeof value?.toDate === "function") return value.toDate();
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

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
                // Ignore missing user documents.
            }
        })
    );

    return userDetailsMap;
}

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
        // Ignore missing message subcollections.
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

async function getActiveChatItems(userId) {
    if (!userId) return [];

    const chatsQuery = query(
        collection(db, "chatbox"),
        where("status", "==", "active"),
        where("members", "array-contains", userId)
    );

    const chatsSnapshot = await getDocs(chatsQuery);
    const chatItems = await Promise.all(chatsSnapshot.docs.map((chatDoc) => buildChatItem(chatDoc, userId)));

    return chatItems.sort((a, b) => b.time - a.time);
}

async function getMarketChatItems(userId) {
    if (!userId) return [];

    const chatsQuery = query(
        collection(db, "chatbox"),
        where("status", "==", "market"),
        where("members", "array-contains", userId)
    );

    const chatsSnapshot = await getDocs(chatsQuery);
    const chatItems = await Promise.all(chatsSnapshot.docs.map((chatDoc) => buildChatItem(chatDoc, userId)));

    return chatItems.sort((a, b) => b.time - a.time);
}

async function getOpendingChatItems(userId) {
    if (!userId) return [];

    const chatsQuery = query(
        collection(db, "chatbox"),
        where("status", "==", "pending"),
        where("members", "array-contains", userId)
    );

    const chatsSnapshot = await getDocs(chatsQuery);
    const chatItems = await Promise.all(chatsSnapshot.docs.map((chatDoc) => buildChatItem(chatDoc, userId)));

    return chatItems.sort((a, b) => b.time - a.time);
}

async function getSpamChatItems(userId) {
    if (!userId) return [];

    const chatsQuery = query(
        collection(db, "chatbox"),
        where("status", "==", "spam"),
        where("members", "array-contains", userId)
    );

    const chatsSnapshot = await getDocs(chatsQuery);
    const chatItems = await Promise.all(chatsSnapshot.docs.map((chatDoc) => buildChatItem(chatDoc, userId)));

    return chatItems.sort((a, b) => b.time - a.time);
}

async function processChatData(chatDoc, userId) {
    return buildChatItem(chatDoc, userId);
}

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

function listenToActiveChatItems(userId, onUpdate) {
    return listenToChatItems("active", userId, onUpdate);
}

function listenToMarketChatItems(userId, onUpdate) {
    return listenToChatItems("market", userId, onUpdate);
}

function listenToOpendingChatItems(userId, onUpdate) {
    return listenToChatItems("pending", userId, onUpdate);
}

function listenToSpamChatItems(userId, onUpdate) {
    return listenToChatItems("spam", userId, onUpdate);
}

function listenToArchivedChatItems(userId, onUpdate) {
    return listenToChatItems("archived", userId, onUpdate);
}

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
    getActiveChatItems,
    getMarketChatItems,
    getOpendingChatItems,
    getSpamChatItems,
    listenToActiveChatItems,
    listenToMarketChatItems,
    listenToOpendingChatItems,
    listenToSpamChatItems,
    listenToArchivedChatItems,
    listenToChannelChatsByGroupId,
};