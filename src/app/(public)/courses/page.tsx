import CoursesHero from "@/components/courses/CoursesHero";
import CoursesList from "@/components/courses/CoursesList";

export const metadata = {
  title: "Courses | Al Burhan Quran Academy",
  description: "Explore our Quranic and Islamic courses tailored for every student.",
};

export default function CoursesPage() {
  return (
    <>
      <CoursesHero />
      <CoursesList />
    </>
  );
}
