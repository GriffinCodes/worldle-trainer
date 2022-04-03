import { countriesWithImage } from "./countries";

export function loadQuiz(): { [country: string]: number } {
  const curQuiz = localStorage.getItem("quiz");
  return curQuiz != null ? JSON.parse(curQuiz) : {};
}

export function resetQuiz(): { [country: string]: number } {
  const quiz: { [country: string]: number } = {};
  countriesWithImage.forEach((c) => {
    quiz[c.code] = 1;
  });
  //const quiz = { US: 3 };

  localStorage.setItem("quiz", JSON.stringify(quiz));
  return quiz;
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
