import React, { useCallback, useState } from 'react';


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


export const CardMediaWithAnnotations = React.memo(
  ({
    originalImageWidth,
    labels,
    labelTooltip,
    showLabelWhiteBox = true,
    ...rest
  }) => {
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [labelScale, setLabelScale] = useState(0);

    const handleLoad = useCallback(
      (e) => {
        const sizes = getObjectFitSize(e.currentTarget);
        console.log('aa', sizes)
        setLabelScale(sizes.width / originalImageWidth);
        setOffsetX(sizes.x);
        setOffsetY(sizes.y);
      },
      [originalImageWidth],
    );

    console.log('cccc', labelScale, offsetX, offsetY)

    return (
      <div style={{ position: 'relative' }}>
        <img
          style={{ objectFit: 'contain', background:'black' }}
          onLoad={handleLoad}
          {...rest}
        />
        {labels.map((label, i) => {
          const { mask, polygon, bbox } = label;
          const isJustBbox = bbox && !mask && !polygon;
          console.log('aaa', label.x, labelScale, offsetX)

          const labelContent = (
            <div
              key={i}
              className="inferred-svg"
              style={{
                position: 'absolute',
                left: label.x * labelScale + offsetX,
                top: label.y * labelScale + offsetY,
                transform: `scale(${labelScale})`,
                width: label.width * labelScale,
                height: label.height * labelScale,
                transformOrigin: 'top left',
                outline:
                  showLabelWhiteBox && labelScale
                    ? `${0.8 / labelScale}px solid white`
                    : 'none',
                background:
                  !showLabelWhiteBox && isJustBbox ? label.color : 'inherit',
                '& svg': {
                  stroke: label.color,
                  fill: label.color,
                },
              }}
              // eslint-disable-next-line react/no-danger
              // dangerouslySetInnerHTML={{
              //   __html: mask || polygon || bbox || '',
              // }}
            />
          );
          if (labelTooltip) {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <React.Fragment key={i}>
                {labelTooltip(labelContent, label, i)}
              </React.Fragment>
            );
          }

          return labelContent;
        })}
      </div>
    );
  },
);
