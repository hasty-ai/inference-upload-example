import React, { useCallback, useState } from 'react';
import { getObjectFitSize } from './helpers';

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
        setLabelScale(sizes.width / originalImageWidth);
        setOffsetX(sizes.x);
        setOffsetY(sizes.y);
      },
      [originalImageWidth, rest.imageUrl],
    );


    return (
      <div style={{ position: 'relative' }}>
        <img
          key={rest.imageUrl}
          onLoad={handleLoad}
          {...rest}
          style={{objectFit: 'contain', maxWidth: '100%', background:'black', ...rest.styles}}
        />
        {labels.map((label, i) => {
          const labelContent = (
            <div
              key={i}
              className="inferred-svg"
              style={{
                position: 'absolute',
                left: label.x * labelScale + offsetX,
                top: label.y * labelScale + offsetY,
                transform: `scale(${labelScale})`,
                width: label.width,
                height: label.height,
                transformOrigin: 'top left',
                background: 'rgba(100, 100, 100, 0.5)',
                outline:
                  showLabelWhiteBox && labelScale
                    ? `${0.8 / labelScale}px solid white`
                    : 'none',
              }}
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
