import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import MainCardPage from "./Features/Card/MainCardPage.tsx";
import CardPage from "./Features/Card/CardPage.tsx";
import AuthPage from "./Features/Auth/AuthPage.tsx";
import MyCardsPage from "./Features/MyCards/MyCardsPage.tsx";
import ReqAuth from "./components/ReqAuth.tsx";
import { UserProvider } from "./context/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route
                        path="/my-cards"
                        element={
                            <ReqAuth>
                                <MyCardsPage />
                            </ReqAuth>
                        }
                    />
                    <Route
                        path="/card/:cardId"
                        element={
                            <ReqAuth>
                                <CardPage />
                            </ReqAuth>
                        }
                    />
                    <Route
                        path="/:username"
                        element={
                            <ReqAuth>
                                <MainCardPage />
                            </ReqAuth>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    </StrictMode>
);
