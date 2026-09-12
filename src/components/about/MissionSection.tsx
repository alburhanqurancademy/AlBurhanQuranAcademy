"use client";

import { useEffect, useState } from "react";

const ARABIC_TEXT = "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ";
const TRANSLATION_TEXT = "Say: Are those who know equal to those who do not know?";
const ARABIC_WORDS = ARABIC_TEXT.split(" ");

const CYCLE_MS = 10000;       // full animation restarts every 10 seconds
const WORD_INTERVAL_MS = 450; // delay between each Arabic word appearing
const TYPE_INTERVAL_MS = 90;  // delay between each typed character

export default function MissionSection() {
  const [visibleWords, setVisibleWords] = useState(0);
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    let wordTimer: ReturnType<typeof setInterval> | undefined;
    let typeTimer: ReturnType<typeof setInterval> | undefined;

    function runCycle() {
      setVisibleWords(0);
      setTypedChars(0);

      let word = 0;
      wordTimer = setInterval(() => {
        word += 1;
        setVisibleWords(word);
        if (word >= ARABIC_WORDS.length) clearInterval(wordTimer);
      }, WORD_INTERVAL_MS);

      let char = 0;
      typeTimer = setInterval(() => {
        char += 1;
        setTypedChars(char);
        if (char >= TRANSLATION_TEXT.length) clearInterval(typeTimer);
      }, TYPE_INTERVAL_MS);
    }

    runCycle();
    const cycleTimer = setInterval(runCycle, CYCLE_MS);

    return () => {
      clearInterval(wordTimer);
      clearInterval(typeTimer);
      clearInterval(cycleTimer);
    };
  }, []);

  const isTyping = typedChars > 0 && typedChars < TRANSLATION_TEXT.length;

  return (
    <section className="bg-[var(--color-black-soft)] py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

        {/* Left — mission text */}
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Our <span className="text-[var(--color-accent)]">Mission</span>
          </h2>
          <div className="flex flex-col gap-4 text-gray-300 text-base md:text-lg leading-relaxed">
            <p>
              Our mission is to build a strong and supportive community focused on education, spiritual growth,
              and personal development. We aim to provide high-quality learning opportunities for students of all
              ages, helping them strengthen their understanding of the Quran and Islamic teachings.
            </p>
            <p>
              Beyond education, we strive to support individuals and families by promoting guidance in important
              aspects of life, including personal development, family values, and community well-being. We are
              committed to creating an environment where learners feel supported, motivated, and connected.
            </p>
            <p>
              Inspired by the teachings of the Quran, we encourage individuals to take meaningful steps toward
              improving their knowledge, character, and connection with their faith. Through continuous learning
              and spiritual development, we aim to bring positive and lasting change in both individuals and the
              wider community.
            </p>
          </div>
        </div>

        {/* Right — Arabic verse styled like HadeesSection, with the same reveal/typing animation */}
        <div className="flex items-center justify-center">
          <div className="bg-[var(--color-surface)] rounded-2xl px-8 md:px-14 py-12 flex flex-col items-center gap-5 text-center w-full">
            <p
              className="arabic text-[var(--color-sky)] text-4xl md:text-6xl leading-loose flex flex-wrap items-center justify-center gap-x-3"
              aria-label={ARABIC_TEXT}
            >
              {ARABIC_WORDS.map((word, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="inline-block transition-all duration-500 ease-out"
                  style={{
                    opacity: i < visibleWords ? 1 : 0,
                    transform: i < visibleWords ? "translateY(0)" : "translateY(12px)",
                  }}
                >
                  {word}
                </span>
              ))}
            </p>

            <p
              className="text-white text-base md:text-xl leading-relaxed font-medium min-h-[1.6em]"
              aria-label={`"${TRANSLATION_TEXT}"`}
            >
              <span aria-hidden="true">
                {'"'}
                {TRANSLATION_TEXT.slice(0, typedChars)}
                <span
                  className={`inline-block w-[2px] h-[0.9em] bg-[var(--color-sky)] align-middle ml-0.5 ${
                    isTyping ? "animate-pulse" : "opacity-0"
                  }`}
                />
                {typedChars >= TRANSLATION_TEXT.length && '"'}
              </span>
            </p>

            <p className="text-[var(--color-sky)] text-lg font-semibold">
              Surah Az-Zumar 39:9
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
