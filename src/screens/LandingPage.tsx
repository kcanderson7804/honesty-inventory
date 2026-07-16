import { motion } from "framer-motion";

interface Props {
  onStart: () => void;
}

export default function LandingPage({ onStart }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col justify-center"
      style={{ background: "var(--cream)" }}
    >
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32 py-8 md:py-16 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1
            className="font-playfair leading-[1.1] mb-8"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              fontWeight: 700,
              color: "var(--burgundy)",
              letterSpacing: "-0.01em",
            }}
          >
            The Honesty Inventory
          </h1>
          <p
            className="font-lato leading-relaxed mb-10 max-w-xl"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              fontWeight: 300,
              color: "var(--ink-soft)",
            }}
          >
            20 statements. 5 minutes. An honest look at where you actually are —
            in your time, your relationships, your work and your own voice.
          </p>
          <motion.button
            whileHover={{ opacity: 0.88 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="inline-block font-lato text-sm uppercase px-10 py-4 transition-opacity"
            style={{
              background: "var(--burgundy)",
              color: "var(--cream)",
              letterSpacing: "0.1em",
              fontWeight: 400,
            }}
          >
            Start the Assessment
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
