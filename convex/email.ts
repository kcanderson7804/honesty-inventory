/**
 * Resend transactional email action.
 * Sends quiz results email to the user after opt-in.
 */
import { v } from "convex/values";
import { action } from "./_generated/server";

declare const process: { env: Record<string, string | undefined> };

const FROM_ADDRESS = "Kim Anderson <kim@thehonestyrevolution.com>";
const RESEND_API_URL = "https://api.resend.com/emails";

// ── Scale labels ────────────────────────────────────────────────────────────
const SCALE_LABELS: Record<number, string> = {
  1: "Not true for me",
  2: "Rarely true for me",
  3: "Somewhat true for me",
  4: "Mostly true for me",
  5: "Completely true for me",
};

// ── Section data ─────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 1,
    title: "Your Daily Life & Energy",
    questions: [
      { id: "1.1", text: "My daily routines reflect how I actually want to live, not what I think a person like me \"should\" be doing." },
      { id: "1.2", text: "I say yes to commitments because I want to, not because I feel guilty or afraid of what someone will think if I don't." },
      { id: "1.3", text: "I have time in my week that is simply for me, with no productivity attached to it." },
      { id: "1.4", text: "Our family calendar has room for downtime, not just activities and obligations." },
      { id: "1.5", text: "When I'm with my family, I'm actually with them, not mentally somewhere else, running through my list." },
    ],
  },
  {
    id: 2,
    title: "Your Relationships",
    questions: [
      { id: "2.1", text: "I'm able to say no to people without feeling guilty afterward." },
      { id: "2.2", text: "The version of me that shows up in most social situations feels like the real me — not a performance." },
      { id: "2.3", text: "The relationships I invest in are ones I genuinely choose, not ones I stay in out of guilt or obligation." },
      { id: "2.4", text: "The people I love most get my real attention, rather than the scraps left over after everything else." },
      { id: "2.5", text: "When something bothers me in a relationship, I say something, rather than quietly absorbing it and carrying it alone." },
    ],
  },
  {
    id: 3,
    title: "Your Purpose & Work",
    questions: [
      { id: "3.1", text: "I enjoy my job and the work I do in the world." },
      { id: "3.2", text: "My work, including what it demands of me, feels sustainable." },
      { id: "3.3", text: "When I imagine an ideal ordinary day — not a vacation, just a regular Tuesday — it looks something like what I'm currently living." },
      { id: "3.4", text: "When I'm doing my work, I feel genuinely engaged, rather than checked out." },
      { id: "3.5", text: "The work I do still feels connected to who I am now, not just who I was when I chose this path." },
    ],
  },
  {
    id: 4,
    title: "Your Inner Voice",
    questions: [
      { id: "4.1", text: "I let myself feel things like emptiness, loneliness, or a sense that something is missing, instead of pushing them away." },
      { id: "4.2", text: "I have a clear sense of who I am — separate from my roles as mom, partner, employee, daughter, friend." },
      { id: "4.3", text: "I show up as myself in my daily life, rather than performing the version of me that keeps everyone comfortable." },
      { id: "4.4", text: "I speak to myself the way I'd speak to a close friend, with some patience, some grace, and some real honesty." },
      { id: "4.5", text: "I believe I deserve ordinary joy, and I don't have to wait until things settle down to have it." },
    ],
  },
];

