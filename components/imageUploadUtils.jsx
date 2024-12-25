import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/service/firebase/firebaseconfig";

// Simple image upload function
export const uploadImageToFirebase = async (uri, folder = "quiz-images") => {
  try {
    if (!uri) return null;

    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;
    const imageRef = ref(storage, filename);

    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Process all quiz images
export const processQuizImages = async (quizState, coverImage) => {
  try {
    // Upload cover image if exists
    const coverImageUrl = coverImage
      ? await uploadImageToFirebase(coverImage, "quiz-covers")
      : null;

    // Process question images
    const processedQuestions = await Promise.all(
      quizState.questions.map(async (question) => ({
        ...question,
        backgroundImage: question.backgroundImage
          ? await uploadImageToFirebase(
              question.backgroundImage,
              "question-images"
            )
          : null,
      }))
    );

    return {
      coverImageUrl,
      processedQuestions,
    };
  } catch (error) {
    console.error("Image processing error:", error);
    throw error;
  }
};

// Save quiz with images
export const saveQuizWithImages = async (quizState, coverImage) => {
  const { coverImageUrl, processedQuestions } = await processQuizImages(
    quizState,
    coverImage
  );

  return {
    ...quizState,
    coverImage: coverImageUrl,
    questions: processedQuestions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
