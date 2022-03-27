import {
  computeProximityPercent,
  formatDistance,
  generateSquareCharacters,
  getDirectionEmoji,
} from "../domain/geography";
import { Guess } from "../domain/guess";
import React, { useCallback, useEffect, useState } from "react";
import CountUp from "react-countup";
import { SettingsData } from "../hooks/useSettings";
import { Twemoji } from "@teuteuf/react-emoji-render";

interface GuessRowProps {
  guess?: Guess;
  settingsData: SettingsData;
  countryInputRef?: React.RefObject<HTMLInputElement>;
}

export function GuessRow({
  guess,
  settingsData,
  countryInputRef,
}: GuessRowProps) {
  const { distanceUnit, theme } = settingsData;
  const proximity = guess != null ? computeProximityPercent(guess.distance) : 0;
  const squares = generateSquareCharacters(proximity, theme);

  const handleClickOnEmptyRow = useCallback(() => {
    if (countryInputRef?.current != null) {
      countryInputRef?.current.focus();
    }
  }, [countryInputRef]);

  return (
    <>
      <div className="flex items-center justify-center border-2 h-8 col-span-3 animate-reveal rounded">
        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
          {guess?.name.toUpperCase()}
        </p>
      </div>
      <div className="flex items-center justify-center border-2 h-8 col-span-2 animate-reveal rounded">
        {guess && formatDistance(guess.distance, distanceUnit)}
      </div>
      <div className="flex items-center justify-center border-2 h-8 col-span-1 animate-reveal rounded">
        {guess && <Twemoji text={getDirectionEmoji(guess)} />}
      </div>
      <div className="flex items-center justify-center border-2 h-8 col-span-1 animate-reveal rounded">
        {`${proximity}%`}
      </div>
    </>
  );
}
