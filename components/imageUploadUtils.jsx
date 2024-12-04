import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/service/firebase/firebaseconfig";
import * as FileSystem from "expo-file-system";

// Enhanced URI validation
const validateImageUri = (uri) => {
  if (!uri) return false;
  // Check if it's a valid Expo file cache URI or valid image URI
  return (
    typeof uri === "string" &&
    (uri.startsWith(
      "file:///data/user/0/host.exp.exponent/cache/ExperienceData/"
    ) ||
      /\.(jpg|jpeg|png|gif|webp)$/i.test(uri))
  );
};

// Enhanced blob conversion with file system handling
const uriToBlob = async (uri) => {
  try {
    // For Expo cached files, read the file first
    if (uri.startsWith("file://")) {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      // Read the file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to blob
      const response = await fetch(`data:image/jpeg;base64,${base64}`);
      return await response.blob();
    }

    // For regular URIs, fetch directly
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.blob();
  } catch (error) {
    throw new Error(`Failed to convert URI to blob: ${error.message}`);
  }
};

// Enhanced image upload function
export const uploadImageToFirebase = async (uri, folder = "quiz-images") => {
  try {
    // Validate input
    if (!validateImageUri(uri)) {
      console.warn("Invalid or missing image URI:", uri);
      return null;
    }

    // Convert URI to blob with enhanced error handling
    const blob = await uriToBlob(uri);

    // Validate blob
    if (!blob || blob.size === 0) {
      throw new Error("Invalid blob generated from URI");
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = uri.split(".").pop() || "jpg";
    const filename = `${folder}/${timestamp}-${randomString}.${extension}`;

    // Create storage reference with explicit path
    const storageRef = ref(storage, filename);

    // Upload blob with metadata
    const metadata = {
      contentType: blob.type || "image/jpeg",
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        originalUri: uri,
      },
    };

    // Perform upload with progress tracking
    const uploadTask = await uploadBytes(storageRef, blob, metadata);

    if (!uploadTask?.ref) {
      throw new Error("Upload failed - no reference returned");
    }

    // Get download URL
    const downloadURL = await getDownloadURL(uploadTask.ref);

    // Cleanup
    blob.close();

    return downloadURL;
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Enhanced quiz image processing
export const processQuizImages = async (quizState, coverImage) => {
  console.log("Starting quiz image processing");

  try {
    // Upload cover image if exists
    let coverImageUrl = null;
    if (coverImage) {
      console.log("Processing cover image");
      coverImageUrl = await uploadImageToFirebase(coverImage, "quiz-covers");
      console.log("Cover image processed:", coverImageUrl);
    }

    // Process question images
    const processedQuestions = await Promise.all(
      quizState.questions.map(async (question, index) => {
        console.log(
          `Processing question ${index + 1} image:`,
          question.backgroundImage
        );

        let processedQuestion = { ...question };

        if (question.backgroundImage) {
          try {
            const imageUrl = await uploadImageToFirebase(
              question.backgroundImage,
              "question-images"
            );
            processedQuestion.backgroundImage = imageUrl;
            console.log(`Question ${index + 1} image processed:`, imageUrl);
          } catch (error) {
            console.error(
              `Failed to process question ${index + 1} image:`,
              error
            );
            processedQuestion.backgroundImage = null;
          }
        }

        return processedQuestion;
      })
    );

    return {
      coverImageUrl,
      processedQuestions,
    };
  } catch (error) {
    console.error("Quiz image processing error:", error);
    throw error;
  }
};

// Enhanced save quiz function
export const saveQuizWithImages = async (quizState, coverImage) => {
  console.log("Starting saveQuizWithImages");

  try {
    // Process all images first
    const { coverImageUrl, processedQuestions } = await processQuizImages(
      quizState,
      coverImage
    );

    // Prepare final quiz data
    const quizData = {
      ...quizState,
      coverImage: coverImageUrl,
      questions: processedQuestions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Quiz data prepared successfully");
    return quizData;
  } catch (error) {
    console.error("Save quiz error:", error);
    throw error;
  }
};

/* import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/service/firebase/firebaseconfig";

// Validate image URI
const validateImageUri = (uri) => {
  if (!uri) return false;
  // Check if URI is a valid string and has an image file extension
  return typeof uri === "string" && /\.(jpg|jpeg|png|gif|webp)$/i.test(uri);
};

// Convert URI to blob with better error handling
const uriToBlob = async (uri) => {
  try {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.blob();
  } catch (error) {
    throw new Error(`Failed to convert URI to blob: ${error.message}`);
  }
};

export const uploadImageToFirebase = async (uri, folder = "quiz-images") => {
  // Validate input
  if (!validateImageUri(uri)) {
    console.warn("Invalid or missing image URI");
    return null;
  }

  try {
    // Convert URI to blob with enhanced error handling
    const blob = await uriToBlob(uri);

    // Validate blob
    if (!blob || blob.size === 0) {
      throw new Error("Invalid blob generated from URI");
    }

    // Generate unique filename with timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const filename = `${folder}/${timestamp}-${randomString}`;

    // Create storage reference
    const imageRef = ref(storage, filename);

    // Upload blob with metadata
    const metadata = {
      contentType: blob.type,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        originalUri: uri,
      },
    };

    const uploadResult = await uploadBytes(imageRef, blob, metadata);

    if (!uploadResult || !uploadResult.ref) {
      throw new Error("Upload failed - no reference returned");
    }

    // Get download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);
    return downloadURL;
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

export const uploadQuestionImages = async (questions) => {
  if (!Array.isArray(questions)) {
    throw new Error("Questions must be an array");
  }

  const updatedQuestions = [];

  for (const question of questions) {
    try {
      if (
        question?.backgroundImage &&
        validateImageUri(question.backgroundImage)
      ) {
        // Upload question background image
        const imageUrl = await uploadImageToFirebase(
          question.backgroundImage,
          "question-images"
        );
        updatedQuestions.push({
          ...question,
          backgroundImage: imageUrl,
        });
      } else {
        // Keep question without background image
        updatedQuestions.push({
          ...question,
          backgroundImage: null,
        });
      }
    } catch (error) {
      console.error(
        `Question image upload error for question: ${
          question?.id || "unknown"
        }:`,
        error
      );
      updatedQuestions.push({
        ...question,
        backgroundImage: null,
      });
    }
  }

  return updatedQuestions;
};

export const saveQuizWithImages = async (quizState, coverImage) => {
  console.log("Starting saveQuizWithImages");
  console.log("Initial quiz state:", quizState);

  try {
    // Upload cover image if exists
    let coverImageUrl = null;
    if (coverImage) {
      console.log("Uploading cover image...");
      coverImageUrl = await uploadImageToFirebase(coverImage, "quiz-covers");
      console.log("Cover image uploaded:", coverImageUrl);
    }

    // Process questions and their images
    const processedQuestions = await Promise.all(
      quizState.questions.map(async (question, index) => {
        console.log(`Processing question ${index + 1}:`, question);

        if (question.backgroundImage) {
          try {
            console.log(`Uploading image for question ${index + 1}...`);
            const imageUrl = await uploadImageToFirebase(
              question.backgroundImage,
              "question-images"
            );
            console.log(`Image uploaded for question ${index + 1}:`, imageUrl);
            return { ...question, backgroundImage: imageUrl };
          } catch (error) {
            console.error(
              `Failed to upload image for question ${index + 1}:`,
              error
            );
            return { ...question, backgroundImage: null };
          }
        }
        return question;
      })
    );

    console.log("Processed questions:", processedQuestions);

    // Prepare final quiz data
    const quizData = {
      ...quizState,
      coverImage: coverImageUrl,
      questions: processedQuestions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Final quiz data:", quizData);
    return quizData;
  } catch (error) {
    console.error("Save quiz error:", error);
    throw error;
  }
};
 */
