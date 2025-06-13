import React from 'react';
import type { Question as QuestionType } from '../types';

interface QuestionProps {
  question: QuestionType;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export const Question: React.FC<QuestionProps> = ({
  question,
  value,
  onChange,
  error
}) => {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            rows={question.options.multiline ? 4 : 1}
            maxLength={question.options.maxLength}
            placeholder="Type your answer here..."
          />
        );
      
      case 'rating':
        return (
          <div className="flex items-center justify-center space-x-6">
            {Array.from({ length: question.options.max - question.options.min + 1 }, (_, i) => i + question.options.min).map((rating) => (
              <label key={rating} className="flex flex-col items-center cursor-pointer group">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={rating}
                  checked={value === rating}
                  onChange={(e) => onChange(Number(e.target.value))}
                  className="w-6 h-6 text-primary-500 border-gray-300 focus:ring-primary-500"
                />
                <span className="mt-2 text-sm text-gray-600 group-hover:text-primary-500 transition-colors duration-200">
                  {question.options.labels[rating]}
                </span>
              </label>
            ))}
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-3">
            {question.options.choices.map((choice) => (
              <label key={choice} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={choice}
                  checked={value === choice}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-5 h-5 text-primary-500 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-3 text-gray-700">{choice}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options.choices.map((choice) => (
              <label key={choice} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <input
                  type="checkbox"
                  value={choice}
                  checked={Array.isArray(value) && value.includes(choice)}
                  onChange={(e) => {
                    const newValue = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) {
                      newValue.push(choice);
                    } else {
                      const index = newValue.indexOf(choice);
                      if (index > -1) {
                        newValue.splice(index, 1);
                      }
                    }
                    onChange(newValue);
                  }}
                  className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-3 text-gray-700">{choice}</span>
              </label>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{question.title}</h3>
      {question.description && (
        <p className="text-gray-600 mb-6">{question.description}</p>
      )}
      {renderInput()}
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}; 