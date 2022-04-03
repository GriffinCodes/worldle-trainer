import { countriesWithImage } from "./countries";

export function loadQuiz(): { [country: string]: number } {
  const curQuiz = localStorage.getItem("quiz");
  return curQuiz != null ? JSON.parse(curQuiz) : {};
}

export function resetQuiz(): { [country: string]: number } {
  const rawSettings = localStorage.getItem("settings");
  if (rawSettings != null) {
    const settings = JSON.parse(rawSettings);

    const quiz: { [country: string]: number } = {};
    Object.entries(settings.selectedCountries).forEach((entry) => {
      const [c, val] = entry;
      if (val) {
        quiz[c] = 1;
      }
    });

    localStorage.setItem("quiz", JSON.stringify(quiz));
    return quiz;
  } else {
    localStorage.setItem("quiz", JSON.stringify({}));
    return {};
  }
}

// Return true if the quiz is finished
export function removeCountry(country: string): boolean {
  const quiz = loadQuiz();

  const numLeft = quiz[country];
  if (numLeft <= 1) {
    delete quiz[country];
  } else {
    quiz[country] = numLeft - 1;
  }

  localStorage.setItem("quiz", JSON.stringify(quiz));
  return Object.keys(quiz).length == 0;
}

export function addCountry(country: string) {
  const quiz = loadQuiz();
  quiz[country]++;
  localStorage.setItem("quiz", JSON.stringify(quiz));
}

export function getAllSelectedCountries(state: boolean): {
  [country: string]: boolean;
} {
  const countries: { [country: string]: boolean } = {};
  countriesWithImage.forEach((c) => {
    countries[c.code] = state;
  });

  return countries;
}
