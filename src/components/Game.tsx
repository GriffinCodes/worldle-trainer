import React, {
  ReactText,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  SetStateAction,
} from "react";
import { toast } from "react-toastify";
import {
  getCountryName,
  sanitizeCountryName,
  Country,
} from "../domain/countries";
import { Guess } from "../domain/guess";
import { removeCountry, addCountry } from "../domain/quiz";
import { CountryInput } from "./CountryInput";
import * as geolib from "geolib";
import { Guesses } from "./Guesses";
import { useTranslation } from "react-i18next";
import { SettingsData } from "../hooks/useSettings";
import { ModifierMode } from "../hooks/useMode";
import { Twemoji } from "@teuteuf/react-emoji-render";
import { countries } from "../domain/countries.position";
import { useNewsNotifications } from "../hooks/useNewsNotifications";

const ENABLE_TWITCH_LINK = false;
const MAX_TRY_COUNT = 6;

interface GameProps {
  settingsData: SettingsData;
  updateSettings: (newSettings: Partial<SettingsData>) => void;
  hideImageMode: ModifierMode;
  setHideImageMode: (newHideImageMode: SetStateAction<ModifierMode>) => void;
  rotationMode: ModifierMode;
  setRotationMode: (newRotationMode: SetStateAction<ModifierMode>) => void;
  autoContinue: boolean;
  countrys: {
    country: Country;
    guesses: Guess[];
    randomAngle: number;
    imageScale: number;
  };
  addGuess: (guess: Guess) => void;
  newCountry: () => void;
}

