export interface Question {
  id: string;
  text: string;
}

export interface Section {
  id: number;
  title: string;
  label: string; // e.g. "SECTION 01 OF 04"
  subtitle: string;
  lowestSectionCopy: string;
  questions: Question[];
}

export interface ScoreTier {
  tier: number;
  range: string;
  min: number;
  max: number;
  tag: string;
  headline: string;
  body: string;
}

export type Answers = Record<string, number>;

export const SECTIONS: Section[] = [
  {
    id: 1,
    label: "SECTION 01 OF 04",
    title: "Your Daily Life & Energy",
    subtitle:
      "The routines, commitments, and daily choices that shape how you actually live — and whether any of it feels like yours.",
    lowestSectionCopy:
      "A lot of your energy goes into managing the logistics of a family, a home, a calendar. A low score here means some of what fills your days is coming from obligation or expectation, not choice, and it's draining you physically, emotionally, and mentally. It can also mean that even when you're physically present with the people you love, your mind is somewhere else, running through your list.",
    questions: [
      {
        id: "1.1",
        text: "My daily routines reflect how I actually want to live, not what I think a person like me \"should\" be doing.",
      },
      {
        id: "1.2",
        text: "I say yes to commitments because I want to, not because I feel guilty or afraid of what someone will think if I don't.",
      },
      {
        id: "1.3",
        text: "I have time in my week that is simply for me, with no productivity attached to it.",
      },
      {
        id: "1.4",
        text: "Our family calendar has room for downtime, not just activities and obligations.",
      },
      {
        id: "1.5",
        text: "When I'm with my family, I'm actually with them, not mentally somewhere else, running through my list.",
      },
    ],
  },
  {
    id: 2,
    label: "SECTION 02 OF 04",
    title: "Your Relationships",
    subtitle:
      "What you say, what you hold back, and how much of the real you actually shows up.",
    lowestSectionCopy:
      "Your relationships are draining you. A low score here means you may be keeping relationships out of obligation or expectation, even ones you've outgrown, and you struggle to say no without feeling guilty afterward. It can also mean you're not able to fully be yourself, or fully present, with the people you love most, and that when something's wrong, you absorb it quietly instead of saying something.",
    questions: [
      {
        id: "2.1",
        text: "I'm able to say no to people without feeling guilty afterward.",
      },
      {
        id: "2.2",
        text: "The version of me that shows up in most social situations feels like the real me — not a performance.",
      },
      {
        id: "2.3",
        text: "The relationships I invest in are ones I genuinely choose, not ones I stay in out of guilt or obligation.",
      },
      {
        id: "2.4",
        text: "The people I love most get my real attention, rather than the scraps left over after everything else.",
      },
      {
        id: "2.5",
        text: "When something bothers me in a relationship, I say something, rather than quietly absorbing it and carrying it alone.",
      },
    ],
  },
  {
    id: 3,
    label: "SECTION 03 OF 04",
    title: "Your Purpose & Work",
    subtitle:
      "Whether what you're doing is what you actually chose — or what you've never thought to question.",
    lowestSectionCopy:
      "Your work is draining you. A low score here means you may be going through the motions, stuck in burnout, or doing work that no longer aligns with your values but feels too late to leave. You may not remember the last time you actually enjoyed what you do.",
    questions: [
      {
        id: "3.1",
        text: "I enjoy my job and the work I do in the world.",
      },
      {
        id: "3.2",
        text: "My work, including what it demands of me, feels sustainable.",
      },
      {
        id: "3.3",
        text: "When I imagine an ideal ordinary day — not a vacation, just a regular Tuesday — it looks something like what I'm currently living.",
      },
      {
        id: "3.4",
        text: "When I'm doing my work, I feel genuinely engaged, rather than checked out.",
      },
      {
        id: "3.5",
        text: "The work I do still feels connected to who I am now, not just who I was when I chose this path.",
      },
    ],
  },
  {
    id: 4,
    label: "SECTION 04 OF 04",
    title: "Your Inner Voice",
    subtitle:
      "How well you know yourself underneath all the roles you've been playing.",
    lowestSectionCopy:
      "You've been so busy taking care of everyone else, you've lost yourself. A low score here means you may not really know who you are anymore, beyond the roles you play, and that you push away feelings of emptiness instead of letting yourself admit them. It can also mean you don't feel worthy of the love and care you give so freely to everyone else, and that you're performing the version of yourself that keeps everyone else comfortable rather than showing up as who you really are.",
    questions: [
      {
        id: "4.1",
        text: "I let myself feel things like emptiness, loneliness, or a sense that something is missing, instead of pushing them away.",
      },
      {
        id: "4.2",
        text: "I have a clear sense of who I am — separate from my roles as mom, partner, employee, daughter, friend.",
      },
      {
        id: "4.3",
        text: "I show up as myself in my daily life, rather than performing the version of me that keeps everyone comfortable.",
      },
      {
        id: "4.4",
        text: "I speak to myself the way I'd speak to a close friend, with some patience, some grace, and some real honesty.",
      },
      {
        id: "4.5",
        text: "I believe I deserve ordinary joy, and I don't have to wait until things settle down to have it.",
      },
    ],
  },
];

