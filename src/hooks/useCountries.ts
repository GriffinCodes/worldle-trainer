import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { countriesWithImage, Country } from "../domain/countries";
import { Guess } from "../domain/guess";
import { loadQuiz, resetQuiz, removeCountry } from "../domain/quiz";

export function useCountries(): [
  {
    country: Country;
    guesses: Guess[];
    randomAngle: number;
    imageScale: number;
  },
  (guess: Guess) => void,
  () => void
] {
  // Setup the initial state
  const [countries, setCountries] = useState<{
    country: Country;
    guesses: Guess[];
    randomAngle: number;
    imageScale: number;
  }>(() => {
    const { randomAngle, imageScale } = getRandomAngle();
    return {
      country: getCountry(),
      guesses: [],
      randomAngle: randomAngle,
      imageScale: imageScale,
    };
  });

  const addGuess = (newGuess: Guess) => {
    if (countries == null) {
      return;
    }

    const newGuesses = [...countries.guesses, newGuess];
    setCountries((prev) => ({
      country: prev.country,
      guesses: newGuesses,
      randomAngle: prev.randomAngle,
      imageScale: prev.imageScale,
    }));
  };

  const newCountry = () => {
    const { randomAngle, imageScale } = getRandomAngle();
    setCountries((prev) => ({
      country: getCountry(),
      guesses: [],
      randomAngle: randomAngle,
      imageScale: imageScale,
    }));
  };

  return [countries, addGuess, newCountry];
}

function getRandomAngle() {
  const randomAngle = Math.random() * 360;

  const normalizedAngle = 45 - (randomAngle % 90);
  const radianAngle = (normalizedAngle * Math.PI) / 180;
  const imageScale = 1 / (Math.cos(radianAngle) * Math.sqrt(2));
  return { randomAngle: randomAngle, imageScale: imageScale };
}

function getCountry() {
  let quiz = loadQuiz();
  if (Object.keys(quiz).length == 0) {
    quiz = resetQuiz();
  }

  const remainingCountries = Object.keys(quiz);
  const countryCode =
    remainingCountries[Math.floor(Math.random() * remainingCountries.length)];
  const country = countriesWithImage.find(
    (country) => country.code == countryCode
  );
  return country ? country : countriesWithImage[0];
}
