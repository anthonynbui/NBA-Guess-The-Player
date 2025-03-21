import { useState } from "react";
import "../App.css";
import basketballLogo from "../assets/basketballLogo.png";

function Header() {
  return (
    <>
      <div className="flex top-full mb-5 justify-center bg-gray-700 w-full">
        <img className="w-20 pt-2 pb-2" src={basketballLogo} alt="Basketball Logo" />
        <h1 className="font-bold font-mono text-4xl pl-5 pt-12 text-white">Guess The NBA Player</h1>
      </div>
    </>
  );
}

export default Header;
