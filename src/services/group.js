import { collectionGroup, getDoc, getDocs } from "firebase/firestore";

import { db } from "~/config";

// Lấy toàn bộ bản ghi member khớp với userId trong các group.
async function getMemberSnapshotsByUserId(userId) {
    const allMembers = await getDocs(collectionGroup(db, "members"));

    const matchingDocs = allMembers.docs.filter((memberDoc) => {
        const dataUserId = memberDoc.data()?.userId;

        return memberDoc.id === userId || dataUserId === userId;
    });

    return matchingDocs;
}

// Lấy danh sách group mà user hiện tại đang tham gia.
async function getUserGroups(userId) {
    if (!userId) {
        return [];
    }

    const memberSnapshots = await getMemberSnapshotsByUserId(userId);

    const uniqueGroupRefs = new Map();

    memberSnapshots.forEach((memberDoc) => {
        const groupRef = memberDoc.ref.parent?.parent;

        if (groupRef) {
            uniqueGroupRefs.set(groupRef.id, groupRef);
        }
    });

    const groupEntries = await Promise.all(
        [...uniqueGroupRefs.values()].map(async (groupRef) => {
            const groupSnapshot = await getDoc(groupRef);

            if (!groupSnapshot.exists()) {
                return null;
            }

            const data = groupSnapshot.data();

            return {
                id_G: groupSnapshot.id,
                to: "/group",
                title: data?.name || groupSnapshot.id,
                image: data?.avatar || "",
            };
        })
    );

    return groupEntries
        .filter(Boolean)
        .sort((a, b) => a.title.localeCompare(b.title));
}

export { getUserGroups };