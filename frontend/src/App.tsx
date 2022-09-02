// import { AuthContextProvider } from "./contexts/AuthContext";
// // routes
// import Router from './pages/routes/Router';

// export default function App() {
//   return (
//     <AuthContextProvider>
//       <Router />
//     </AuthContextProvider>
//   );
// };

import { AuthContextProvider } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainBoard from "./pages/MainBoard";
import Login from "./pages/Login";
import { Navbar } from "./components/Navbar";
import ProtectedRoute from "./pages/routes/ProtectedRoute"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthContextProvider>
              <Navbar />
            </AuthContextProvider>
          }
        >
        <Route
          path=""
          element={
            <ProtectedRoute>
              <MainBoard />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
