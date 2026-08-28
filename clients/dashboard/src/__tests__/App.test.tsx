import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock LoginPage locally
jest.mock('../pages/LoginPage', () => {
  return function MockLoginPage() {
    return React.createElement('div', null, 'Mock Login Page');
  };
});

test('App renders without crashing', () => {
  const { container } = render(<App />);
  expect(container.querySelector('div')).toBeInTheDocument();
});
