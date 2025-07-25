import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { App } from './App';

// Mock the locale provider and content components
jest.mock('locale/LocaleProvider', () => ({
  LocaleProvider: ({ setSystemLoading }: { setSystemLoading: (loading: boolean) => void }) => {
    const { useEffect } = require('react');
    useEffect(() => {
      // Simulate loading completion after a short delay
      const timeout = setTimeout(() => setSystemLoading(false), 100);
      return () => clearTimeout(timeout);
    }, [setSystemLoading]);
    return null;
  }
}));

jest.mock('utils/Content', () => ({
  Content: () => <div data-testid="content">Main Content</div>
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

const AppWrapper = () => (
  <ChakraProvider>
    <App />
  </ChakraProvider>
);

describe('App Component', () => {
  test('renders loading spinner initially', () => {
    render(<AppWrapper />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  test('renders main content after loading', async () => {
    render(<AppWrapper />);
    
    // Wait for loading to complete
    const content = await screen.findByTestId('content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Main Content');
  });

  test('has correct CSS class applied', () => {
    const { container } = render(<AppWrapper />);
    
    const appDiv = container.querySelector('.App');
    expect(appDiv).toBeInTheDocument();
  });
});