// ── Score tiers ───────────────────────────────────────────────────────────────
const SCORE_TIERS = [
  {
    tier: 1,
    min: 85,
    max: 100,
    tag: "honesty-tier-1",
    headline: "You've done real work to get here.",
    body: "There are places in your life where you're showing up honestly and that matters. But honesty is an ongoing practice, and if you're being truly honest, there are probably one or two things you're still holding onto. Life keeps evolving and so will this work. Keep going.",
    reflection: "You're living with more honesty than most. The question now isn't how to start — it's how to go deeper. Look at the statements where you scored lowest. Those are the places still asking for your attention.",
    freewritingPrompt: "Write about a moment in the last six months where you surprised yourself with how honest you were — and what it cost you, or didn't.",
    cta: "Ready to go deeper? The Honesty Revolution is where we do this work together.",
    ctaText: "Learn More",
    ctaUrl: "https://thehonestyrevolution.com",
  },
  {
    tier: 2,
    min: 65,
    max: 84,
    tag: "honesty-tier-2",
    headline: "You are headed in the right direction.",
    body: "There are parts of your life where you're living in alignment with what you actually want — and you probably know exactly which parts those are. But there are also places where you're still putting others first, still avoiding the conversations that might disappoint someone, still holding back the honest version of yourself. That's where the real work — and the real magic — lives.",
    reflection: "You already know where the gap is. You've probably been circling it for a while. What would it look like to actually close it? Look at the sections and statements where you scored lowest — that's where to start.",
    freewritingPrompt: "Write about the version of yourself you're still holding back. What does she want? What is she afraid will happen if she asks for it?",
    cta: "The Honesty Revolution is where women like you do this work — together, without judgment.",
    ctaText: "Learn More",
    ctaUrl: "https://thehonestyrevolution.com",
  },
  {
    tier: 3,
    min: 45,
    max: 64,
    tag: "honesty-tier-3",
    headline: "You show up for everyone.",
    body: "You stay committed, stay available — and somewhere in all of that, you got lost. Not dramatically. Just quietly, over time, one yes at a time. You probably feel a little like you don't know who you are outside of all the roles you're playing. A little like this isn't what you signed up for. You know something feels off. You've known for a while. That knowing is worth listening to.",
    reflection: "You've been saying yes so long, you may have forgotten what your own yes even feels like. The work starts with noticing. Look at the statements where you scored lowest — those are the places that need the most honesty.",
    freewritingPrompt: "Write about a time you said yes when every part of you wanted to say no. What did it cost you? What did you tell yourself afterward?",
    cta: "This is exactly where The Honesty Revolution starts. You don't have to figure this out alone.",
    ctaText: "Learn More",
    ctaUrl: "https://thehonestyrevolution.com",
  },
  {
    tier: 4,
    min: 20,
    max: 44,
    tag: "honesty-tier-4",
    headline: "You have been surviving so long it just feels like life.",
    body: "You give everything to everyone and there is not much left for you at the end of the day. You try to do it all and it has left you exhausted. Mentally. Emotionally. Physically. Somewhere along the way you stopped asking whether it could feel different. You may not even remember who you are outside of what you do for everyone else. That's not a failure. That's just how long you've been at this. And the fact that you're here means some part of you isn't ready to give up hope.",
    reflection: "You didn't get here overnight. And the way out isn't overnight either. But you took this quiz — which means some part of you is still reaching. That part is right. Look at the statements where you scored lowest. That's where the work begins.",
    freewritingPrompt: "Write about who you were before all of this. Before the roles, the obligations, the years of everyone else coming first. What did she want?",
    cta: "The Honesty Revolution was built for this exact moment — for when you're exhausted and don't know where to start. Start here.",
    ctaText: "Start Here",
    ctaUrl: "https://thehonestyrevolution.com",
  },
];

function getTierData(tag: string) {
  return SCORE_TIERS.find(t => t.tag === tag) ?? SCORE_TIERS[3];
}

