import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext";

interface ReqAuthProps {
    children: React.ReactNode;
}

export default function ReqAuth({ children }: ReqAuthProps) {
    const [isLoading, setIsLoading] = useState(true);
    const {setUser, isAuthenticated } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("authToken");
            
            if (!token) {
                setIsLoading(false);
                navigate("/auth?type=signup");
                return;
            }

            try {
                const response = await fetch("http://localhost:5280/api/user/me", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    // Token is invalid, remove it and redirect
                    localStorage.removeItem("authToken");
                    navigate("/auth?type=signup");
                }
            } catch (error) {
                console.error("Error verifying token:", error);
                localStorage.removeItem("authToken");
                navigate("/auth?type=signup");
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, [navigate, setUser]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0051FF]"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return null;
}