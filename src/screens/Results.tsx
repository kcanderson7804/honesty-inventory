import { motion } from "framer-motion";
import type { Answers } from "../data/quiz";
import { getLowestSection, getTier, SECTIONS } from "../data/quiz";

function getSectionScore(sectionIndex: number, answers: Answers): number {
  return SECTIONS[sectionIndex].questions.reduce(
    (sum, q) => sum + (answers[q.id] ?? 0),
    0,
  );
}

interface Props {
  answers: Answers;
  totalScore: number;
  onNowWhat: () => void;
}

export default function Results({
  answers,
  totalScore,
  onNowWhat,
}: Props) {
  const tier = getTier(totalScore);
  const sectionScores = SECTIONS.map((s, i) => ({
    ...s,
    score: getSectionScore(i, answers),
  }));
  const lowestSection = getLowestSection(answers);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--cream)" }}
    >
      <div className="flex-1 px-6 md:px-16 lg:px-24 xl:px-32 py-14 md:py-20 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Score */}
          <div className="mb-10">
            <p
              className="font-lato text-xs tracking-[0.22em] uppercase mb-3"
              style={{ color: "var(--ink-faint)" }}
            >
              Your total score
            </p>
            <span
              className="font-playfair"
              style={{
                fontSize: "clamp(3.5rem, 10vw, 6rem)",
                fontWeight: 700,
                color: "var(--burgundy)",
                lineHeight: 1,
              }}
            >
              {totalScore}
            </span>
          </div>

          {/* Tier result */}
          <div
            className="p-8 md:p-10 mb-10"
            style={{
              background: "var(--cream-dark)",
              borderLeft: "3px solid var(--burgundy)",
            }}
          >
            <h2
              className="font-playfair mb-4"
              style={{
                fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                fontWeight: 700,
                color: "var(--burgundy)",
                lineHeight: 1.2,
              }}
            >
              {tier.headline}
            </h2>
            <p
              className="font-lato leading-relaxed"
              style={{ fontSize: "1rem", fontWeight: 300, color: "var(--ink)" }}
            >
              {tier.body}
            </p>
          </div>

          {/* Section breakdown */}
          <div className="mb-10">
            <p
              className="font-lato text-xs tracking-[0.16em] uppercase mb-6"
              style={{ color: "var(--ink-faint)" }}
            >
              By section
            </p>
            <div className="space-y-4">
              {sectionScores.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span
                      className="font-lato text-sm"
                      style={{ fontWeight: 400, color: "var(--ink)" }}
                    >
                      {s.title}
                    </span>
                    <span
                      className="font-lato text-sm"
                      style={{ fontWeight: 300, color: "var(--ink)" }}
                    >
                      {s.score} / 25
                    </span>
                  </div>
                  <div
                    className="w-full h-1.5"
                    style={{ background: "rgba(26,17,8,0.08)" }}
                  >
                    <motion.div
                      className="h-full"
                      style={{ background: "var(--burgundy)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.score / 25) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.1 * i }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lowest section callout */}
          <div
            className="mb-12 p-8"
            style={{
              borderTop: "1px solid rgba(26,17,8,0.12)",
              borderBottom: "1px solid rgba(26,17,8,0.12)",
            }}
          >
            <p
              className="font-lato text-xs tracking-[0.22em] uppercase mb-4"
              style={{ color: "var(--ink-faint)" }}
            >
              Your lowest-scoring section
            </p>
            <h3
              className="font-playfair mb-4"
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                fontWeight: 700,
                color: "var(--burgundy)",
                lineHeight: 1.2,
              }}
            >
              {lowestSection.title}
            </h3>
            <p
              className="font-lato leading-relaxed"
              style={{
                fontSize: "0.975rem",
                fontWeight: 300,
                color: "var(--ink)",
                lineHeight: 1.75,
              }}
            >
              {lowestSection.lowestSectionCopy}
            </p>
          </div>

          {/* NOW WHAT CTA */}
          <motion.button
            whileHover={{ opacity: 0.88 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNowWhat}
            className="w-full font-lato text-sm tracking-[0.18em] uppercase py-5 text-center transition-opacity"
            style={{
              background: "var(--burgundy)",
              color: "var(--cream)",
              fontWeight: 400,
              fontSize: "0.85rem",
            }}
          >
            Now what?
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
