import { motion } from "framer-motion";

interface Props {
  onContinue: () => void;
}

export default function ScoreNote({ onContinue }: Props) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--cream)" }}>
      <div className="flex-1 px-6 md:px-16 lg:px-24 xl:px-32 py-14 md:py-20 max-w-2xl mx-auto w-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* All-caps heading matching other screen headings */}
          <p
            className="font-lato text-xs tracking-[0.22em] uppercase mb-10"
            style={{ color: "var(--ink-faint)" }}
          >
            A note before you see your score
          </p>

          {/* Body — each sentence on its own line with generous spacing */}
          <div
            className="font-lato mb-12 space-y-5"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.1rem)",
              fontWeight: 400,
              color: "var(--ink)",
              lineHeight: 1.8,
            }}
          >
            <p>
              It&apos;s easy to score yourself higher than what&apos;s actually true because you
              are practiced at telling yourself you&apos;re fine.
            </p>
            <p>It is also easy to be harder on yourself than you deserve.</p>
            <p>If your score surprises you in either direction — <em>trust your gut</em>.</p>
            {/* Last line in burgundy / darker */}
            <p style={{ color: "var(--burgundy)", fontWeight: 500 }}>
              And don&apos;t get distracted by your total score — the real information is in
              the sections and the individual statements where you scored lowest. That&apos;s
              where the honest work lives.
            </p>
          </div>

          <motion.button
            whileHover={{ opacity: 0.88 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="inline-block font-lato text-sm tracking-[0.1em] uppercase px-10 py-4 transition-opacity"
            style={{
              background: "var(--burgundy)",
              color: "var(--cream)",
              fontWeight: 400,
            }}
          >
            See my score →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
