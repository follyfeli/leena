import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, db } from "@/service/firebase/firebaseconfig"; // Adjust the path
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
const { width } = Dimensions.get("window");

const Signin = () => {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const { register, login } = useAuth();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const slideAnim = useState(new Animated.Value(0))[0];
  const fadeAnim = useState(new Animated.Value(1))[0];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email est invalide";
    }

    if (currentScreen !== "forgot") {
      if (!formData.password) {
        newErrors.password = "Mot de passe est requis";
      } else if (formData.password.length < 6) {
        newErrors.password =
          "Le mot de passe doit contenir au moins 6 caractères";
      }
    }

    if (currentScreen === "signup" && !formData.name) {
      newErrors.name = "Nom est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async () => {
    if (!validateForm() || loading) return;

    setLoading(true);
    try {
      switch (currentScreen) {
        case "login":
          const loginresult = await login(formData.email, formData.password);
          if (loginresult.success) {
            router.replace("/(tabs)/profile");
          } else {
            Alert.alert("Erreur", result.error);
          }
          break;

        case "signup":
          const result = await register(
            formData.email,
            formData.password,
            formData.name
          );
          if (result.success) {
            router.replace("/(tabs)/profile");
          } else {
            Alert.alert("Erreur", result.error);
          }
          break;
        /* case "signup":
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );

          await setDoc(doc(db, "users", userCredential?.user?.uid), {
            name: formData.name,
            email: formData.email,
            userId: userCredential?.user?.uid,
          });
          Alert.alert("Succès", "Compte créé avec succès!");
          break; */

        case "forgot":
          await sendPasswordResetEmail(auth, formData.email);
          Alert.alert(
            "Succès",
            "Email de réinitialisation envoyé. Veuillez vérifier votre boîte de réception."
          );
          switchScreen("login", "left");
          break;
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        handleFirebaseError(error);
      } else {
        Alert.alert("Erreur", "Une erreur inattendue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  const animate = (direction) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction === "right" ? width : -width,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      slideAnim.setValue(direction === "right" ? -width : width);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const switchScreen = (screen, direction) => {
    setErrors({});
    animate(direction);
    setTimeout(() => {
      setCurrentScreen(screen);
    }, 200);
  };

  const renderInputField = (
    placeholder,
    value,
    field,
    icon,
    secureTextEntry
  ) => (
    <View>
      <View style={styles.inputContainer}>
        <MaterialIcons
          name={icon}
          size={24}
          color="#666"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => setFormData({ ...formData, [field]: text })}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="#666"
          autoCapitalize="none"
          autoComplete={field === "email" ? "email" : "off"}
          keyboardType={field === "email" ? "email-address" : "default"}
          textContentType={
            field === "email"
              ? "emailAddress"
              : field === "password"
              ? currentScreen === "signup"
                ? "newPassword"
                : "password"
              : "name"
          }
        />
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderLoginScreen = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Bienvenue</Text>
      <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>
      {renderInputField("Email", formData.email, "email", "email")}
      {renderInputField(
        "Mot de passe",
        formData.password,
        "password",
        "lock",
        true
      )}
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => switchScreen("forgot", "right")}
      >
        <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </TouchableOpacity>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Pas encore de compte ? </Text>
        <TouchableOpacity onPress={() => switchScreen("signup", "right")}>
          <Text style={styles.switchAction}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSignupScreen = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Créer un compte</Text>
      <Text style={styles.subtitle}>Inscrivez-vous pour commencer</Text>
      {renderInputField("Nom complet", formData.name, "name", "person")}
      {renderInputField("Email", formData.email, "email", "email")}
      {renderInputField(
        "Mot de passe",
        formData.password,
        "password",
        "lock",
        true
      )}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>S'inscrire</Text>
        )}
      </TouchableOpacity>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Déjà un compte ? </Text>
        <TouchableOpacity onPress={() => switchScreen("login", "left")}>
          <Text style={styles.switchAction}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderForgotPasswordScreen = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Réinitialiser</Text>
      <Text style={styles.subtitle}>
        Entrez votre email pour réinitialiser le mot de passe
      </Text>
      {renderInputField("Email", formData.email, "email", "email")}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Envoyer le lien</Text>
        )}
      </TouchableOpacity>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Retour à </Text>
        <TouchableOpacity onPress={() => switchScreen("login", "left")}>
          <Text style={styles.switchAction}>la connexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            transform: [{ translateX: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        {currentScreen === "login" && renderLoginScreen()}
        {currentScreen === "signup" && renderSignupScreen()}
        {currentScreen === "forgot" && renderForgotPasswordScreen()}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  animatedContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 5,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 15,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#666",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  switchText: {
    color: "#666",
    fontSize: 14,
  },
  switchAction: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Signin;
