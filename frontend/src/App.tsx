// routes
import Router from './pages/routes/Router';
import ThemeProvider from './theme';

export default function App() {
  return (
    <ThemeProvider>
      <Router />
  </ThemeProvider>
  );
};