import { doc, getDoc } from "firebase/firestore";
import { db } from "~/config";

// Lấy thông tin user và trả về dạng map theo userId.
async function fetchUserDetailsMap(userIds) {
    if (!userIds || userIds.length === 0) {
        return {};
    }

    const uniqueIds = [...new Set(userIds.filter(Boolean))];
    const userDetailsMap = {};

    await Promise.all(
        uniqueIds.map(async (userId) => {
            try {
                const userSnap = await getDoc(doc(db, "users", userId));
                if (userSnap.exists()) {
                    userDetailsMap[userId] = userSnap.data();
                }
            } catch (error) {
                // Bỏ qua trường hợp không tìm thấy user.
            }
        })
    );

    return userDetailsMap;
}

// Gộp memberInfo hiện có với dữ liệu user mới lấy được.
function mergeMemberInfo(cachedMemberInfo, freshUserData) {
    const merged = { ...(cachedMemberInfo || {}) };

    Object.entries(freshUserData || {}).forEach(([userId, userData]) => {
        merged[userId] = {
            ...merged[userId],
            name: userData?.name || userData?.displayName || merged[userId]?.name || userId,
            avatar: userData?.avatar || userData?.avatarUrl || userData?.photoURL || merged[userId]?.avatar || "",
            displayName: userData?.displayName || merged[userId]?.displayName,
        };
    });

    return merged;
}

// Tạo memberInfo chuẩn cho người dùng hiện tại.
function buildCurrentUserMemberInfo(existingMemberInfo, userData, userId, userProfile) {
    const currentMemberInfo = existingMemberInfo?.[userId] || {};

    return {
        ...currentMemberInfo,
        name:
            userData?.name ||
            userData?.displayName ||
            currentMemberInfo.name ||
            userProfile?.displayName ||
            userProfile?.name ||
            userId,
        avatar:
            userData?.avatar ||
            userData?.avatarUrl ||
            userData?.photoURL ||
            currentMemberInfo.avatar ||
            userProfile?.avatar ||
            userProfile?.avatarUrl ||
            userProfile?.photoURL ||
            "",
        displayName: userData?.displayName || currentMemberInfo.displayName || userProfile?.displayName || "",
    };
}

export {
    fetchUserDetailsMap,
    mergeMemberInfo,
    buildCurrentUserMemberInfo,
};
