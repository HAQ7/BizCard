import { NavLink, useNavigate } from "react-router";
import logo from "../../assets/logo.svg";
import { useUser } from "../../context/UserContext";
import { LogOutIcon, PlusCircleIcon } from "lucide-react";
import Card from "../../components/card";

export default function MyCardsPage() {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    console.log("User in MyCardsPage:", user);
    return (
        <>
            <header className="flex justify-between items-center m-2 mx-4">
                <div className="flex items-center gap-10">
                    <div>
                        <div>{user?.userName}</div>
                        <span className="text-sm text-gray-500">
                            ({user?.roleName})
                        </span>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            navigate("/auth?type=login");
                        }}
                        className="flex gap-2 text-gray-500 cursor-pointer hover:text-gray-800 transition-colors"
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
                    {user?.cards?.map(card => {
                        if (card.id === user.mainCard?.id) {
                            return (
                                <Card
                                    key={card.id}
                                    name={card?.displayName}
                                    roleName={card.roleName}
                                    BGColor={card.BGColor}
                                    TextColor={card.TextColor}
                                    isMain={true}
                                />
                            );
                        }
                        return (
                            <Card
                                key={card.id}
                                name={card?.displayName}
                                roleName={card.roleName}
                                BGColor={card.BGColor}
                                TextColor={card.TextColor}
                            />
                        );
                    })}

                    <button className="max-w-[500px] w-full grid place-items-center p-4 py-16 border rounded-lg border-dashed border-gray-500 text-center cursor-pointer text-gray-500 hover:bg-gray-50 transition-all hover:scale-105 font-semibold">
                        <PlusCircleIcon />
                        Add new card
                    </button>
                </div>
            </div>
        </>
    );
}
