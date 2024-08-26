import React from "react";
import background from "../assets/hero-background.webp";

const HeroSection: React.FC = () => {
   return (
      <div
         className="relative w-screen h-[50vh] bg-cover bg-center"
         style={{ backgroundImage: `url(${background})` }}
      >
         <div className="absolute inset-0 bg-black bg-opacity-60"></div>
         <h1 className="relative text-white text-2xl md:text-3xl z-10 p-3.5 font-sans tracking-[.25em]">
            ALGO SIM TRADER
         </h1>
         <div className="relative z-10 flex justify-center items-center h-full">
            <h1 className="mx-2.5 text-white text-4xl md:text-6xl font-bold text-center">
               Gain insights with trading algorithm simulations
            </h1>
         </div>
      </div>
   );
};

export default HeroSection;
