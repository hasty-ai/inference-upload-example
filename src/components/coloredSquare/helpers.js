import chroma from 'chroma-js';

const isEnoughContrast = (color1, color2) =>
  chroma.contrast(color1, color2) > 2;

export const getBorderColor = (rectColor, background) => {
  const step = 0.2;
  const defaultColor = 'white';
  let currentColor = rectColor;
  let keepAdjusting;

  do {
    let chromaColor;
    try {
      chromaColor = chroma(currentColor);
    } catch (e) {
      chromaColor = chroma(defaultColor);
    }
    const brighterColor = chromaColor.brighten(step).hex();
    keepAdjusting =
      !isEnoughContrast(background, brighterColor) &&
      currentColor !== brighterColor;
    currentColor = brighterColor;
  } while (keepAdjusting);

  return currentColor;
};
