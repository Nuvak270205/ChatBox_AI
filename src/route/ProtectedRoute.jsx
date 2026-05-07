import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

import { auth, db } from "~/config";
import { clearAuthUser, setAuthUser } from "~/store/authSlice";
import { fetchUserProfile } from "~/services/auth";

function ProtectedRoute() {
    const [isAuth, setIsAuth] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                dispatch(clearAuthUser());
                setIsAuth(false);
                return;
            }

            try {
                const token = await user.getIdToken();

                if (!token) {
                    dispatch(clearAuthUser());
                    setIsAuth(false);
                    return;
                }

                let profile = await fetchUserProfile(user.uid);

                // If user doc is missing in Firestore (accounts created via Auth console),
                // create a minimal user document so email-based lookup works.
                if (!profile) {
                    try {
                        const newUserDoc = {
                            uid: user.uid,
                            name: user.displayName || "",
                            email: user.email || "",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        };

                        await setDoc(doc(db, "users", user.uid), newUserDoc, { merge: true });
                        profile = newUserDoc;
                    } catch (err) {
                        console.error("Failed to create user doc for auth-only user:", err);
                    }
                }

                dispatch(
                    setAuthUser({
                        token,
                        user: {
                            uid: user.uid,
                            email: user.email,
                            emailVerified: user.emailVerified,
                            ...profile,
                        },
                    })
                );
                setIsAuth(true);
            } catch (error) {
                dispatch(clearAuthUser());
                setIsAuth(false);
            }
        });

        return unsubscribe;
    }, [dispatch]);

    if (isAuth === null) {
        return null;
    }

    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;