import React, { createContext, useState } from 'react';

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const setGlobalErrorMessage = (message) => {
    setErrorMessage(message);
  };

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  return (
    <ErrorContext.Provider value={{ errorMessage, setGlobalErrorMessage, clearErrorMessage }}>
      {children}
    </ErrorContext.Provider>
  );
};