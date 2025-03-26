import { createContext, useContext, useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithPopup,
} from "firebase/auth";
import { auth, db, googleProvider } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null); //add userID state

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log("Auth State Changed:", currentUser);
            if (currentUser) {
                setUser(currentUser);
                setUserId(currentUser.uid); //set UserId
                const userRef = doc(db, "users", currentUser.uid);
                const hostRef = doc(db, "hosts", currentUser.uid);
                const userSnap = await getDoc(userRef);
                const hostSnap = await getDoc(hostRef);

                if (userSnap.exists()) {
                    setUserType("user");
                } else if (hostSnap.exists()) {
                    setUserType("host");
                } else {
                    setUserType(null);
                }
            } else {
                setUser(null);
                setUserType(null);
                setUserId(null); //clear userId
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
    };
    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const googleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    userType: "user",
                });
                setUserType("user");
            } else {
                setUserType(userSnap.data().userType);
            }

            return user;
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            throw error;
        }
    };

    const resetPassword = async (email) => {
        try {
            console.log("Firebase Reset Function Called for:", email);
            return await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error("Firebase Password Reset Error:", error.code, error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setUserType(null);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <UserContext.Provider value={{ createUser, user, userType, login, logout, googleSignIn, resetPassword, loading, userId }}>
            {!loading && children}
        </UserContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(UserContext);
};