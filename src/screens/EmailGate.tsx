import { useAction } from "convex/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import type { Answers } from "../data/quiz";
import { getTier, SECTIONS } from "../data/quiz";
import { supabase } from "../lib/supabase";

interface Props {
  totalScore: number;
  answers: Answers;
  onSubmit: () => void;
}

export default function EmailGate({
  totalScore,
  answers,
  onSubmit,
}: Props) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const tier = getTier(totalScore);
  const createShineContact = useAction(api.shinepages.createContact);
  const sendResultsEmail = useAction(api.email.sendResultsEmail);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) {
      setError("Please enter your first name and email.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");

    // Build section scores object
    const sectionScores: Record<string, number> = {};
    SECTIONS.forEach((section) => {
      sectionScores[section.title] = section.questions.reduce(
        (sum, q) => sum + (answers[q.id] ?? 0),
        0,
      );
    });

    const name = firstName.trim();
    const emailTrimmed = email.trim();

    // Fire both calls in parallel — always advance to ThankYou regardless of errors
    try {
      await Promise.allSettled([
        // 1. ShinePages — create contact with tier tag + subscriber list
        createShineContact({
          name,
          email: emailTrimmed,
          tier: tier.tag,
          totalScore,
        }),

        // 2. Supabase — store full quiz response
        supabase.from("quiz_responses").insert({
          name,
          email: emailTrimmed,
          total_score: totalScore,
          tier: tier.tag,
          tier_range: tier.range,
          section_scores: sectionScores,
          answers,
        }),

        // 3. Resend — send transactional results email
        sendResultsEmail({
          firstName: name,
          email: emailTrimmed,
          totalScore,
          tier: tier.tag,
          answers,
        }),
      ]);
    } catch {
      // Silently swallow — user still gets to ThankYou
    }

    onSubmit();
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--cream)" }}
    >
      <div className="w-full py-5 px-6 md:px-12 border-b border-black/10" />

      <div className="flex-1 px-6 md:px-16 lg:px-24 xl:px-32 py-12 md:py-16 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Go Deeper section */}
          <p
            className="font-lato text-xs tracking-[0.22em] uppercase mb-6"
            style={{ color: "var(--ink-faint)" }}
          >
            Go deeper
          </p>
          <h2
            className="font-playfair mb-5"
            style={{
              fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
              fontWeight: 700,
              color: "var(--burgundy)",
              lineHeight: 1.15,
            }}
          >
            Taking time to honestly reflect on your life is no small thing.
          </h2>
          <p
            className="font-lato leading-relaxed mb-4"
            style={{
              fontSize: "1rem",
              fontWeight: 500,
              color: "var(--ink)",
            }}
          >
            Most women never do. But you&apos;re probably sitting <em>there</em> thinking — <em>now what?</em>
          </p>
          <p
            className="font-playfair mb-3"
            style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
              fontWeight: 700,
              color: "var(--ink)",
              lineHeight: 1.3,
            }}
          >
            Enter your name and email and I&apos;ll send you three things:
          </p>
          <ul className="mb-10 space-y-2">
            {[
              "A copy of your results to keep",
              "A record of exactly how you answered each statement",
              "A simple exercise to help you figure out what to do next",
            ].map((item, i) => (
              <li
                key={i}
                className="font-lato flex items-start gap-3"
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 300,
                  color: "var(--ink-soft)",
                }}
              >
                <span style={{ color: "var(--burgundy)", marginTop: "0.1em" }}>
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Email form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="first-name"
                  className="block font-lato text-xs tracking-[0.14em] uppercase mb-2"
                  style={{ color: "var(--ink-faint)" }}
                >
                  First name
                </label>
                <input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  className="w-full py-3.5 px-4 font-lato text-sm border outline-none transition-all"
                  style={{
                    background: "transparent",
                    borderColor: "rgba(26,17,8,0.2)",
                    color: "var(--ink)",
                    fontWeight: 300,
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = "var(--burgundy)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(26,17,8,0.2)";
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block font-lato text-xs tracking-[0.14em] uppercase mb-2"
                  style={{ color: "var(--ink-faint)" }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full py-3.5 px-4 font-lato text-sm border outline-none transition-all"
                  style={{
                    background: "transparent",
                    borderColor: "rgba(26,17,8,0.2)",
                    color: "var(--ink)",
                    fontWeight: 300,
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = "var(--burgundy)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(26,17,8,0.2)";
                  }}
                />
              </div>
            </div>

            {error && (
              <p
                className="font-lato text-xs mb-4"
                style={{ color: "#c0392b" }}
              >
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ opacity: loading ? 1 : 0.88 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full font-lato text-sm tracking-[0.1em] uppercase py-4 transition-opacity"
              style={{
                background: loading ? "rgba(122,8,8,0.5)" : "var(--burgundy)",
                color: "var(--cream)",
                fontWeight: 400,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Sending…" : "Send it my way →"}
            </motion.button>
          </form>
          <p
            className="font-lato text-xs mt-4 text-center"
            style={{ color: "var(--ink-faint)" }}
          >
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
