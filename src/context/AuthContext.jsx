import { createContext, useContext, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // ✅ Store userType

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserType(userSnap.data().userType); // ✅ Fetch userType
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
      setUserType(userSnap.data().userType); // ✅ Set userType on login
    } else {
      setUserType(null);
    }
    
    return userCredential;
  };

  const logout = () => {
    setUserType(null);  // ✅ Clear userType on logout
    return signOut(auth);
  };

  return (
    <UserContext.Provider value={{ createUser, user, userType, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
