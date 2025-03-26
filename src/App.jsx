import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header.jsx";
import { Autocomplete, TextField } from "@mui/material";
import { getPlayerList } from "./api/utils";
import mystery_player from "./assets/mystery_player.png";
import green_check from "./assets/green_check.png";
import red_x from "./assets/red_x.png";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config/auth";
import players from "./data/players_data.json";

function App() {
  const [player, setPlayer] = useState({});
  const [score, setScore] = useState(0);
  const [scoreToAdd, setScoreToAdd] = useState(5);
  const [guesses, setGuesses] = useState(3);
  const [hints, setHints] = useState(3);
  const [APGHint, setAPGHint] = useState(false);
  const [RPGHint, setRPGHint] = useState(false);
  const [SPGHint, setSPGHint] = useState(false);
  const [heightHint, setHeightHint] = useState(false);
  const [ageHint, setAgeHint] = useState(false);
  const [yearDraftHint, setYearDraftHint] = useState(false);
  const [incorrectGuess, setIncorrectGuess] = useState(false);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);

  const addScore = () => {
    setScore(score + scoreToAdd);
    setAnimateScore(true);
  };

  const decrementGuess = () => {
    if (guesses > 0) {
      setGuesses(guesses - 1);
    }
  };

  const decrementHints = () => {
    if (hints > 0) {
      setHints(hints - 1);
    }
  };

  const revealHint = (setHint) => () => {
    if (hints > 0) {
      setScoreToAdd(scoreToAdd - 1);
      setHint(true);
      decrementHints();
    }
  };

  const handlePlayerChange = (event, value, reason) => {
    if (reason === "selectOption") {
      console.log(value);

      if (value === player.name) {
        addScore();
        decrementGuess();
        setCorrectGuess(true);
        resetPlayers();
        console.log("Correct guess");
      } else {
        console.log("Incorrect guess");
        setIncorrectGuess(true);
        decrementGuess();
      }
    }

    setTimeout(() => {
      setIncorrectGuess(false);
    }, 400);
  };

  const getRandomPlayer = () => {
    const randomIndex = Math.floor(Math.random() * players.length);
    return players[randomIndex];
  };

  const resetPlayers = () => {
    setReveal(true);

    setTimeout(() => {
      setReveal(false);
      setGuesses(3);
      setHints(3);
      setScoreToAdd(5);
      setCorrectGuess(false);
      setIncorrectGuess(false);
      setAPGHint(false);
      setRPGHint(false);
      setSPGHint(false);
      setHeightHint(false);
      setAgeHint(false);
      setYearDraftHint(false);
      setPlayer(getRandomPlayer());
    }, 5000);
  };

  useEffect(() => {
    setPlayer(getRandomPlayer());
  }, []);

  useEffect(() => {
    console.log(player);
  }, [player]);

  useEffect(() => {
    if (guesses === 0) {
      resetPlayers();
    }
  }, [guesses]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimateScore(false);
    }, 500); // Adjust this delay to match the animation duration

    return () => clearTimeout(timeout);
  }, [animateScore]);

  useEffect(() => {
    document.title = "Guess The NBA Player";
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <div className="h-screen bg-gray-500 text-white flex flex-col items-center">
      <Header />
      <h1
        className={`text-2xl sm:text-3xl font-bold mb-5 ${
          animateScore ? "increase-score-animation" : ""
        }`}
      >
        Score: {score}
      </h1>
      <h1
        className={`text-2xl sm:text-3xl font-bold mb-5 ${
          incorrectGuess ? "shake" : ""
        }`}
      >
        Guesses: {guesses}
      </h1>
      {reveal ? (
        <h1 className="text-2xl sm:text-3xl font-bold player-reveal-animation flex items-center gap-2">
          <img
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
            src={correctGuess ? green_check : red_x}
            alt={correctGuess ? "Correct" : "Incorrect"}
          />
          {player.name}
        </h1>
      ) : (
        ""
      )}
      {/* Dynamic Layout Container */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full gap-6">
        {/* Player Image */}
        <img
          className="w-1/2 sm:w-1/3 md:w-1/5 mt-4"
          src={reveal ? player.image_url : mystery_player}
          alt={reveal ? "Player" : "MysteryPlayer"}
        />

        {/* Guess Input */}
        { reveal ? '': (
        <Autocomplete
          className="w-3/4 sm:w-1/2 md:w-1/8"
          disablePortal
          options={getPlayerList()}
          onChange={handlePlayerChange}
          renderInput={(params) => (
            <TextField {...params} label="Guess Player" />
          )}
        />)}
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
          Points Per Game: {(player.pts / player.gp).toFixed(1)}
        </button>
      </div>
      <div className="flex flex-row">
        {APGHint ? (
          <button className="bg-blue-500 hover:bg-blue-600 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3">
            Assists Per Game: {(player.ast / player.gp).toFixed(1)}
          </button>
        ) : (
          <button
            className="bg-gray-700 hover:bg-gray-800 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3 cursor-pointer"
            onClick={revealHint(setAPGHint)}
          >
            Assists Per Game: ?
          </button>
        )}

        {RPGHint ? (
          <button className="bg-blue-500 hover:bg-blue-600 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3">
            Rebounds Per Game: {(player.reb / player.gp).toFixed(1)}
          </button>
        ) : (
          <button
            className="bg-gray-700 hover:bg-gray-800 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3 cursor-pointer"
            onClick={revealHint(setRPGHint)}
          >
            Rebounds Per Game: ?
          </button>
        )}
        {SPGHint ? (
          <button className="bg-blue-500 hover:bg-blue-600 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3">
            Steals Per Game: {(player.stl / player.gp).toFixed(1)}
          </button>
        ) : (
          <button
            className="bg-gray-700 hover:bg-gray-800 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3 cursor-pointer"
            onClick={revealHint(setSPGHint)}
          >
            Steals Per Game: ?
          </button>
        )}
      </div>
      <div className="flex flex-row">
        {heightHint ? (
          <button className="bg-blue-500 hover:bg-blue-600 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3">
            Height: {player.height}
          </button>
        ) : (
          <button
            className="bg-gray-700 hover:bg-gray-800 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3 cursor-pointer"
            onClick={revealHint(setHeightHint)}
          >
            Height ?
          </button>
        )}

        {ageHint ? (
          <button className="bg-blue-500 hover:bg-blue-600 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3">
            Age: {player.age}
          </button>
        ) : (
          <button
            className="bg-gray-700 hover:bg-gray-800 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3 cursor-pointer"
            onClick={revealHint(setAgeHint)}
          >
            Age ?
          </button>
        )}
        {yearDraftHint ? (
          <button className="bg-blue-500 hover:bg-blue-600 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3">
            Year Drafted: {player.draft_year}
          </button>
        ) : (
          <button
            className="bg-gray-700 hover:bg-gray-800 w-60 h-12 px-2 py-2 rounded-lg shadow-md mt-4 mx-3 cursor-pointer"
            onClick={revealHint(setYearDraftHint)}
          >
            Year Drafted: ?
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
