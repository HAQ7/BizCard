import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import { LoaderCircleIcon } from "lucide-react";

interface ReqAuthProps {
  children: React.ReactNode;
  optional?: boolean;
}

export default function ReqAuth({ children, optional = false }: ReqAuthProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setIsLoading(false);
        if (!optional) {
          navigate("/auth?type=signup");
        }
        return;
      }

      try {
        const response = await fetch("http://localhost:5280/api/user/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token is invalid, remove it and redirect only if not optional
          localStorage.removeItem("authToken");
          if (!optional) {
            navigate("/auth?type=signup");
          }
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        localStorage.removeItem("authToken");
        if (!optional) {
          navigate("/auth?type=signup");
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [navigate, setUser, optional]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen grid place-items-center">
        <LoaderCircleIcon className=" animate-spin text-[#0051FF]" />
      </div>
    );
  }

  // If optional, always render children regardless of authentication status
  if (optional) {
    return <>{children}</>;
  }

  // If not optional, only render children if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
}
