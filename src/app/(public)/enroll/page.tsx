export const metadata = {
  title: "Enroll | Al Burhan Quran Academy",
  description: "Enroll in a Quran course at Al Burhan Quran Academy.",
};

import EnrollForm from "./EnrollForm";

export default function EnrollPage() {
  return (
    <section className="bg-[var(--color-black)] min-h-screen py-20 px-4 flex items-center justify-center">
      <EnrollForm />
    </section>
  );
}
