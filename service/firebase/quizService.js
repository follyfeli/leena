import { db, auth } from "./firebaseconfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

export const quizService = {
  async getQuiz(quizId) {
    try {
      const quizRef = doc(db, "quizzes", quizId);
      const quizSnap = await getDoc(quizRef);
      if (quizSnap.exists()) {
        return { id: quizSnap.id, ...quizSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching quiz:", error);
      throw error;
    }
  },

  async getUserQuizzes(userId) {
    try {
      const q = query(
        collection(db, "quizzes"),
        where("createdBy", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching user quizzes:", error);
      throw error;
    }
  },

  async saveQuizProgress(quizId, questionId, answer) {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const progressRef = doc(db, "userProgress", `${userId}_${quizId}`);
      const progressSnap = await getDoc(progressRef);

      if (!progressSnap.exists()) {
        await addDoc(collection(db, "userProgress"), {
          userId,
          quizId,
          startedAt: serverTimestamp(),
          answers: [
            {
              questionId,
              ...answer,
              timestamp: serverTimestamp(),
            },
          ],
          currentQuestionIndex: 0,
          correctAnswers: answer.isCorrect ? 1 : 0,
          wrongAnswers: answer.isCorrect ? 0 : 1,
        });
      } else {
        await updateDoc(progressRef, {
          answers: arrayUnion({
            questionId,
            ...answer,
            timestamp: serverTimestamp(),
          }),
          currentQuestionIndex: progressSnap.data().currentQuestionIndex + 1,
          correctAnswers:
            progressSnap.data().correctAnswers + (answer.isCorrect ? 1 : 0),
          wrongAnswers:
            progressSnap.data().wrongAnswers + (answer.isCorrect ? 0 : 1),
          lastUpdated: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error saving progress:", error);
      throw error;
    }
  },

  async createQuiz(quizData) {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const docRef = await addDoc(collection(db, "quizzes"), {
        ...quizData,
        createdBy: userId,
        createdAt: serverTimestamp(),
        totalAttempts: 0,
        averageScore: 0,
      });

      return docRef.id;
    } catch (error) {
      console.error("Error creating quiz:", error);
      throw error;
    }
  },
};
