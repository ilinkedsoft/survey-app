import { useState, useEffect } from 'react';
import { Question as QuestionComponent } from './Question';
import { getQuestions, submitSurvey } from '../services/api';
import type { Question, SurveyResponse } from '../types';

export const Survey: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);
        // Initialize responses with empty values
        const initialResponses: Record<number, string | string[]> = {};
        data.forEach((q) => {
          initialResponses[q.id] = q.type === 'checkbox' ? [] : '';
        });
        setResponses(initialResponses);
      } catch (err) {
        setError('Failed to load questions. Please try again later.');
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (value: string | string[]) => {
    setResponses((prev) => ({
      ...prev,
      [questions[currentStep].id]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const surveyResponses: SurveyResponse[] = Object.entries(responses).map(
        ([questionId, answer]) => ({
          questionId: parseInt(questionId),
          answer,
        })
      );
      await submitSurvey(surveyResponses);
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReview = () => {
    setIsReviewing(true);
  };

  const handleEdit = () => {
    setIsReviewing(false);
  };

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Thank you for completing the survey!
        </h2>
        <p className="text-gray-600 mb-8">
          Your responses have been recorded successfully.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Start New Survey
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Loading questions...</p>
      </div>
    );
  }

  if (isReviewing) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Answers</h2>
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Question {index + 1}: {question.title}
              </h3>
              <p className="text-gray-600 mb-4">{question.description}</p>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-800">
                  Your answer: {Array.isArray(responses[question.id]) 
                    ? (responses[question.id] as string[]).join(', ')
                    : responses[question.id]}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-8">
          <button onClick={handleEdit} className="btn btn-secondary">
            Edit Answers
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`btn btn-primary ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Survey'}
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Question {currentStep + 1} of {questions.length}
        </p>
      </div>

      <QuestionComponent
        question={currentQuestion}
        value={responses[currentQuestion.id]}
        onChange={handleAnswer}
      />

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`btn btn-secondary ${
            currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Previous
        </button>

        {currentStep === questions.length - 1 ? (
          <button onClick={handleReview} className="btn btn-primary">
            Review Answers
          </button>
        ) : (
          <button onClick={handleNext} className="btn btn-primary">
            Next
          </button>
        )}
      </div>
    </div>
  );
}; 