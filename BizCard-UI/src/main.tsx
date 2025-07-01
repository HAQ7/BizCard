import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import MainCardPage from "./Features/Card/MainCardPage.tsx";
import CardPage from "./Features/Card/CardPage.tsx";
import AuthPage from "./Features/Auth/AuthPage.tsx";
import MyCardsPage from "./Features/MyCards/MyCardsPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/my-cards" element={<MyCardsPage />} />
        <Route path="/card/:cardId" element={<CardPage />} />
        <Route path="/:username" element={<MainCardPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
