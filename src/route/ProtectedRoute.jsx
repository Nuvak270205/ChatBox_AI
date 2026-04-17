import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "~/config";
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

                const profile = await fetchUserProfile(user.uid);

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