export function Game({
  settingsData,
  updateSettings,
  hideImageMode,
  setHideImageMode,
  rotationMode,
  setRotationMode,
  autoContinue,
  countrys,
  addGuess,
  newCountry,
}: GameProps) {
  const { t, i18n } = useTranslation();

  const countryInputRef = useRef<HTMLInputElement>(null);

  const { country, guesses, randomAngle, imageScale } = countrys;
  const countryName = useMemo(
    () => (country ? getCountryName(i18n.resolvedLanguage, country) : ""),
    [country, i18n.resolvedLanguage]
  );

  const [currentGuess, setCurrentGuess] = useState("");

  const gameEnded = guesses[guesses.length - 1]?.distance === 0;

  const handleSubmit = useCallback(
    (currentGuess) => {
      if (country == null) {
        return;
      }
      const guessedCountry = countries.find(
        (country) =>
          sanitizeCountryName(
            getCountryName(i18n.resolvedLanguage, country)
          ) === sanitizeCountryName(currentGuess)
      );

      if (guessedCountry == null) {
        toast.error(t("unknownCountry"));
        return;
      }

      const newGuess = {
        name: currentGuess,
        distance: geolib.getDistance(guessedCountry, country),
        direction: geolib.getCompassDirection(
          guessedCountry,
          country,
          (origin, dest) =>
            Math.round(geolib.getRhumbLineBearing(origin, dest) / 45) * 45
        ),
      };

      addGuess(newGuess);
      setCurrentGuess("");

      // If it's the winning guess
      if (newGuess.distance == 0) {
        setRotationMode((prev) => ({
          enabled: prev.enabled,
          tempDisabled: false,
        }));
        setHideImageMode((prev) => ({
          enabled: prev.enabled,
          tempDisabled: false,
        }));

        if (countrys.guesses.length == 0) {
          const finished = removeCountry(country.code);
          if (finished) {
            toast.success("Quiz Complete!");
          }
        } else {
          addCountry(country.code);
        }

        if (autoContinue) {
          newCountry();
        }
      }
    },
    [
      addGuess,
      country,
      countrys,
      i18n.resolvedLanguage,
      t,
      setRotationMode,
      setHideImageMode,
      autoContinue,
      newCountry,
    ]
  );

  function handleGiveUp() {
    const correctGuess = {
      name: country.name,
      distance: geolib.getDistance(country, country),
      direction: geolib.getCompassDirection(
        country,
        country,
        (origin, dest) =>
          Math.round(geolib.getRhumbLineBearing(origin, dest) / 45) * 45
      ),
    };

    addGuess(correctGuess);
    setCurrentGuess("");
  }

  return (
    <div className="flex-grow flex flex-col mx-2">
      {hideImageMode.enabled && !hideImageMode.tempDisabled && !gameEnded && (
        <button
          className="font-bold border-2 p-1 rounded uppercase my-2 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700"
          type="button"
          onClick={() =>
            setHideImageMode((prev) => ({
              enabled: prev.enabled,
              tempDisabled: true,
            }))
          }
        >
          <Twemoji
            text={t("showCountry")}
            options={{ className: "inline-block" }}
          />
        </button>
      )}
      <div className="flex my-1">
        <img
          className={`pointer-events-none max-h-52 m-auto transition-transform duration-700 ease-in dark:invert ${
            hideImageMode.enabled && !hideImageMode.tempDisabled && !gameEnded
              ? "h-0"
              : "h-full"
          }`}
          alt="country to guess"
          src={`images/countries/${country?.code.toLowerCase()}/vector.svg`}
          style={
            rotationMode.enabled && !rotationMode.tempDisabled && !gameEnded
              ? {
                  transform: `rotate(${randomAngle}deg) scale(${imageScale})`,
                }
              : {}
          }
        />
      </div>
      {rotationMode.enabled &&
        !rotationMode.tempDisabled &&
        (!hideImageMode.enabled ||
          (hideImageMode.enabled && hideImageMode.tempDisabled)) &&
        !gameEnded && (
          <button
            className="font-bold rounded p-1 border-2 uppercase mb-2 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700"
            type="button"
            onClick={() =>
              setRotationMode((prev) => ({
                enabled: prev.enabled,
                tempDisabled: true,
              }))
            }
          >
            <Twemoji
              text={t("cancelRotation")}
              options={{ className: "inline-block" }}
            />
          </button>
        )}
      <Guesses
        targetCountry={country}
        rowCount={guesses.length}
        guesses={guesses}
        settingsData={settingsData}
        countryInputRef={countryInputRef}
      />
      <div className="my-2">
        {gameEnded && country ? (
          <>
            <button
              className="rounded font-bold border-2 p-1 uppercase bg-green-600 hover:bg-green-500 active:bg-green-700 text-white w-full"
              onClick={newCountry}
              autoFocus
            >
              Next
            </button>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                className="underline text-center block mt-4 whitespace-nowrap"
                href={`https://www.google.com/maps?q=${countryName}+${country.code.toUpperCase()}&hl=${
                  i18n.resolvedLanguage
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twemoji
                  text={t("showOnGoogleMaps")}
                  options={{ className: "inline-block" }}
                />
              </a>
              <a
                className="underline text-center block mt-4 whitespace-nowrap"
                href={`https://${i18n.resolvedLanguage}.wikipedia.org/wiki/${countryName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twemoji
                  text={t("showOnWikipedia")}
                  options={{ className: "inline-block" }}
                />
              </a>
            </div>
            {ENABLE_TWITCH_LINK && (
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  className="underline text-center block mt-4 whitespace-nowrap"
                  href="https://www.twitch.tv/t3uteuf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twemoji
                    text="More? Play on Twitch! 👾"
                    options={{ className: "inline-block" }}
                  />
                </a>
              </div>
            )}
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                className="underline text-center block mt-4 whitespace-nowrap"
                href="https://emovi.teuteuf.fr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twemoji
                  text={
                    dayString === "2022-07-17"
                      ? "Let's celebrate #WorldEmojiDay! Play Emovi! 🎥"
                      : "Try my new game, play Emovi! 🎥"
                  }
                  options={{ className: "inline-block" }}
                />
              </a>
            </div>
          </>
        ) : (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(currentGuess);
              }}
            >
              <div className="flex flex-col">
                <CountryInput
                  inputRef={countryInputRef}
                  currentGuess={currentGuess}
                  setCurrentGuess={setCurrentGuess}
                  handleSubmit={handleSubmit}
                />
                <button
                  className="rounded font-bold p-1 flex items-center justify-center border-2 uppercase my-0.5 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700"
                  type="submit"
                >
                  <Twemoji
                    text="🌍"
                    options={{ className: "inline-block" }}
                    className="flex items-center justify-center"
                  />{" "}
                  <span className="ml-1">{t("guess")}</span>
                </button>
              </div>
            </form>
            <div className="flex flex-col">
              <button
                className="rounded font-bold border-2 p-1 uppercase bg-red-600 hover:bg-red-500 active:bg-red-700 text-white w-full"
                onClick={handleGiveUp}
              >
                Give Up
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
