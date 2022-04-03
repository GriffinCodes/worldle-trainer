import React from "react";
import { countriesWithImage } from "../domain/countries";

interface CountryListProps {
  displayCountryList: boolean;
}

export function CountryList({ displayCountryList }: CountryListProps) {
  if (displayCountryList) {
    return (
      <div>
        <div className="flex justify-between">
          <button className="rounded font-bold p-1 flex-auto items-center border-2 uppercase my-0.5 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700">
            Select All
          </button>
          <button className="rounded font-bold p-1 flex-auto items-center border-2 uppercase my-0.5 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700">
            Deselect All
          </button>
        </div>
        <div>
          {[...countriesWithImage]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c, index) => (
              <div key={index}>
                <input type="checkbox" />
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
