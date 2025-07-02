import { NavLink } from "react-router";
import logo from "./assets/logo.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards, Autoplay } from "swiper/modules";

function App() {
  const cards = [
    { name: "Hussam Ahmed", title: "Software Engineer" },
    { name: "Abdulmohsen Adel", title: "CEO" },
    { name: "Mohammed Abdullah", title: "QA Engineer" },
    { name: "Layla K.", title: "UX Specialist" },
    { name: "Omar Zaid", title: "Frontend Developer" },
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

      <main className="flex flex-col items-center justify-center lg:grid lg:grid-cols-2 place-items-center gap-4  mt-10 overflow-hidden px-10 py-10">
        <div className="flex flex-col gap-4 max-w-[500px] w-full">
          <h1 className="font-bold sm:text-6xl text-4xl w-full">
            Elegant Business Cards at Your Fingertips
          </h1>
          <p className="w-full max-w-[500px] sm:text-lg text-sm text-[#3E3E3E]">
            Design sleek, professional business cards in minutes. Choose a
            template, customize your details, and download or print — all in one
            place.
          </p>
          <NavLink
            to={"/auth?type=signup"}
            className="bg-[#0051FF] hover:bg-[hsl(221,100%,45%)] text-white px-6 py-3 rounded-lg transition-colors font-semibold w-min whitespace-nowrap"
          >
            Get Started
          </NavLink>
        </div>
        <div className="max-w-[500px] w-full p-4 -order-1 lg:order-1">
          <Swiper
            effect={"cards"}
            grabCursor={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[EffectCards, Autoplay]}
            className="mySwiper"
          >
            {cards.map((card, index) => (
              <SwiperSlide
                key={index}
                style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
                className="bg-white grid place-item-center rounded-xl"
              >
                <div className="grid place-items-center p-10 py-16 text-center">
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
      </main>
    </>
  );
}

export default App;
