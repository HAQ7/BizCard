export default function Card({
    name,
    roleName,
    BGColor,
    TextColor,
    isMain = false,
}: {
    name: string;
    roleName: string;
    BGColor: string;
    TextColor: string;
    isMain?: boolean;
}) {
    return (
        <div
            style={{
                backgroundColor: BGColor,
                color: TextColor,
            }}
            className="max-w-[500px] w-full p-4 py-16 grid place-items-center shadow-card rounded-xl transition-all hover:scale-105 cursor-pointer text-center"
        >
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-md font-judson">{roleName}</p>
            {isMain && (
                <span className="text-sm text-gray-500 mt-2">
                    (Main Card)
                </span>
            )}
        </div>
    );
}
