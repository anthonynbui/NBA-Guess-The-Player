import { useState } from "react";
import "../App.css";
import basketballLogo from "../assets/basketballLogo.png";
import questionMark from "../assets/question_mark.png";

function Header() {

  const [showPopup, setShowPopup] = useState(false);

  const popupAbout = () => {
    setShowPopup(!showPopup);
  }

  return (
    <>
      <div className="flex top-full mb-5 justify-center bg-gray-700 w-full">
        <img className="w-20 pt-2 pb-2" src={basketballLogo} alt="Basketball Logo" />
        <h1 className="font-bold font-mono text-4xl pl-5 pt-12 text-white ">Guess The NBA Player</h1>
        <img className="w-8 h-8 ml-10 mt-14 cursor-pointer" src={questionMark} onClick={popupAbout}/>
      
      {/* Popup */}
      {showPopup && (
          <div className="absolute top-22 bg-gray-800 text-white p-4 rounded-lg shadow-lg w-100 text-center">
            <h2 className="font-bold text-lg">About This Game</h2>
            <p className="mt-2">
              Guess the mystery NBA player based on stats! You get 3 guesses and only 3 hints (click a hint to reveal). How well do you know your NBA players?
            
            </p>
            <button 
              className="bg-red-500 hover:bg-red-600 mt-3 px-3 py-1 rounded" 
              onClick={popupAbout}
            >
              Close
            </button>
          </div>
        )}

      </div>
    </>
  );
}

export default Header;
