// Returns a random integer between min (include) and max (include)
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { getRandomInt };
