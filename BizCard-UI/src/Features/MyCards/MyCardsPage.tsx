import { NavLink, useNavigate } from "react-router";
import logo from "../../assets/logo.svg";
import { useUser } from "../../context/UserContext";
import {
  LoaderCircleIcon,
  LogOutIcon,
  PlusCircleIcon,
  UserCircleIcon,
  TrashIcon,
} from "lucide-react";
import Card from "../../components/Card";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

type UserImage = {
  Image: string
}

export default function MyCardsPage() {
  const { user, setUser, logout } = useUser();
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState({} as UserImage);
  const [loadingUserImage, setLoadingUserImage] = useState(true);

  const handleDeleteCard = async (cardId: string, cardTitle?: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the card "${cardTitle || "Untitled"}"?`
      )
    ) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("You must be logged in to delete a card.");
      return;
    }

    const response = fetch(`http://localhost:5280/api/card/${cardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    toast.promise(response, {
      loading: (
        <>
          <LoaderCircleIcon className="animate-spin" size={20} />{" "}
          <span>Deleting Card...</span>
        </>
      ),
      success: () => {
        // Update user context to remove the deleted card
        if (user) {
          const updatedUser = {
            ...user,
            cards: user.cards?.filter((card) => card.id !== cardId) || [],
            // If the deleted card was the main card, clear the main card
            mainCard: user.mainCard?.id === cardId ? undefined : user.mainCard,
          };
          setUser(updatedUser);
        }
        return "Card deleted successfully!";
      },
      error: "Failed to delete card.",
    });
  };

  useEffect(() => {
    const getUserAvatar = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/auth?type=login");
        return;
      }

      // Check if user image is cached in localStorage
      const cachedImageKey = `userAvatar_${user?.email}`;
      const cachedImage = localStorage.getItem(cachedImageKey);
      
      if (cachedImage) {
        try {
          const parsedImage = JSON.parse(cachedImage);
          setUserImage(parsedImage);
          setLoadingUserImage(false);
          return;
        } catch (error) {
          // If parsing fails, remove the corrupted cache and fetch fresh
          localStorage.removeItem(cachedImageKey);
        }
      }

      // Fetch user image from API if not cached
      const response = await fetch(
        "http://localhost:5280/api/user/avatar/" + user?.email,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const userImage = await response.json();
        setUserImage(userImage);
        // Cache the user image in localStorage
        localStorage.setItem(cachedImageKey, JSON.stringify(userImage));
        setLoadingUserImage(false);
      } else {
        toast.error("Failed to fetch user image. Please log in again.");
        setLoadingUserImage(false);
      }
    };

    getUserAvatar();
  }, []);

  return (
    <>
      <header className="flex justify-between items-center m-2 mx-4">
        <div className="flex items-center">
          {loadingUserImage ? (
            <LoaderCircleIcon className="animate-spin" size={50} />
          ) : userImage ? (
            <img src={userImage.Image} className="w-12 aspect-square rounded-full" />
          ) : (
            <UserCircleIcon size={50} />
          )}
          <div className="ml-2">
            <div>{user?.userName}</div>
            <span className="text-sm text-gray-500">({user?.roleName})</span>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/auth?type=login");
            }}
            className="flex ml-10 gap-2 text-gray-500 cursor-pointer hover:text-gray-800 transition-colors"
          >
            Log out
            <LogOutIcon />
          </button>
        </div>
        <NavLink to={"/"}>
          <img className="w-20" src={logo} />
        </NavLink>
      </header>
      <div className="p-10">
        <h1 className="text-2xl font-bold">My Cards</h1>
        <div className="flex flex-wrap pt-4 gap-8">
          {user?.cards?.map((card) => {
            if (card.id === user.mainCard?.id) {
              return (
                <div
                  key={card.id}
                  className="w-full max-w-[400px] relative group"
                >
                  <NavLink to={`/${user.userName}`} className="block">
                    <Card card={card} isMain={true} />
                  </NavLink>
                  <button
                    onClick={() => handleDeleteCard(card.id, card.displayName)}
                    className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-800 rounded-full cursor-pointer transition-color z-10"
                    title="Delete card"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              );
            }
            return (
              <div
                key={card.id}
                className="w-full max-w-[400px] relative group"
              >
                <NavLink to={`/card/${card.id}`} className="block">
                  <Card card={card} />
                </NavLink>
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => handleDeleteCard(card.id, card.displayName)}
                    className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-800 rounded-full cursor-pointer transition-color z-10"
                    title="Delete card"
                  >
                    <TrashIcon size={16} />
                  </TooltipTrigger>
                  <TooltipContent>Delete card</TooltipContent>
                </Tooltip>
              </div>
            );
          })}

          <button
            onClick={async () => {
              // get token from localStorage
              const token = localStorage.getItem("authToken");
              if (!token) {
                toast.error("You must be logged in to create a card.");
                return;
              }
              const response = fetch("http://localhost:5280/api/card", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({}),
              });
              toast.promise(response, {
                loading: (
                  <>
                    <LoaderCircleIcon className="animate-spin" size={20} />{" "}
                    <span>Creating Card...</span>
                  </>
                ),
                success: async (res) => {
                  const data = await res.text();
                  navigate("/card/" + data);
                  return "Card created successfully!";
                },
                error: "Failed to create card.",
              });
            }}
            className="max-w-[400px] w-full h-42 grid place-items-center border-2 rounded-lg border-dashed border-gray-500 text-center cursor-pointer text-gray-500 hover:bg-gray-50 transition-all font-semibold"
          >
            <div className="grid place-items-center">
              <PlusCircleIcon />
              Add new card
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
