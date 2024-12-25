import { createContext, useEffect, useState, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
export const AuthContext = createContext();
import { auth, db } from "@/service/firebase/firebaseconfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleFirebaseError = (error) => {
    let errorMessage = "Une erreur est survenue";

    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "Cet email est déjà enregistré.";
        break;
      case "auth/invalid-email":
        errorMessage = "Adresse email invalide.";
        break;
      case "auth/weak-password":
        errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
        break;
      case "auth/user-not-found":
      case "auth/wrong-password":
        errorMessage = "Email ou mot de passe invalide.";
        break;
      case "auth/too-many-requests":
        errorMessage = "Trop de tentatives. Veuillez réessayer plus tard.";
        break;
      case "auth/network-request-failed":
        errorMessage =
          "Problème de connexion. Vérifiez votre connexion internet.";
        break;
    }

    Alert.alert("Erreur", errorMessage);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoading(true);
        setIsAuthenticated(true);
        setUser(user);
        updateUserData(user.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const updateUserData = async (userId) => {
    docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUser((prevUser) => ({
        ...prevUser,
        name: data.name,
        userId: data.UserId,
        email: data.email,
        photoURL: data.photoURL,
      }));
    }
  };

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    setIsLoading(true);
    try {
      await updateUserData(auth.currentUser.uid);
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const userData = userDoc.data();
      return { success: true, user: { ...userCredential.user, ...userData } };
    } catch (error) {
      if (error instanceof FirebaseError) {
        handleFirebaseError(error);
      } else {
        Alert.alert("Erreur", "Une erreur inattendue est survenue");
      }
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
        name
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email: userCredential.user.email,
        UserId: userCredential.user.uid,
      });
      return { success: true, data: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message }; // Add this return
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        logout,
        login,
        register,
        isLoading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return value;
};
