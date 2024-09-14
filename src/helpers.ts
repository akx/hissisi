export function getRandomDigit() {
  return Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
}
