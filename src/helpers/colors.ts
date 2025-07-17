export const addOpacity = (hexColor: string, opacity: number): string => {
  let hex = hexColor.startsWith("#") ? hexColor.slice(1) : hexColor;

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (hex.length === 6) {
    console.log("when start = ", hex);
    const r = parseInt(hex.slice(0, 2), 16);
    console.log("after r = ", hex);
    const g = parseInt(hex.slice(2, 4), 16);
    console.log("after g = ", hex);

    const b = parseInt(hex.slice(4, 6), 16);
    console.log("after b = ", hex);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return hexColor;
};
