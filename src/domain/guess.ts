import { Direction } from "./geography";
import { countriesWithImage } from "./countries";

export interface Guess {
  name: string;
  distance: number;
  direction: Direction;
}
