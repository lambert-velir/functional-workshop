import R from "ramda";
import { heroes } from "heroes-db";

// getHeroNamesByGender :: String → [Hero] → [String]
// given a list of heroes and a gender, return the names of all the heroes of that gender
// Hint: R.pathEq, R.pluck
const getHeroNamesByGender = R.curry((gender, heroes) =>
  R.compose(
    R.identity, // <---- **** EDIT HERE ****
  )(heroes),
);

const getFemaleHeroes = getHeroNamesByGender("female");

assert.equals(getFemaleHeroes(heroes), [
  "Catwoman",
  "Batgirl VI",
  "Harley Quinn",
  "Oracle (DC)",
  "Huntress",
]);

// getGenderMap :: [Hero] → Object
// Given a list of heroes, return a map of the names of the heroes by gender
// (see assert.equals below)
// Hint: R.applySpec
const getGenderMap = R.identity; // <---- **** EDIT HERE ****

assert.equals(getGenderMap(heroes), {
  female: ["Catwoman", "Batgirl VI", "Harley Quinn", "Oracle (DC)", "Huntress"],
  male: [
    "Superman",
    "Batman",
    "Joker",
    "Two-Face",
    "Penguin",
    "Nightwing",
    "Red Robin",
    "Robin I",
    "Red Hood",
    "Deathstroke",
    "Anti-Monitor",
    "Darkseid",
    "Riddler",
    "Ra's Al Ghul",
    "Killer Croc",
  ],
});
