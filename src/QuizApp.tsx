import { useState } from "react";
import BeforeYouBegin from "./screens/BeforeYouBegin";
import EmailGate from "./screens/EmailGate";
import LandingPage from "./screens/LandingPage";
import QuizSection from "./screens/QuizSection";
import Results from "./screens/Results";
import ScoreNote from "./screens/ScoreNote";
import ThankYou from "./screens/ThankYou";
import { SECTIONS } from "./data/quiz";

type Screen =
  | "landing"
  | "intro"
  | "quiz"
  | "scorenote"
  | "results"
  | "nowwhat"
  | "thankyou";

type Answers = Record<string, number>;

const TOTAL_QUESTIONS = SECTIONS.reduce((sum, s) => sum + s.questions.length, 0);

export default function QuizApp() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [answers, setAnswers] = useState<Answers>({});
  // sectionIndex: 0–3; questionIndex: -1 = section intro, 0–4 = question
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(-1);

  const answeredCount = Object.keys(answers).length;

  function go(s: Screen) {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAnswer(questionId: string, value: number) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  function handleNextQuestion() {
    const section = SECTIONS[sectionIndex];

    if (questionIndex === -1) {
      // Section intro → first question
      setQuestionIndex(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const isLastQuestion = questionIndex === section.questions.length - 1;
    const isLastSection = sectionIndex === SECTIONS.length - 1;

    if (isLastQuestion && isLastSection) {
      // All done → score note
      go("scorenote");
    } else if (isLastQuestion) {
      // Next section intro
      setSectionIndex(i => i + 1);
      setQuestionIndex(-1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Next question in same section
      setQuestionIndex(q => q + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }


  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);

  return (
    <>
      {screen === "landing" && <LandingPage onStart={() => go("intro")} />}

      {screen === "intro" && (
        <BeforeYouBegin
          onStart={() => {
            setSectionIndex(0);
            setQuestionIndex(-1);
            go("quiz");
          }}
        />
      )}

      {screen === "quiz" && (
        <QuizSection
          sectionIndex={sectionIndex}
          questionIndex={questionIndex}
          answers={answers}
          onAnswer={handleAnswer}
          onNextQuestion={handleNextQuestion}
          totalAnswered={answeredCount}
          totalQuestions={TOTAL_QUESTIONS}
        />
      )}

      {screen === "scorenote" && (
        <ScoreNote
          onContinue={() => go("results")}
        />
      )}

      {screen === "results" && (
        <Results
          answers={answers}
          totalScore={totalScore}
          onNowWhat={() => go("nowwhat")}
        />
      )}

      {screen === "nowwhat" && (
        <EmailGate
          totalScore={totalScore}
          answers={answers}
          onSubmit={() => go("thankyou")}
        />
      )}

      {screen === "thankyou" && <ThankYou />}
    </>
  );
}
