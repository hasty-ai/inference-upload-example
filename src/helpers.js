export function getImageSize(image) {
  return new Promise((resolve, reject) => {
    try {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        const img = new Image();

        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };

        img.src = fileReader.result;
      };

      fileReader.readAsDataURL(image);
    } catch (e) {
      reject(e);
    }
  });
}
export function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = function () {
      resolve(fr.result);
    };
    fr.readAsArrayBuffer(file);
  });
}

export function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = function () {
      resolve(fr.result);
    };
    fr.readAsDataURL(file);
  });
}

export function getObjectFitSize(img, contains = true) {
  const naturalRatio = img.naturalWidth / img.naturalHeight;
  const renderedRatio = img.width / img.height;
  let targetWidth = 0;
  let targetHeight = 0;
  const isHorizontal = contains
    ? naturalRatio > renderedRatio
    : naturalRatio < renderedRatio;

  if (isHorizontal) {
    targetWidth = img.width;
    targetHeight = targetWidth / naturalRatio;
  } else {
    targetHeight = img.height;
    targetWidth = targetHeight * naturalRatio;
  }

  return {
    width: targetWidth,
    height: targetHeight,
    x: (img.width - targetWidth) / 2,
    y: (img.height - targetHeight) / 2,
  };
}