export const SCALE_LABELS: Record<number, string> = {
  1: "Not true for me",
  2: "Rarely true for me",
  3: "Somewhat true for me",
  4: "Mostly true for me",
  5: "Completely true for me",
};

export const SCORE_TIERS: ScoreTier[] = [
  {
    tier: 1,
    range: "80–100",
    min: 80,
    max: 100,
    tag: "honesty-tier-1",
    headline: "You've done real work to get here.",
    body: "Somewhere along the way you stopped managing your life on autopilot and started paying attention to what you actually want. But honesty is an ongoing practice — there's probably still a place or two where the truth is easier to see than it is to act on. Life keeps evolving and so will this work. Keep going.",
  },
  {
    tier: 2,
    range: "55–79",
    min: 55,
    max: 79,
    tag: "honesty-tier-2",
    headline: "You are headed in the right direction.",
    body: "There are parts of your life where you're living in alignment with what you actually want — and you probably know exactly which parts those are. But there are also places where you're still putting others first, still avoiding the conversations that might disappoint someone, still holding back the honest version of yourself. That's where the real work — and the real magic — lives.",
  },
  {
    tier: 3,
    range: "20–54",
    min: 20,
    max: 54,
    tag: "honesty-tier-3",
    headline: "You show up for everyone.",
    body: "You stay committed, stay available — and somewhere in all of that, you got lost. Not dramatically. Just quietly, over time, one yes at a time. You give everything to everyone and there is not much left for you at the end of the day, and it has left you exhausted. Mentally. Emotionally. Physically. You probably feel a little like you don't know who you are outside of all the roles you're playing. A little like this isn't what you signed up for. You know something feels off. You've known for a while. That knowing is worth listening to.",
  },
];

export function getTier(score: number): ScoreTier {
  return (
    SCORE_TIERS.find(t => score >= t.min && score <= t.max) ?? SCORE_TIERS[2]
  );
}

export function getLowestSection(answers: Answers): Section {
  let lowest = SECTIONS[0];
  let lowestScore = Infinity;
  for (const section of SECTIONS) {
    const score = section.questions.reduce(
      (sum, q) => sum + (answers[q.id] ?? 0),
      0,
    );
    if (score < lowestScore) {
      lowestScore = score;
      lowest = section;
    }
  }
  return lowest;
}

export const BEFORE_YOU_BEGIN_INTRO = `Where you see the word family, read it as the people you love most — whatever that means for you.`;

export const BEFORE_YOU_BEGIN_INSTRUCTION = `For each statement, rate how true it feels for you right now — not how you want it to be, and not how it used to be.`;

export const BEFORE_YOU_BEGIN_HONEST_LINES = [
  "Be honest.",
  "Not the version of honest that makes you look good, and not the version that's harder on yourself than you deserve.",
  "Just honest.",
];

// "trust your gut" rendered in italics by ScoreNote via JSX
export const RESULTS_NOTE_PARTS = {
  before:
    "A note before you read your results: it is easy to score yourself higher than what's actually true. Because you are practiced at telling yourself you're fine. It is also easy to be harder on yourself than you deserve. If your score surprised you in either direction — ",
  italic: "trust your gut",
  after:
    " over the number. And don't get distracted by your total score — the real information is in the sections and the individual statements where you scored lowest. That's where the honest work lives.",
};
