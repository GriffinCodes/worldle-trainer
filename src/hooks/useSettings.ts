import { useCallback, useState } from "react";
import { getAllSelectedCountries } from "../domain/quiz";

export interface SettingsData {
  showScale: boolean;
  noImageMode: boolean;
  rotationMode: boolean;
  distanceUnit: "km" | "miles";
  theme: "light" | "dark";
  autoContinue: boolean;
  selectedCountries: { [country: string]: boolean };
}

const defaultSettingsData: SettingsData = {
  showScale: false,
  noImageMode: false,
  rotationMode: false,
  distanceUnit: "km",
  theme: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",
  autoContinue: false,
  selectedCountries: getAllSelectedCountries(true),
};

function loadSettings(): SettingsData {
  const storedSettings = localStorage.getItem("settings");
  const settingsData = storedSettings != null ? JSON.parse(storedSettings) : {};
  return {
    ...defaultSettingsData,
    ...settingsData,
  };
}

export function useSettings(): [
  SettingsData,
  (newSettings: Partial<SettingsData>) => void
] {
  const [settingsData, setSettingsData] = useState<SettingsData>(
    loadSettings()
  );

  const updateSettingsData = useCallback(
    (newSettings: Partial<SettingsData>) => {
      const updatedSettings = {
        ...settingsData,
        ...newSettings,
      };

      setSettingsData(updatedSettings);
      localStorage.setItem("settings", JSON.stringify(updatedSettings));
    },
    [settingsData]
  );

  return [settingsData, updateSettingsData];
}
