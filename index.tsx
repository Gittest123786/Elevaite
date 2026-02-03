import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import RootLayout from './app/layout.jsx';
import Home from './app/page.jsx';

const AppRouter = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // index.tsx now purely serves as a root router that returns the main Home component.
  // Onboarding and Recruiter views are now managed within the landing page's NavbarSection
  // or via local state to provide a more seamless, component-driven experience.
  return <Home />;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Target container 'root' not found");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RootLayout>
      <AppRouter />
    </RootLayout>
  </React.StrictMode>
);