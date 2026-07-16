import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Answers } from "../data/quiz";
import { SCALE_LABELS, SECTIONS } from "../data/quiz";

interface Props {
  sectionIndex: number;
  questionIndex: number; // -1 = section intro screen
  answers: Answers;
  onAnswer: (questionId: string, value: number) => void;
  onNextQuestion: () => void;
  totalAnswered: number;
  totalQuestions: number;
}

export default function QuizSection({
  sectionIndex,
  questionIndex,
  answers,
  onAnswer,
  onNextQuestion,
  totalAnswered,
  totalQuestions,
}: Props) {
  const section = SECTIONS[sectionIndex];
  const progress = Math.round((totalAnswered / totalQuestions) * 100);
  const [justSelected, setJustSelected] = useState<number | null>(null);

  // Reset justSelected when question changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset
  useEffect(() => {
    setJustSelected(null);
  }, [sectionIndex, questionIndex]);

  function handleSelect(value: number) {
    if (questionIndex < 0) return;
    const q = section.questions[questionIndex];
    setJustSelected(value);
    onAnswer(q.id, value);
    // Auto-advance after a short pause so user sees their selection
    setTimeout(() => {
      onNextQuestion();
    }, 380);
  }

  // ── Section intro screen ──────────────────────────────────────────────────
  if (questionIndex === -1) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "var(--cream)" }}
      >
        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32 py-16 max-w-2xl mx-auto w-full">
          <motion.div
            key={`intro-${sectionIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p
              className="font-lato text-xs tracking-[0.22em] uppercase mb-6"
              style={{ color: "var(--ink-faint)" }}
            >
              {section.label}
            </p>
            <h2
              className="font-playfair mb-6"
              style={{
                fontSize: "clamp(1.8rem, 5vw, 3rem)",
                fontWeight: 700,
                color: "var(--burgundy)",
                lineHeight: 1.1,
              }}
            >
              {section.title}
            </h2>
            <p
              className="font-lato leading-relaxed mb-12"
              style={{
                fontSize: "clamp(1rem, 2vw, 1.1rem)",
                fontWeight: 300,
                color: "var(--ink-soft)",
                lineHeight: 1.7,
              }}
            >
              {section.subtitle}
            </p>
            <motion.button
              whileHover={{ opacity: 0.88 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNextQuestion}
              className="inline-block font-lato text-sm tracking-[0.1em] uppercase px-10 py-4 transition-opacity"
              style={{
                background: "var(--burgundy)",
                color: "var(--cream)",
                fontWeight: 400,
              }}
            >
              Begin →
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Individual question screen ────────────────────────────────────────────
  const q = section.questions[questionIndex];
  const currentVal = answers[q.id];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--cream)" }}
    >
      {/* Progress bar */}
      <div className="w-full h-1" style={{ background: "var(--cream-dark)" }}>
        <motion.div
          className="h-full"
          style={{ background: "var(--burgundy)" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="w-full py-5 px-6 md:px-12 flex items-center justify-end border-b border-black/10">
        <span
          className="font-lato text-xs tracking-[0.14em]"
          style={{ color: "var(--ink-faint)" }}
        >
          {totalAnswered} / {totalQuestions}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32 py-12 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${sectionIndex}-${questionIndex}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Section label */}
            <p
              className="font-lato text-xs tracking-[0.2em] uppercase mb-2"
              style={{ color: "var(--ink-faint)" }}
            >
              {section.title} · {questionIndex + 1} of {section.questions.length}
            </p>

            {/* Statement */}
            <p
              className="font-playfair mb-10 leading-snug"
              style={{
                fontSize: "clamp(1.2rem, 3vw, 1.7rem)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "var(--ink)",
                lineHeight: 1.4,
              }}
            >
              {q.text}
            </p>

            {/* Scale options — full-width rows */}
            <div className="space-y-3">
              {([1, 2, 3, 4, 5] as const).map(n => {
                const isSelected =
                  justSelected === n || (justSelected === null && currentVal === n);
                return (
                  <motion.button
                    key={n}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(n)}
                    disabled={justSelected !== null}
                    className="w-full flex items-center gap-5 px-5 py-4 border transition-all text-left"
                    style={{
                      background: isSelected ? "var(--burgundy)" : "transparent",
                      borderColor: isSelected
                        ? "var(--burgundy)"
                        : "rgba(26,17,8,0.18)",
                      cursor: justSelected !== null ? "default" : "pointer",
                    }}
                  >
                    <span
                      className="font-playfair flex-shrink-0"
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: isSelected ? "var(--cream)" : "var(--burgundy)",
                        minWidth: "1.4rem",
                      }}
                    >
                      {n}
                    </span>
                    <span
                      className="font-lato"
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 300,
                        color: isSelected ? "var(--cream)" : "var(--ink-soft)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {SCALE_LABELS[n]}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
