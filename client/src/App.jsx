import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home/Home";
import AskQuestion from "./pages/Ask/AskQuestion";
import Detail from "./pages/Detail/Deatil";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Chat from "./components/Chat/Chat";

export default function App() {
  return (
    <>
      <Header />

<Routes>
  <Route element={<Landing />}>
    <Route path="/" element={<Navigate to="/auth/login" replace />} />
    <Route path="/auth/login" element={<Login />} />
    <Route path="/auth/signup" element={<Signup />} />
  </Route>

  <Route path="/how-it-works" element={<HowItWorks />} />

  <Route element={<ProtectedRoute />}>
    <Route path="/home" element={<Home />} />
    <Route path="/ask" element={<AskQuestion />} />
    <Route path="/question/:id" element={<Detail />} />
  </Route>
</Routes>

      {/* Live Chat */}
      <Chat />
      <Footer />
    </>
  );
}
