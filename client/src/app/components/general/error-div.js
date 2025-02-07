import React, { useContext } from 'react';
import { ErrorContext } from '@/context/errorContext';
import { useLanguage } from '@/context/Languagecontext';

const ErrorDiv = () => {
  const { errorMessage, clearErrorMessage } = useContext(ErrorContext);
  const { translate } = useLanguage();

  if (!errorMessage) return null;

  return (
    <div className="bg-red-100 text-red-800 p-4 rounded mb-4 text-center relative">
      <button 
        className="absolute top-1 right-2 text-lg text-red-700"
        onClick={clearErrorMessage}
      >
        ✖
      </button>
      {translate(errorMessage)}
    </div>
  );
};

export default ErrorDiv;