import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header.jsx";
import { Autocomplete, TextField } from "@mui/material";
import { getPlayerList } from "./api/utils";
import mystery_player from "./assets/mystery_player.png";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config/auth";
import players from "./data/players_data.json";

function App() {
  const [player, setPlayer] = useState({});
  // const playerCollectionsRef = collection(db, "test-players");
  const [score, setScore] = useState(0);
  const [guesses, setGuesses] = useState(0);
  const [hints, setHints] = useState(3);
  const [APGHint, setAPGHint] = useState(false);
  const [RPGHint, setRPGHint] = useState(false);
  const [SPGHint, setSPGHint] = useState(false);

  const getRandomPlayer = () => {
    const randomIndex = Math.floor(Math.random() * players.length);
    return players[randomIndex];
  };

  useEffect(() => {
    setPlayer(getRandomPlayer());
  }, []);

  useEffect(() => {
    console.log(player);
  }, [player]);

  useEffect(() => {
    document.title = "Guess The NBA Player";
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <div className="h-screen bg-gray-500 text-white flex flex-col items-center">
      <Header />
      <h1 className="text-2xl sm:text-3xl font-bold mb-5">Score: {score}</h1>
      <h1 className="text-2xl sm:text-3xl font-bold mb-5">
        Guesses: {guesses}
      </h1>

      {/* Dynamic Layout Container */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full gap-6">
        {/* Player Image */}
        <img
          className="w-1/2 sm:w-1/3 md:w-1/5 mt-4"
          src={mystery_player}
          alt="Mystery Player"
        />

        {/* Guess Input */}
        <Autocomplete
          className="w-3/4 sm:w-1/2 md:w-1/8"
          disablePortal
          options={getPlayerList()}
          renderInput={(params) => (
            <TextField {...params} label="Guess Player" />
          )}
        />
      </div>

      {/* Hints and Button */}
      <h1 className="text-2xl sm:text-2xl font-bold mt-5">Hints: {hints}</h1>
      <div className="flex flex-row">
        <button className="bg-blue-500 hover:bg-blue-600 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3">
          Team: {player.team}
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3">
          Position: {player.position}
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3">
          PPG: {(player.pts / player.gp).toFixed(1)}
        </button>
      </div>
      <div className="flex flex-row">
        {APGHint ? (
          <button className="bg-blue-500 hover:bg-blue-600 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3">
            APG: {(player.ast / player.gp).toFixed(1)}
          </button>
        ) : (
          <button
            className="bg-gray-700 hover:bg-gray-800 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3 cursor-pointer"
            onClick={() => {
              setAPGHint(true);
            }}
          >
            APG: ?
          </button>
        )}

        {RPGHint ? (
          <button className="bg-blue-500 hover:bg-blue-600 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3">
            RPG: {(player.reb / player.gp).toFixed(1)}
          </button>
        ) : (
          <button
            className="bg-gray-700 hover:bg-gray-800 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3 cursor-pointer"
            onClick={() => {
              setRPGHint(true);
            }}
          >
            RPG: ?
          </button>
        )}
        {
          SPGHint?         <button className="bg-blue-500 hover:bg-blue-600 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3">
          SPG: {(player.stl / player.gp).toFixed(1)}
        </button> :         <button className="bg-gray-700 hover:bg-gray-800 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3 cursor-pointer"
        onClick={() => {setSPGHint(true)}}>
          SPG: ?
        </button>
        }
      </div>
    </div>
  );
}

export default App;
