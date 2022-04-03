import React, { useState } from "react";
import { countriesWithImage } from "../domain/countries";
import { getAllSelectedCountries } from "../domain/quiz";
import { SettingsData } from "../hooks/useSettings";

interface CountryListProps {
  displayCountryList: boolean;
  settingsData: SettingsData;
  updateSettings: (newSettings: Partial<SettingsData>) => void;
}

export function CountryList({
  displayCountryList,
  updateSettings,
  settingsData,
}: CountryListProps) {
  const setAllSelectedCountries = (state: boolean) => {
    const newCountryList = getAllSelectedCountries(state);
    updateSettings({
      selectedCountries: newCountryList,
    });
  };

  if (displayCountryList) {
    return (
      <div>
        <div className="flex flex-col">
          <button
            className="rounded p-1 flex items-center justify-center border-2 uppercase my-0.5 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700"
            onClick={() => setAllSelectedCountries(true)}
          >
            Select All
          </button>
        </div>
        <div className="flex flex-col">
          <button
            className="rounded p-1 flex items-center justify-center border-2 uppercase my-0.5 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700"
            onClick={() => setAllSelectedCountries(false)}
          >
            Deselect All
          </button>
        </div>
        <div>
          {[...countriesWithImage]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  checked={settingsData.selectedCountries[c.code]}
                  onChange={(e) => {
                    const newCountryList = {
                      ...settingsData.selectedCountries,
                    };
                    newCountryList[c.code] = e.target.checked;
                    updateSettings({ selectedCountries: newCountryList });
                  }}
                />
                <label className="flex-1 ml-2"> {c.name} </label>
              </div>
            ))}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
