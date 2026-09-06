export interface PublicCourse {
  title: string;
  slug: string;
  image: string;
  description: string;
  ageGroup?: string;
  duration?: string;
  classDuration?: string;
  bullets?: string[];
}

// The original six courses the site launched with. They are used to seed the
// database (npm run seed) and as a fallback on the public pages when the
// courses collection is still empty, so the site never renders blank.
export const DEFAULT_COURSES: PublicCourse[] = [
  {
    image: "/Quranic Qaidah.png",
    title: "Quranic Qaidah",
    slug: "quranic-qaidah",
    description:
      "The Quranic Qaida course is designed for beginners who want to learn how to read the Quran correctly from the very basics. In this course, students are taught Arabic letters, pronunciation, and essential Tajweed rules step by step, helping them build a strong foundation for accurate Quran recitation.",
    ageGroup: "4+ Years",
    duration: "3 Months",
    classDuration: "30 Minutes",
    bullets: [
      "Arabic letters and correct pronunciation from scratch",
      "Essential Tajweed rules taught step by step",
      "One-to-one live classes with qualified teachers",
      "Strong foundation for accurate Quran recitation",
    ],
  },
  {
    image: "/Quran Gateway.png",
    title: "Quran Gateway",
    slug: "quran-gateway",
    description:
      "The Quran Gateway course is designed to help students move beyond the basics and develop a deeper connection with the Quran. In this course, students improve their recitation, strengthen their Tajweed, and begin to understand the meanings of the Quran, making their learning more meaningful and impactful.",
    ageGroup: "7+ Years",
    duration: "6 Months",
    classDuration: "30 Minutes",
    bullets: [
      "Improve fluency and confidence in recitation",
      "Strengthen Tajweed with practical application",
      "Begin understanding the meanings of the Quran",
      "Personalized feedback in every class",
    ],
  },
  {
    image: "/Quran memorizing Course.png",
    title: "Quran Memorizing",
    slug: "quran-memorizing",
    description:
      "The Quran Memorizing course is designed for students who wish to memorize the Holy Quran with proper guidance and discipline. Our teachers support students with structured lessons, regular revision, and effective memorization techniques to ensure strong retention and accuracy.",
    ageGroup: "7+ Years",
    duration: "12 Months",
    classDuration: "45 Minutes",
    bullets: [
      "Structured memorization plan with daily targets",
      "Regular revision to ensure strong retention",
      "Proven memorization techniques from Hafiz teachers",
      "Progress tracking and accuracy checks",
    ],
  },
  {
    image: "/Translation of the Holy Quran.png",
    title: "Translation of The Holy Quran",
    slug: "translation-holy-quran",
    description:
      "The Translation of the Holy Quran course is designed to help students understand the meanings and message of the Quran in a clear and simple way. This course enables learners to connect deeply with the Quran by exploring its teachings, guidance, and practical application in daily life.",
    ageGroup: "10+ Years",
    duration: "6 Months",
    classDuration: "45 Minutes",
    bullets: [
      "Word-by-word translation in simple language",
      "Understand the message and context of verses",
      "Practical application of Quranic teachings in daily life",
      "Suitable for teens and adults alike",
    ],
  },
  {
    image: "/Woman Quranic Course.png",
    title: "Women Quranic Course",
    slug: "women-quranic-course",
    description:
      "The Women Quranic Course is specially designed for sisters who want to learn the Holy Quran in a comfortable and supportive environment. Our female teachers provide step-by-step guidance in Quran recitation, Tajweed, and basic Islamic teachings, ensuring a respectful and easy learning experience from home.",
    ageGroup: "All Ages (Sisters)",
    duration: "4 Months",
    classDuration: "30 Minutes",
    bullets: [
      "Female teachers in a comfortable, respectful environment",
      "Step-by-step Quran recitation and Tajweed guidance",
      "Basic Islamic teachings for daily life",
      "Flexible timings that suit home routines",
    ],
  },
  {
    image: "/Tajweed Course.png",
    title: "Tajweed Course",
    slug: "tajweed-course",
    description:
      "The Tajweed Course is designed to help students master the correct pronunciation and recitation of the Holy Quran. In this course, learners are taught the detailed rules of Tajweed in a simple and practical way, enabling them to recite the Quran with accuracy, fluency, and beauty.",
    ageGroup: "6+ Years",
    duration: "3 Months",
    classDuration: "30 Minutes",
    bullets: [
      "Detailed Tajweed rules explained simply",
      "Practical recitation practice in every class",
      "Recite with accuracy, fluency, and beauty",
      "Suitable for improving existing recitation",
    ],
  },
];
