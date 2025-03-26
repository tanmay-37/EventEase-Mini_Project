import { createContext, useContext, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail ,
  signInWithPopup
} from "firebase/auth";
import { auth, db, googleProvider } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserType(userSnap.data().userType);
        } else {
          setUserType(null);
        }
      } else {
        setUserType(null);
      }
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "users", userCredential.user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUserType(userSnap.data().userType);
    } else {
      setUserType(null);
    }
    
    return userCredential;
  };

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // If new user, save to Firestore
        await setDoc(userRef, { 
          email: user.email, 
          userType: "user"
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


  const logout = () => {
    setUserType(null); 
    return signOut(auth);
  };

  return (
    <UserContext.Provider value={{ createUser, user, userType, login, logout, googleSignIn, resetPassword  }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
