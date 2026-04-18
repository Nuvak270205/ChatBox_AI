import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { auth, db } from "~/config";

// Lấy hồ sơ người dùng theo uid từ Firestore.
async function fetchUserProfile(uid) {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        return null;
    }

    return {
        uid: userSnap.id,
        ...userSnap.data(),
    };
}

// Đăng nhập bằng email/password và trả về token cùng thông tin user.
async function login(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;
    const token = await firebaseUser.getIdToken();
    const profile = await fetchUserProfile(firebaseUser.uid);

    return {
        token,
        user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
            ...(profile ?? {}),
        },
    };
}

// Đăng ký tài khoản mới, đồng thời khởi tạo hồ sơ user trong Firestore.
async function register({ name, email, password }) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;
    const token = await firebaseUser.getIdToken();

    const userData = {
        uid: firebaseUser.uid,
        name,
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", firebaseUser.uid), userData, { merge: true });

    const profile = await fetchUserProfile(firebaseUser.uid);

    return {
        token,
        user: {
            ...userData,
            ...(profile ?? {}),
        },
    };
}

// Đăng xuất tài khoản hiện tại.
async function logout() {
    await signOut(auth);
}

// Cập nhật username cho người dùng.
async function updateUsername(uid, username) {
    if (!uid) {
        throw new Error("Thiếu user id");
    }

    const normalizedUsername = username?.trim();
    if (!normalizedUsername) {
        throw new Error("Username không được để trống");
    }

    await updateDoc(doc(db, "users", uid), {
        username: normalizedUsername,
        updatedAt: new Date().toISOString(),
    });

    return fetchUserProfile(uid);
}

export { fetchUserProfile, login, register, logout, updateUsername };