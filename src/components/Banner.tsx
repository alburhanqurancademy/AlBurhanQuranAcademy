"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import Button from "./Button";

const slides = [
  { src: "/banner1.jpeg", tag: "Learn, Recite, Understand" },
  { src: "/banner2.jpeg", tag: "A simple way to understand The Quran" },
  { src: "/banner3.jpeg", tag: "Learn The Quran Easily, Step by Step" },
];

export default function Banner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [current, setCurrent] = useState(0);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setCurrent(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  return (
    <section className="relative w-full min-h-[90vh] overflow-hidden">
      {/* Carousel track */}
      <div ref={emblaRef} className="absolute inset-0">
        <div className="flex h-full">
          {slides.map(({ src }, i) => (
            <div key={i} className="relative flex-[0_0_100%] h-full min-h-[90vh]">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${src}')` }}
              />
              {/* Subtle dark overlay */}
              <div className="absolute inset-0 bg-black/50" />

            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center min-h-[90vh]">
        <div className="text-center px-4 mx-auto">
          <div
            className="arabic text-4xl md:text-5xl text-white mb-6 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
            aria-label="Bismillah ir-Rahman ir-Rahim"
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </div>

          <p
            className="text-base md:text-xl text-[var(--color-sky)] tracking-[0.25em] uppercase mb-3 opacity-0 animate-fade-in-up delay-200"
            style={{ animationFillMode: "forwards", fontWeight: "bold", textShadow: "0 0 50px 50px #000000" }}
          >
            Al Burhan Quran Academy
          </p>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 opacity-0 animate-fade-in-up delay-400"
            style={{ animationFillMode: "forwards" }}
          >
            Online Qur&apos;an{" "}
            <span className="gold-shimmer-text">Classes</span>
          </h1>

          {/* Per-slide tag shown here responsively */}
          <div className="opacity-0 animate-fade-in-up delay-400" style={{ animationFillMode: "forwards" }}>
            <span className="text-white/70 text-xs md:text-sm tracking-widest uppercase border border-white/20 px-4 py-1.5 md:px-5 md:py-2 rounded-full backdrop-blur-sm">
              {slides[current].tag}
            </span>
          </div>

          <div className="mt-8 md:mt-12 opacity-0 animate-fade-in-up delay-400" style={{ animationFillMode: "forwards" }}>
            <Button
              variant="outline"
              size="lg"
              href="/contact"
              icon={
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              }
            >
              Request Demo Class
            </Button>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${i === current
                ? "w-8 h-3 bg-[var(--color-accent)]"
                : "w-3 h-3 bg-white/40 hover:bg-white/70"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
