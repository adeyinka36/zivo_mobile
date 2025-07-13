import { createContext, useContext, useState, ReactNode } from "react";
import { MediaWithQuestionType } from "@/types/MediaWithQuestion";

interface QuizContextType {
  quizData: MediaWithQuestionType | null;
  setQuizData: (data: MediaWithQuestionType | null) => void;
  clearQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [quizData, setQuizData] = useState<MediaWithQuestionType | null>(null);

  const clearQuiz = () => {
    setQuizData(null);
  };

  return (
    <QuizContext.Provider value={{ quizData, setQuizData, clearQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export default useQuiz;