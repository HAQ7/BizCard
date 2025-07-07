import { NavLink } from "react-router";
import logo from "./assets/logo.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards, Autoplay } from "swiper/modules";
import { InfiniteSlider } from "./components/motion-primitives/infinite-slider";

function App() {
    const cards = [
        { name: "Hussam Ahmed", title: "Software Engineer", bg: "#ffffff" },
        { name: "Abdulmohsen Adel", title: "CEO", bg: "#e1eef3" },
        { name: "Mohammed Abdullah", title: "QA Engineer", bg: "#f3e9e1" },
        { name: "Layla K.", title: "UX Specialist", bg: "#dedede" },
        { name: "Omar Zaid", title: "Frontend Developer", bg: "#eeeee4" },
    ];

    return (
        <>
            <header className="flex justify-between items-center m-2 mx-4">
                <img className="w-20" src={logo} />
                <nav className="flex gap-4 items-center">
                    <NavLink
                        to={"/auth?type=login"}
                        className="text-[#3E3E3E] hover:text-[hsl(0,0%,19%)] transition-colors"
                    >
                        Login
                    </NavLink>
                    <NavLink
                        to={"/auth?type=signup"}
                        className="bg-[#0051FF] hover:bg-[hsl(221,100%,45%)] text-white px-3 py-2 rounded-lg transition-colors font-semibold"
                    >
                        Sign Up
                    </NavLink>
                </nav>
            </header>
            <div className="flex justify-center items-center px-3 lg:text-start text-center">
                <div className=" max-w-[1600px] w-full relative flex flex-col gap-40 lg:mt-30 mt-10">
                    <section className="flex flex-col items-center justify-center lg:grid lg:grid-cols-2 place-items-center lg:gap-4 gap-12  overflow-hidden">
                        <div className="flex flex-col 2xl:gap-12 gap-5 2xl:max-w-[1000px] max-w-[500px] w-full items-center lg:items-start">
                            <h1 className="font-bold 2xl:text-8xl sm:text-6xl text-4xl w-full ">
                                Elegant Business Cards at Your Fingertips
                            </h1>
                            <p className="w-full max-w-[500px] 2xl:text-2xl sm:text-lg text-sm text-[#3E3E3E]">
                                Design sleek, professional business cards in
                                minutes. Choose a template, customize your
                                details, and download or print — all in one
                                place.
                            </p>
                            <NavLink
                                to={"/auth?type=signup"}
                                className="bg-[#0051FF] hover:bg-[hsl(221,100%,45%)] text-white px-6 py-3 rounded-lg transition-colors font-semibold w-min whitespace-nowrap"
                            >
                                Get Started
                            </NavLink>
                        </div>
                        <div className="2xl:max-w-[600px] sm:max-w-[500px] max-w-[400px] w-full p-4 -order-1 lg:order-1">
                            <Swiper
                                effect={"cards"}
                                grabCursor={true}
                                autoplay={{
                                    delay: 1000,
                                    disableOnInteraction: false,
                                }}
                                modules={[EffectCards, Autoplay]}
                                className="mySwiper"
                            >
                                {cards.map((card, index) => (
                                    <SwiperSlide
                                        key={index}
                                        style={{
                                            boxShadow:
                                                "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                                        }}
                                        className="bg-white grid place-item-center rounded-xl"
                                    >
                                        <div className="grid place-items-center p-10 2xl:py-20 sm:py-16 py-10 text-center">
                                            <h1 className="sm:text-3xl text-xl font-bold ">
                                                {card.name}
                                            </h1>
                                            <p className="text-[#3e3e3e] sm:text-xl text-md font-judson">
                                                {card.title}
                                            </p>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </section>
                    <section>
                        <div className="relative">
                            <div className="absolute w-10 h-full bg-gradient-to-r from-white to-transparent z-50" />
                            <div className="absolute w-10 right-0 h-full bg-gradient-to-r from-transparent to-white z-50" />
                            <InfiniteSlider
                                className="py-5"
                                gap={24}
                            >
                                {cards.map((card, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            boxShadow:
                                                "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                                            background: card.bg,
                                        }}
                                        className="p-10 2xl:py-20 sm:py-16 py-10 text-center  grid place-items-center rounded-xl sm:w-[500px] w-[300px]"
                                    >
                                        <h1 className="sm:text-3xl text-xl font-bold ">
                                            {card.name}
                                        </h1>
                                        <p className="text-[#3e3e3e] sm:text-xl text-md font-judson">
                                            {card.title}
                                        </p>
                                    </div>
                                ))}
                            </InfiniteSlider>
                            <InfiniteSlider
                                className="pb-10 pt-5"
                                reverse
                                gap={24}
                            >
                                {cards.reverse().map((card, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            boxShadow:
                                                "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                                            background: card.bg,
                                        }}
                                        className="p-10 2xl:py-20 sm:py-16 py-10 text-center grid place-items-center rounded-xl sm:w-[500px] w-[300px]"
                                    >
                                        <h1 className="sm:text-3xl text-xl font-bold ">
                                            {card.name}
                                        </h1>
                                        <p className="text-[#3e3e3e] sm:text-xl text-md font-judson">
                                            {card.title}
                                        </p>
                                    </div>
                                ))}
                            </InfiniteSlider>
                        </div>

                        <div className="grid place-items-center 2xl:gap-12 gap-5 text-center">
                            <h1 className="font-bold 2xl:text-8xl sm:text-6xl text-4xl ">
                                Many Ideas,
                                <br /> Many Designs
                            </h1>
                            <p className="w-full max-w-[500px] 2xl:text-2xl sm:text-lg text-sm text-[#3E3E3E]">
                                Unleash your creativity with a world of
                                possibilities. Whether you're a professional,
                                freelancer, or entrepreneur, design your perfect
                                business card.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
            <footer className="mt-40 h-30 w bg-white shadow-2xl grid place-items-center">
                {" "}
                <img className="w-20" src={logo} />
            </footer>
        </>
    );
}

export default App;
