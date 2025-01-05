import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Game } from "./components/Game";
import React, { useEffect, useState } from "react";
import { Infos } from "./components/panels/Infos";
import { useTranslation } from "react-i18next";
import { InfosCo } from "./components/panels/InfosCo";
import { InfosPl } from "./components/panels/InfosPl";
import { InfosDe } from "./components/panels/InfosDe";
import { Settings } from "./components/panels/Settings";
import { useSettings } from "./hooks/useSettings";
import { useCountries } from "./hooks/useCountries";
import { Worldle } from "./components/Worldle";
import { InfosJa } from "./components/panels/InfosJa";
import Twemoji from "./components/panels/TwemojiUtils";

const supportLink: Record<string, string> = {
  UA: "https://donate.redcrossredcrescent.org/ua/donate/~my-donation?_cv=1",
};

export default function App() {
  const { t, i18n } = useTranslation();

  const [infoOpen, setInfoOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  const [settingsData, updateSettings] = useSettings();
  const [hideImageMode, setHideImageMode] = useState({
    enabled: settingsData.noImageMode,
    tempDisabled: false,
  });
  const [rotationMode, setRotationMode] = useState({
    enabled: settingsData.rotationMode,
    tempDisabled: false,
  });
  const [autoContinue, setAutoContinue] = useState(settingsData.autoContinue);
  const [countrys, addGuess, newCountry] = useCountries();

  useEffect(() => {
    if (settingsData.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settingsData.theme]);

  let InfosComponent;
  switch (i18n.resolvedLanguage) {
    case "co":
      InfosComponent = InfosCo;
      break;
    case "pl":
      InfosComponent = InfosPl;
      break;
    case "de":
      InfosComponent = InfosDe;
      break;
    case "ja":
      InfosComponent = InfosJa;
      break;
    default:
      InfosComponent = Infos;
  }

  return (
    <>
      <ToastContainer
        hideProgressBar
        position="top-center"
        transition={Flip}
        theme={settingsData.theme}
        autoClose={2000}
        bodyClassName="font-bold text-center"
        toastClassName="flex justify-center m-2 max-w-full"
        style={{ width: 500, maxWidth: "100%" }}
      />
      <Infos isOpen={infoOpen} close={() => setInfoOpen(false)} />
      <Settings
        isOpen={settingsOpen}
        close={() => setSettingsOpen(false)}
        settingsData={settingsData}
        updateSettings={updateSettings}
        setHideImageMode={setHideImageMode}
        setRotationMode={setRotationMode}
        setAutoContinue={setAutoContinue}
        newCountry={newCountry}
      />
      <div className="flex justify-center flex-auto dark:bg-slate-900 dark:text-slate-50">
        <div className="w-full max-w-lg flex flex-col">
          <header className="border-b-2 px-3 border-gray-200 flex">
            <button
              className="mr-3 text-xl"
              type="button"
              onClick={() => setInfoOpen(true)}
            >
              <Twemoji text="❓" />
            </button>
            <h1 className="text-4xl font-bold uppercase tracking-wide text-center my-1 flex-auto">
              Wor<span className="text-green-600">l</span>dle Trainer
            </h1>
            <button
              className="ml-3 text-xl"
              type="button"
              onClick={() => setSettingsOpen(true)}
            >
              <Twemoji text="⚙️" />
            </button>
          </header>
          <Game
            settingsData={settingsData}
            updateSettings={updateSettings}
            hideImageMode={hideImageMode}
            setHideImageMode={setHideImageMode}
            rotationMode={rotationMode}
            setRotationMode={setRotationMode}
            autoContinue={autoContinue}
            countrys={countrys}
            addGuess={addGuess}
            newCountry={newCountry}
          />
          <footer className="flex justify-center items-center mt-8 mb-4">
            <Twemoji
              text="❤️"
              className="flex items-center justify-center mr-1"
            />{" "}
            <Worldle />? -
            <a
              className="underline pl-1"
              href="https://www.ko-fi.com/teuteuf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-max">
                <Twemoji
                  text="Buy @teuteuf a ☕!"
                  className="inline-block"
                />
              </div>
            </a>
          </footer>
        </div>
      </div>
    </>
  );
}
