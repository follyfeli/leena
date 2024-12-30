export const QUIZ_CATEGORIES = [
  {
    id: "education",
    name: "Education 📚",
    icon: "📚",
  },
  { id: "mathematics", name: "Mathematics 🔢", icon: "🔢" },
  { id: "science", name: "Science 🧬", icon: "🧬" },
  { id: "literature", name: "Literature 📖", icon: "📖" },
  { id: "history", name: "History 🏛️", icon: "🏛️" },
  { id: "geography", name: "Geography 🌍", icon: "🌍" },
  { id: "languages", name: "Languages 🗣️", icon: "🗣️" },
  {
    id: "professional",
    name: "Professional Development 💼",
    icon: "💼",
  },
  { id: "business", name: "Business Skills 📊", icon: "📊" },
  { id: "technology", name: "Technology & IT 💻", icon: "💻" },
  { id: "leadership", name: "Leadership 👥", icon: "👥" },
  { id: "marketing", name: "Marketing 📱", icon: "📱" },
  { id: "finance", name: "Finance 💰", icon: "💰" },
  { id: "hr", name: "Human Resources 🤝", icon: "🤝" },
  {
    id: "entertainment",
    name: "Entertainment 🎮",
    icon: "🎮",
  },
  { id: "movies", name: "Movies & TV 🎬", icon: "🎬" },
  { id: "music", name: "Music 🎵", icon: "🎵" },
  { id: "sports", name: "Sports ⚽", icon: "⚽" },
  { id: "gaming", name: "Gaming 🎮", icon: "🎮" },
  { id: "pop-culture", name: "Pop Culture 🌟", icon: "🌟" },
  {
    id: "business",
    name: "Business & Marketing 💡",
    icon: "💡",
  },
  { id: "market-research", name: "Market Research 📊", icon: "📊" },
  { id: "customer-feedback", name: "Customer Feedback 📝", icon: "📝" },
  { id: "product-knowledge", name: "Product Knowledge 📦", icon: "📦" },
  { id: "sales-training", name: "Sales Training 💰", icon: "💰" },
  {
    id: "personal-dev",
    name: "Personal Development 🌱",
    icon: "🌱",
  },
  { id: "self-improvement", name: "Self Improvement 🎯", icon: "🎯" },
  { id: "health-wellness", name: "Health & Wellness 🧘‍♀️", icon: "🧘‍♀️" },
  { id: "productivity", name: "Productivity ⚡", icon: "⚡" },
  { id: "hobbies", name: "Hobbies 🎨", icon: "🎨" },
  {
    id: "corporate",
    name: "Corporate Training 🏢",
    icon: "🏢",
  },
  { id: "compliance", name: "Compliance 📋", icon: "📋" },
  { id: "safety", name: "Safety 🦺", icon: "🦺" },
  { id: "onboarding", name: "Onboarding 🚀", icon: "🚀" },
  { id: "team-building", name: "Team Building 🤝", icon: "🤝" },
  {
    id: "certification",
    name: "Certification Prep 📜",
    icon: "📜",
  },
  { id: "it-cert", name: "IT Certifications 💻", icon: "💻" },
  {
    id: "professional-cert",
    name: "Professional Certifications 📚",
    icon: "📚",
  },
  { id: "industry-cert", name: "Industry Specific 🏭", icon: "🏭" },
  {
    id: "language",
    name: "Language Learning 🌐",
    icon: "🌐",
  },
  { id: "vocabulary", name: "Vocabulary 📖", icon: "📖" },
  { id: "grammar", name: "Grammar ✏️", icon: "✏️" },
  { id: "conversation", name: "Conversation 💬", icon: "💬" },
  { id: "business-language", name: "Business Language 💼", icon: "💼" },
];

export const DIFFICULTY_LEVELS = [
  { id: "beginner", name: "Beginner 🌱", color: "#4CAF50" },
  { id: "intermediate", name: "Intermediate 🌟", color: "#2196F3" },
  { id: "advanced", name: "Advanced 🚀", color: "#FF6B6B" },
  { id: "expert", name: "Expert 👑", color: "#9C27B0" },
];

export const QUIZ_TYPES = [
  { id: "multiple-choice", name: "Multiple Choice ☑️", icon: "☑️" },
  { id: "true-false", name: "True/False ⚖️", icon: "⚖️" },

  { id: "essay", name: "Essay 📜", icon: "📜" },
];

export const TIME_LIMITS = [
  { id: "no-limit", name: "No Time Limit ⌛", duration: 0 },
  { id: "quick", name: "Quick (5 min) ⚡", duration: 300 },
  { id: "standard", name: "Standard (15 min) ⏱️", duration: 900 },
  { id: "extended", name: "Extended (30 min) 🕒", duration: 1800 },
  { id: "comprehensive", name: "Comprehensive (60 min) ⏰", duration: 3600 },
];

export const SCORING_SETTINGS = {
  defaultPointsPerQuestion: 10,
  passingScore: 70,
  bonusPoints: {
    speedBonus: 5, // Points for completing under 50% of time limit
    perfectScore: 20, // Additional points for 100% correct
    streakBonus: 2, // Points per question for maintaining correct streak
  },
  penalties: {
    incorrectAttempt: -2, // Points deducted per incorrect attempt
    timeOverrun: -5, // Points deducted for exceeding time limit
    hintUsed: -1, // Points deducted for using hints
  },
};
