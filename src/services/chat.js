import { addDoc, collection, getDocs, query, where, getDoc, doc, orderBy, limit, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "~/config";

// Constant cho AI Chat
const AI_UID = "hSVzmwx9FEQfbY0L5TxbCXbti3W2";
const AI_NAME = "AI Giải Đáp";

// Chuẩn hóa timestamp Firestore hoặc giá trị ngày về kiểu Date của JavaScript.
function toDateValue(value) {
    if (!value) return null;
    if (typeof value?.toDate === "function") return value.toDate();
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

// Lấy thông tin user theo email.
async function findUserByEmail(email) {
    const trimmedEmail = email?.trim();

    if (!trimmedEmail) {
        return null;
    }

    const searchValues = trimmedEmail.toLowerCase() === trimmedEmail
        ? [trimmedEmail]
        : [trimmedEmail, trimmedEmail.toLowerCase()];

    const queryFields = ["email", "username"];

    for (const field of queryFields) {
        for (const searchValue of searchValues) {
            const usersQuery = query(
                collection(db, "users"),
                where(field, "==", searchValue),
                limit(1)
            );

            const usersSnapshot = await getDocs(usersQuery);

            if (usersSnapshot.empty) {
                continue;
            }

            const userDoc = usersSnapshot.docs[0];

            return {
                uid: userDoc.id,
                ...userDoc.data(),
            };
        }
    }

    const allUsersSnapshot = await getDocs(collection(db, "users"));
    const normalizedEmail = trimmedEmail.toLowerCase();
    const matchedUserDoc = allUsersSnapshot.docs.find((userDoc) => {
        const userEmail = userDoc.data()?.email;
        const userNameField = userDoc.data()?.username;
        const normalizedUserEmail = typeof userEmail === "string" ? userEmail.trim().toLowerCase() : "";
        const normalizedUserName = typeof userNameField === "string" ? userNameField.trim().toLowerCase() : "";
        return normalizedUserEmail === normalizedEmail || normalizedUserName === normalizedEmail;
    });

    if (matchedUserDoc) {
        return {
            uid: matchedUserDoc.id,
            ...matchedUserDoc.data(),
        };
    }

    return null;
}

// Tìm cuộc chat riêng 1-1 giữa 2 người dùng.
async function findDirectChatBetweenUsers(currentUserId, targetUserId) {
    if (!currentUserId || !targetUserId) {
        return null;
    }

    const chatsSnapshot = await getDocs(
        query(
            collection(db, "chatbox"),
            where("members", "array-contains", currentUserId)
        )
    );

    return (
        chatsSnapshot.docs.find((chatDoc) => {
            const chatData = chatDoc.data();
            return (
                chatData?.type === "normal" &&
                Array.isArray(chatData?.members) &&
                chatData.members.length === 2 &&
                chatData.members.includes(targetUserId)
            );
        }) || null
    );
}

// Tìm cuộc chat riêng 1-1 theo email của thành viên còn lại.
async function findDirectChatByOtherMemberEmail(currentUserId, email) {
    const normalizedEmail = email?.trim().toLowerCase();

    if (!currentUserId || !normalizedEmail) {
        return null;
    }

    const chatsSnapshot = await getDocs(
        query(
            collection(db, "chatbox"),
            where("members", "array-contains", currentUserId)
        )
    );

    for (const chatDoc of chatsSnapshot.docs) {
        const chatData = chatDoc.data();
        const members = chatData?.members || [];

        if (chatData?.type !== "normal" || members.length !== 2) {
            continue;
        }

        const otherMemberId = members.find((memberId) => memberId !== currentUserId);
        if (!otherMemberId) {
            continue;
        }

        try {
            // Try reading user doc first
            const otherUserSnap = await getDoc(doc(db, "users", otherMemberId));
            const otherUserData = otherUserSnap.exists() ? otherUserSnap.data() : null;

            const otherUserEmail = otherUserData?.email;
            const otherUserName = otherUserData?.username;
            const normalizedOtherEmail = typeof otherUserEmail === "string" ? otherUserEmail.trim().toLowerCase() : "";
            const normalizedOtherUsername = typeof otherUserName === "string" ? otherUserName.trim().toLowerCase() : "";

            if (normalizedOtherEmail === normalizedEmail || normalizedOtherUsername === normalizedEmail) {
                return {
                    chatId: chatDoc.id,
                    targetUser: {
                        uid: otherMemberId,
                        ...(otherUserData || {}),
                    },
                };
            }

            // Fallback: inspect memberInfo inside chat document for name/username/email
            const memberInfo = chatData.memberInfo || {};
            const otherInfo = memberInfo[otherMemberId] || {};
            const infoEmail = otherInfo.email || otherInfo.name || otherInfo.displayName || otherInfo.username || "";
            if (typeof infoEmail === "string" && infoEmail.trim().toLowerCase() === normalizedEmail) {
                return {
                    chatId: chatDoc.id,
                    targetUser: {
                        uid: otherMemberId,
                        ...otherInfo,
                    },
                };
            }
        } catch (error) {
            // Ignore errors and continue checking other chats
        }
    }

    return null;
}

// Tạo hoặc lấy cuộc chat riêng 1-1 giữa 2 người dùng.
async function createOrOpenDirectChat({ currentUser, targetUser }) {
    if (!currentUser?.uid || !targetUser?.uid) {
        return null;
    }

    const existingChat = await findDirectChatBetweenUsers(currentUser.uid, targetUser.uid);
    if (existingChat) {
        return existingChat.id;
    }

    // Use deterministic chatId for direct chats to avoid race-created duplicates.
    const ids = [currentUser.uid, targetUser.uid].sort();
    const deterministicId = `d_${ids.join("_")}`;

    const chatRef = doc(db, "chatbox", deterministicId);
    const chatSnap = await getDoc(chatRef);
    if (chatSnap.exists()) {
        return chatSnap.id;
    }
    const currentMemberInfo = {
        name: currentUser.name || currentUser.displayName || currentUser.email || currentUser.uid,
        avatar: currentUser.avatar || currentUser.avatarUrl || currentUser.photoURL || "",
        displayName: currentUser.displayName || "",
        bell: false,
    };

    const targetMemberInfo = {
        name: targetUser.name || targetUser.displayName || targetUser.email || targetUser.uid,
        avatar: targetUser.avatar || targetUser.avatarUrl || targetUser.photoURL || "",
        displayName: targetUser.displayName || "",
        bell: false,
    };

    const chatData = {
        type: "normal",
        status: "active",
        members: [currentUser.uid, targetUser.uid],
        memberInfo: {
            [currentUser.uid]: currentMemberInfo,
            [targetUser.uid]: targetMemberInfo,
        },
        lastMessage: "",
        lastMessageAt: serverTimestamp(),
        lastSenderId: "",
        lastRead: {
            [currentUser.uid]: serverTimestamp(),
            [targetUser.uid]: serverTimestamp(),
        },
    };

    await setDoc(chatRef, chatData, { merge: false });

    return chatRef.id;
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

    if (lastSenderId === AI_UID) {
        return AI_NAME;
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

    const senderId = latestMessage.id_user;
    const members = chatData.members || [];
    const lastReadMap = chatData.lastRead || {};
    const readerIds = members
        .filter((memberId) => memberId !== senderId)
        .filter((memberId) => {
            const memberLastRead = toDateValue(lastReadMap[memberId]);
            return Boolean(memberLastRead && memberLastRead >= latestMessageTime);
        });

    if (senderId !== userId) {
        const prioritizedReaderId = readerIds.find((memberId) => memberId !== userId) || readerIds[0] || "";
        return {
            check: readerIds.length > 0,
            imageSub: prioritizedReaderId ? memberInfo[prioritizedReaderId]?.avatar || "" : "",
        };
    }

    const readerId = readerIds[0] || "";

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
        imageSub: readReceiptState.imageSub,
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
    findUserByEmail,
    findDirectChatBetweenUsers,
    findDirectChatByOtherMemberEmail,
    createOrOpenDirectChat,
    listenToActiveChatItems,
    listenToMarketChatItems,
    listenToOpendingChatItems,
    listenToSpamChatItems,
    listenToArchivedChatItems,
    listenToChannelChatsByGroupId,
};