import { motion } from "framer-motion";

export default function ThankYou() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--cream)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl text-center"
      >
        <p
          className="font-lato text-xs tracking-[0.22em] uppercase mb-6"
          style={{ color: "var(--ink-faint)" }}
        >
          You're in
        </p>
        <h2
          className="font-playfair mb-6"
          style={{
            fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
            fontWeight: 700,
            color: "var(--burgundy)",
            lineHeight: 1.1,
          }}
        >
          Check your inbox.
        </h2>
        <p
          className="font-lato leading-relaxed mb-10"
          style={{
            fontSize: "1rem",
            fontWeight: 300,
            color: "var(--ink-soft)",
          }}
        >
          Your results, your answers, and your next step are on their way.
        </p>
      </motion.div>
    </div>
  );
}