// ── Email HTML builder ────────────────────────────────────────────────────────
function buildEmailHtml(
  firstName: string,
  totalScore: number,
  tierTag: string,
  answers: Record<string, number>,
): string {
  const tier = getTierData(tierTag);

  // Section scores
  const sectionData = SECTIONS.map(section => {
    const score = section.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    const max = section.questions.length * 5;
    const pct = Math.round((score / max) * 100);
    return { ...section, score, max, pct };
  });

  const totalMax = 100;
  const scorePct = Math.round((totalScore / totalMax) * 100);

  // Colors
  const burgundy = "#7a0808";
  const cream = "#faf6f1";
  const ink = "#1a1108";
  const inkSoft = "#4a3f35";
  const inkFaint = "#9c8878";
  const border = "#e8ddd4";

  // Build sections HTML
  const sectionsHtml = sectionData.map((section, idx) => `
    <tr>
      <td style="padding: 0 0 ${idx < sectionData.length - 1 ? "20px" : "0"} 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <p style="margin: 0 0 6px 0; font-family: 'Lato', Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: ${inkFaint};">
                ${section.title}
              </p>
            </td>
            <td align="right">
              <p style="margin: 0 0 6px 0; font-family: 'Lato', Arial, sans-serif; font-size: 12px; font-weight: 600; color: ${ink};">
                ${section.score}/${section.max}
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <!-- Progress bar -->
              <div style="width: 100%; height: 4px; background: ${border}; border-radius: 2px; line-height: 0; font-size: 0;">
                <div style="width: ${section.pct}%; height: 4px; background: ${burgundy}; border-radius: 2px; min-width: ${section.pct > 0 ? "4px" : "0"};"></div>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join("");

  // Build answers HTML
  const answersHtml = sectionData.map(section => `
    <tr>
      <td style="padding: 0 0 24px 0;">
        <p style="margin: 0 0 12px 0; font-family: 'Lato', Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: ${burgundy};">
          ${section.title}
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${section.questions.map((q, qi) => `
          <tr>
            <td style="padding: 0 0 ${qi < section.questions.length - 1 ? "12px" : "0"} 0; border-bottom: ${qi < section.questions.length - 1 ? `1px solid ${border}` : "none"}; padding-bottom: ${qi < section.questions.length - 1 ? "12px" : "0"};">
              <p style="margin: 0 0 3px 0; font-family: 'Lato', Arial, sans-serif; font-size: 13px; font-weight: 300; color: ${inkSoft}; line-height: 1.5;">
                ${q.text}
              </p>
              <p style="margin: 0; font-family: 'Lato', Arial, sans-serif; font-size: 12px; font-weight: 600; color: ${ink};">
                ${SCALE_LABELS[answers[q.id] ?? 0] ?? "Not answered"} (${answers[q.id] ?? 0}/5)
              </p>
            </td>
          </tr>
          `).join("")}
        </table>
      </td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Honesty Inventory Results</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f0ea; font-family: 'Lato', Arial, sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f0ea; padding: 40px 20px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: ${cream};">

          <!-- Header -->
          <tr>
            <td style="background-color: ${burgundy}; padding: 36px 48px 32px;">
              <p style="margin: 0 0 4px 0; font-family: 'Lato', Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.6);">
                The Honesty Inventory
              </p>
              <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 700; color: #ffffff; line-height: 1.2;">
                Your Results, ${firstName}.
              </h1>
            </td>
          </tr>

          <!-- Score block -->
          <tr>
            <td style="padding: 36px 48px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid ${border}; padding: 0;">
                <tr>
                  <td style="padding: 28px 28px 24px;">
                    <p style="margin: 0 0 4px 0; font-family: 'Lato', Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: ${inkFaint};">
                      Your score
                    </p>
                    <p style="margin: 0 0 2px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 48px; font-weight: 700; color: ${burgundy}; line-height: 1;">
                      ${totalScore}<span style="font-size: 20px; color: ${inkFaint};">/100</span>
                    </p>
                    <p style="margin: 12px 0 20px; font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: 700; color: ${ink}; line-height: 1.3;">
                      ${tier.headline}
                    </p>
                    <!-- Total score bar -->
                    <div style="width: 100%; height: 6px; background: ${border}; border-radius: 3px; line-height: 0; font-size: 0; margin-bottom: 0;">
                      <div style="width: ${scorePct}%; height: 6px; background: ${burgundy}; border-radius: 3px; min-width: 6px;"></div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Tier body copy -->
          <tr>
            <td style="padding: 28px 48px 0;">
              <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 16px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                ${tier.body}
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 32px 48px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top: 1px solid ${border};"></td></tr>
              </table>
            </td>
          </tr>

          <!-- Section scores -->
          <tr>
            <td style="padding: 28px 48px 0;">
              <p style="margin: 0 0 20px 0; font-family: 'Lato', Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: ${inkFaint};">
                Section Scores
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${sectionsHtml}
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 32px 48px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top: 1px solid ${border};"></td></tr>
              </table>
            </td>
          </tr>

          <!-- Action intro -->
          <tr>
            <td style="padding: 32px 48px 0;">
              <p style="margin: 0 0 16px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 17px; font-weight: 700; color: ${ink}; line-height: 1.4;">
                Here&rsquo;s the action I want you to take next.
              </p>
              <p style="margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                Look back through the statements.
              </p>
              <p style="margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                Notice the ones that catch your eye.
              </p>
              <p style="margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                Maybe it&rsquo;s the way you scored something.
              </p>
              <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                Maybe it&rsquo;s a statement that hit you in your gut.
              </p>
            </td>
          </tr>

          <!-- Your answers (embedded in copy) -->
          <tr>
            <td style="padding: 28px 48px 0;">
              <p style="margin: 0 0 20px 0; font-family: 'Lato', Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: ${inkFaint};">
                Your Answers
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${answersHtml}
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 32px 48px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top: 1px solid ${border};"></td></tr>
              </table>
            </td>
          </tr>

          <!-- Exercise intro -->
          <tr>
            <td style="padding: 32px 48px 0;">
              <p style="margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                Now I&rsquo;m going to ask you to try something new.
              </p>
              <p style="margin: 0 0 24px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                You&rsquo;re going to need about 10 minutes for this exercise.
              </p>
              <p style="margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                Grab a piece of paper and a pen &mdash; nothing fancy.
              </p>
              <p style="margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                Next, hit play on the video below. It&rsquo;s just under 5 minutes.
              </p>
              <p style="margin: 0 0 20px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                Come back to this email when you are done writing.
              </p>
            </td>
          </tr>

          <!-- Video thumbnail -->
          <tr>
            <td style="padding: 0 48px 0; text-align: center;">
              <a href="https://youtu.be/88tCQFYVcMk" style="display: block; text-decoration: none;">
                <img src="https://img.youtube.com/vi/88tCQFYVcMk/hqdefault.jpg"
                     width="504"
                     alt="Watch the video"
                     style="width: 100%; max-width: 504px; height: auto; display: block; border: none; border-radius: 2px;" />
                <p style="margin: 10px 0 0 0; font-family: 'Lato', Arial, sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${burgundy};">
                  &#9654;&nbsp; Watch Now
                </p>
              </a>
            </td>
          </tr>

          <!-- After video copy + sign-off -->
          <tr>
            <td style="padding: 28px 48px 0;">
              <p style="margin: 0 0 24px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 13px; font-style: italic; font-weight: 400; color: ${inkFaint}; line-height: 1.6;">
                This poem is from <em>A Hundred Falling Veils</em>, and is used with permission of the author.
              </p>
              <p style="margin: 0 0 16px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 700; color: ${ink}; line-height: 1.5;">
                If you got this far &ndash; you are a rockstar.
              </p>
              <p style="margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                First, you were honest on the assessment.
              </p>
              <p style="margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                Then, you decided you wanted the next steps.
              </p>
              <p style="margin: 0 0 28px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                And just now, you finally and maybe for the first time, put your honesty on paper.
              </p>
              <p style="margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                If you feel exhausted right now &mdash; that&rsquo;s normal.
              </p>
              <p style="margin: 0 0 28px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                You&rsquo;ve been holding a lot in.
              </p>
              <p style="margin: 0 0 28px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                Be kind to yourself in the coming days (well, always, but especially now that you&rsquo;ve cracked this door open).
              </p>
              <p style="margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                I&rsquo;ll be in your inbox in a few days to check in.
              </p>
              <p style="margin: 0 0 28px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                Until then, hit reply and tell me your biggest &ldquo;aha!&rdquo; moment from the quiz or your writing. I read every response and I truly want to know.
              </p>
              <p style="margin: 0 0 4px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${inkSoft}; line-height: 1.7;">
                In Truth,
              </p>
              <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 700; color: ${ink}; line-height: 1.7;">
                Kim
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 48px 36px; border-top: 1px solid ${border}; margin-top: 32px;">
              <p style="margin: 0; font-family: 'Lato', Arial, sans-serif; font-size: 12px; font-weight: 300; color: ${inkFaint}; line-height: 1.6;">
                The Honesty Revolution is where women do the real work of living honestly. <a href="https://thehonestyrevolution.com" style="color: ${burgundy}; text-decoration: underline;">Learn more here.</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ── Subject lines by tier ────────────────────────────────────────────────────
function getSubjectLine(tierTag: string, firstName: string): string {
  const subjects: Record<string, string> = {
    "honesty-tier-1": `${firstName}, your Honesty Inventory results are here`,
    "honesty-tier-2": `${firstName}, your Honesty Inventory results are here`,
    "honesty-tier-3": `${firstName}, your Honesty Inventory results are here`,
    "honesty-tier-4": `${firstName}, your Honesty Inventory results are here`,
  };
  return subjects[tierTag] ?? `${firstName}, your Honesty Inventory results are here`;
}

// ── Convex action ────────────────────────────────────────────────────────────
export const sendResultsEmail = action({
  args: {
    firstName: v.string(),
    email: v.string(),
    totalScore: v.number(),
    tier: v.string(),
    answers: v.record(v.string(), v.number()),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (_ctx, { firstName, email, totalScore, tier, answers }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("Resend API key not configured");

    const html = buildEmailHtml(firstName, totalScore, tier, answers);
    const subject = getSubjectLine(tier, firstName);

    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [email],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Resend error ${response.status}: ${text}`);
    }

    return { success: true };
  },
});
