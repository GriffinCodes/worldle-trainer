import React, { useState, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { SettingsData } from "../../hooks/useSettings";
import { translations } from "../../i18n";
import { Panel } from "./Panel";
import { ModifierMode } from "../../hooks/useMode";
import { resetQuiz } from "../../domain/quiz";
import { CountryList } from "../../components/CountryList";
import Twemoji from "./TwemojiUtils";

interface SettingsProps {
  isOpen: boolean;
  close: () => void;
  settingsData: SettingsData;
  updateSettings: (newSettings: Partial<SettingsData>) => void;
  setRotationMode: (newRotationMode: SetStateAction<ModifierMode>) => void;
  setHideImageMode: (newHideImageMode: SetStateAction<ModifierMode>) => void;
  setAutoContinue: (newAutoContinue: SetStateAction<boolean>) => void;
  newCountry: () => void;
}

export function Settings({
  isOpen,
  close,
  settingsData,
  updateSettings,
  setRotationMode,
  setHideImageMode,
  setAutoContinue,
  newCountry,
}: SettingsProps) {
  const { t, i18n } = useTranslation();

  const [displayCountryList, setDisplayCountryList] = useState(false);

  return (
    <Panel title={t("settings.title")} isOpen={isOpen} close={close}>
      <div className="my-4">
        <div className="flex p-1">
          <select
            id="setting-distanceUnit"
            className="h-8 dark:bg-slate-800 w-16 p-1"
            value={settingsData.distanceUnit}
            onChange={(e) =>
              updateSettings({ distanceUnit: e.target.value as "km" | "miles" })
            }
          >
            <option value="km">KM</option>
            <option value="miles">Miles</option>
          </select>
          <label
            className="flex-1 ml-2 flex items-center"
            htmlFor="setting-distanceUnit"
          >
            {t("settings.distanceUnit")}
          </label>
        </div>
        <div className="flex p-1">
          <select
            id="setting-theme"
            className="h-8 dark:bg-slate-800 w-16 p-1"
            value={settingsData.theme}
            onChange={(e) =>
              updateSettings({ theme: e.target.value as "light" | "dark" })
            }
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <label
            className="flex-1 ml-2 flex items-center"
            htmlFor="setting-theme"
          >
            {t("settings.theme")}
          </label>
        </div>
        <div className="flex p-1">
          <select
            id="setting-language"
            className="h-8 dark:bg-slate-800 w-16 p-1"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            {Object.keys(translations).map((language) => (
              <option key={language} value={language}>
                {language.toUpperCase()}
              </option>
            ))}
          </select>
          <label
            className="flex-1 ml-2 flex items-center"
            htmlFor="setting-language"
          >
            {t("settings.language")}
          </label>
        </div>
        <div className="flex p-1">
          <input
            type="checkbox"
            checked={settingsData.autoContinue}
            onChange={(e) => {
              updateSettings({ autoContinue: e.target.checked });
              setAutoContinue(e.target.checked);
            }}
          />
          <label className="flex-1 ml-2" htmlFor="setting-skip">
            Automatically continue to the next country
          </label>
        </div>
      </div>
      <div className="my-4 flex flex-col gap-2">
        <header className="my-2">
          <h3 className="text-lg font-bold">
            {t("settings.difficultyModifiers")}
          </h3>
        </header>
        <div className="flex p-1">
          <input
            type="checkbox"
            id="setting-showScale"
            checked={settingsData.showScale}
            onChange={(e) => updateSettings({ showScale: e.target.checked })}
          />
          <label className="flex-1 ml-2" htmlFor="setting-showScale">
            {t("settings.showScale")}
          </label>
        </div>
        <div className="flex p-1">
          <input
            type="checkbox"
            id="setting-noImage"
            checked={settingsData.noImageMode}
            onChange={(e) => {
              updateSettings({ noImageMode: e.target.checked });
              setHideImageMode({
                enabled: e.target.checked,
                tempDisabled: false,
              });
            }}
          />
          <label className="flex-1 ml-2" htmlFor="setting-noImage">
            {t("settings.noImageMode")}
          </label>
        </div>
        <div className="flex p-1">
          <input
            type="checkbox"
            id="setting-rotationMode"
            checked={settingsData.rotationMode}
            onChange={(e) => {
              updateSettings({ rotationMode: e.target.checked });
              setRotationMode({
                enabled: e.target.checked,
                tempDisabled: false,
              });
            }}
          />
          <label className="flex-1 ml-2" htmlFor="setting-rotationMode">
            {t("settings.rotationMode")}
          </label>
        </div>
      </div>
      <div className="flex flex-col">
        <button
          className="rounded p-1 flex items-center justify-center border-2 uppercase my-0.5 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark-active-bg-slate-700"
          onClick={() => {
            resetQuiz();
            newCountry();
          }}
        >
          <Twemoji text="🔄" className="inline-block" />
          <span className="ml-1"> Reset quiz </span>
        </button>
      </div>
      <div className="my-4">
        <header className="my-2 flex border-2 px-2 rounded">
          <button
            className="flex-auto"
            onClick={() => setDisplayCountryList(!displayCountryList)}
          >
            <div className="flex justify-between">
              <span className="text-xl font-bold flex">
                Select countries in the quiz
              </span>
              <Twemoji
                text={displayCountryList ? "⬆️" : "⬇️"}
                className="text-xl flex items-center"
              />
            </div>
          </button>
        </header>
        <CountryList
          displayCountryList={displayCountryList}
          settingsData={settingsData}
          updateSettings={updateSettings}
        />
      </div>
    </Panel>
  );
}
