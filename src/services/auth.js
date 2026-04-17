import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "~/config";

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

async function logout() {
    await signOut(auth);
}

export { fetchUserProfile, login, register, logout };