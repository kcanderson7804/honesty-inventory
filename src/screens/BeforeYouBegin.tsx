import { motion } from "framer-motion";
import {
  BEFORE_YOU_BEGIN_HONEST_LINES,
  BEFORE_YOU_BEGIN_INSTRUCTION,
  BEFORE_YOU_BEGIN_INTRO,
  SCALE_LABELS,
} from "../data/quiz";

interface Props {
  onStart: () => void;
}

export default function BeforeYouBegin({ onStart }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--cream)" }}
    >
      <div className="flex-1 px-6 md:px-16 lg:px-24 xl:px-32 py-14 md:py-20 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="font-lato text-xs tracking-[0.22em] uppercase mb-8"
            style={{ color: "var(--ink-faint)" }}
          >
            Before you begin
          </p>

          {/* Instruction */}
          <p
            className="font-lato leading-relaxed mb-6"
            style={{
              fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)",
              fontWeight: 300,
              color: "var(--ink)",
            }}
          >
            {BEFORE_YOU_BEGIN_INSTRUCTION}
          </p>

          {/* Intro note */}
          <p
            className="font-lato leading-relaxed mb-8"
            style={{
              fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)",
              fontWeight: 300,
              color: "var(--ink)",
            }}
          >
            {BEFORE_YOU_BEGIN_INTRO}
          </p>

          {/* Red honest lines */}
          <div className="mb-10 space-y-2">
            {BEFORE_YOU_BEGIN_HONEST_LINES.map((line, i) => (
              <p
                key={i}
                className="font-lato leading-relaxed"
                style={{
                  fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)",
                  fontWeight: 500,
                  color: "var(--burgundy)",
                }}
              >
                {line}
              </p>
            ))}
          </div>

          {/* Scale key */}
          <div
            className="mb-10 p-6"
            style={{
              background: "var(--cream-dark)",
              borderLeft: "3px solid var(--burgundy)",
            }}
          >
            <p
              className="font-lato text-xs tracking-[0.18em] uppercase mb-5"
              style={{ color: "var(--ink-faint)" }}
            >
              Rating scale
            </p>
            <div className="space-y-3">
              {([1, 2, 3, 4, 5] as const).map(n => (
                <div key={n} className="flex items-baseline gap-4">
                  <span
                    className="font-playfair flex-shrink-0 w-5 text-right"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--burgundy)",
                    }}
                  >
                    {n}
                  </span>
                  <span
                    className="font-lato"
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 300,
                      color: "var(--ink)",
                    }}
                  >
                    {SCALE_LABELS[n]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ opacity: 0.88 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="inline-block font-lato text-sm tracking-[0.1em] uppercase px-10 py-4 transition-opacity"
            style={{
              background: "var(--burgundy)",
              color: "var(--cream)",
              fontWeight: 400,
            }}
          >
            I'm ready — begin
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
