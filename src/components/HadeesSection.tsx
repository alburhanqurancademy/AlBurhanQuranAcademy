"use client";

import { useEffect, useState } from "react";

const ARABIC_TEXT = "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ";
const TRANSLATION_TEXT = "The best among you are those who learn the Qur'an and teach it";
const ARABIC_WORDS = ARABIC_TEXT.split(" ");

const CYCLE_MS = 10000;       // full animation restarts every 10 seconds
const WORD_INTERVAL_MS = 450; // delay between each Arabic word appearing
const TYPE_INTERVAL_MS = 90;  // delay between each typed character

export default function HadeesSection() {
  const [visibleWords, setVisibleWords] = useState(0);
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    let wordTimer: ReturnType<typeof setInterval> | undefined;
    let typeTimer: ReturnType<typeof setInterval> | undefined;

    function runCycle() {
      setVisibleWords(0);
      setTypedChars(0);

      // Arabic word-reveal and the translation typewriter now run at the
      // same time, side by side, rather than one waiting for the other.
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
    <section className="bg-[var(--color-black-soft)] py-20 px-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">

        <div className="bg-[var(--color-surface)] rounded-2xl px-8 md:px-16 py-14 grid gap-10 items-center">

          {/* Left — label + Arabic + translation + attribution */}
          <div className="flex items-center w-full flex-col gap-5 text-center">

            <div className="relative w-full">
              {/* Invisible sizer reserves the fully-revealed height so the
                  progressive word reveal never reflows/shifts the layout. */}
              <h2
                aria-hidden="true"
                className="invisible arabic text-2xl sm:text-4xl md:text-8xl leading-loose flex flex-wrap items-center justify-center gap-x-4"
              >
                {ARABIC_WORDS.map((word, i) => (
                  <span key={i}>{word}</span>
                ))}
              </h2>

              <h2
                className="absolute inset-0 arabic text-[var(--color-sky)] text-2xl sm:text-4xl md:text-8xl leading-loose flex flex-wrap items-center justify-center gap-x-4"
                aria-label={ARABIC_TEXT}
              >
                {ARABIC_WORDS.map((word, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="inline-block transition-[opacity,transform] duration-300 ease-out"
                    style={{
                      opacity: i < visibleWords ? 1 : 0,
                      transform: i < visibleWords ? "translateY(0)" : "translateY(8px)",
                    }}
                  >
                    {word}
                  </span>
                ))}
              </h2>
            </div>

            <div className="relative w-full">
              {/* Invisible sizer reserves the fully-typed height so the
                  typewriter never reflows/shifts the layout mid-cycle. */}
              <p
                aria-hidden="true"
                className="invisible text-base sm:text-xl md:text-3xl leading-relaxed font-medium"
              >
                {'"'}{TRANSLATION_TEXT}{'"'}
              </p>

              <p
                className="absolute inset-0 text-white text-base sm:text-xl md:text-3xl leading-relaxed font-medium"
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
            </div>

            <p className="text-[var(--color-sky)] text-xl font-semibold">
              Prophet Muhammad ﷺ
            </p>
           </div>

        </div>

      </div>
    </section>
  );
}
