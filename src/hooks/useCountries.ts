import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { countriesWithImage, Country } from "../domain/countries";
import { Guess } from "../domain/guess";

export function useCountries(): [
  {
    country?: Country;
    guesses: Guess[];
    randomAngle: number;
    imageScale: number;
  },
  (guess: Guess) => void
] {
  // Setup the initial state
  const [countries, setCountries] = useState<{
    country?: Country;
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

    if (newGuess.distance === 0) {
      const { randomAngle, imageScale } = getRandomAngle();
      setCountries((prev) => ({
        country: getCountry(),
        guesses: [],
        randomAngle: randomAngle,
        imageScale: imageScale,
      }));
    } else {
      const newGuesses = [...countries.guesses, newGuess];
      setCountries((prev) => ({
        country: prev.country,
        guesses: newGuesses,
        randomAngle: prev.randomAngle,
        imageScale: prev.imageScale,
      }));
    }
  };

  return [countries, addGuess];
}

function getRandomAngle() {
  const randomAngle = Math.random() * 360;

  const normalizedAngle = 45 - (randomAngle % 90);
  const radianAngle = (normalizedAngle * Math.PI) / 180;
  const imageScale = 1 / (Math.cos(radianAngle) * Math.sqrt(2));
  return { randomAngle: randomAngle, imageScale: imageScale };
}

function getCountry() {
  return countriesWithImage[
    Math.floor(Math.random() * countriesWithImage.length)
  ];
}
