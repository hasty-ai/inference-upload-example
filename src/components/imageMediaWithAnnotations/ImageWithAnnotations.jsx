import React, { useCallback, useMemo, useState } from 'react';
import chroma from 'chroma-js';
import { getObjectFitSize } from '../../helpers';
import { Box, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { ColoredSquare } from '../coloredSquare/ColoredSquare';

export const CardMediaWithAnnotations = React.memo(
  ({
    originalImageWidth,
    labels,
    labelClasses,
    showLabelWhiteBox = false,
    ...rest
  }) => {
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [labelScale, setLabelScale] = useState(0);

    const colorsMap = useMemo(() => {
      return labelClasses.reduce((acc, val) => {
        acc[val.id] = `rgba(${chroma(val.color).alpha(0.55).rgba()})`;

        return acc;
      }, {});
    }, [labelClasses]);
    const strokeColorsMap = useMemo(() => {
      return labelClasses.reduce((acc, val) => {
        acc[val.id] = `rgba(${chroma(val.color).alpha(1).rgba()})`;

        return acc;
      }, {});
    }, [labelClasses]);
    const classNamesMap = useMemo(() => {
      return labelClasses.reduce((acc, val) => {
        acc[val.id] = val.name;

        return acc;
      }, {});
    }, [labelClasses]);

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
      <Stack style={{ position: 'relative' }}>
        <img
          alt="label"
          key={rest.imageUrl}
          onLoad={handleLoad}
          {...rest}
          style={{
            objectFit: 'contain',
            maxWidth: '100%',
            background: 'black',
            ...rest.styles,
          }}
        />
        {labels.map((label, i) => {
          const labelContent = (
            <Box key={i}>
              <Tooltip
                sx={{ p: 0 }}
                title={
                  <Paper sx={{ p: 1 }}>
                    <Stack direction="row" alignItems="center">
                      <ColoredSquare color={colorsMap[label.class_id]} />
                      <Typography sx={{ fontWeight: 'bold', ml: 1 }}>
                        {classNamesMap[label.class_id]}
                      </Typography>
                    </Stack>
                    <Stack sx={{ ml: '18px' }}>
                      Confidence: {label.score.toFixed(2)}
                    </Stack>
                  </Paper>
                }
                followCursor
              >
                <Box
                  dangerouslySetInnerHTML={{ __html: label.mask_vector }}
                  className={`class-${label.class_id}`}
                  style={{
                    position: 'absolute',
                    left: label.x * labelScale + offsetX,
                    top: label.y * labelScale + offsetY,
                    transform: `scale(${labelScale})`,
                    width: label.width,
                    height: label.height,
                    transformOrigin: 'top left',
                    outline:
                      showLabelWhiteBox && labelScale
                        ? `${0.8 / labelScale}px solid white`
                        : 'none',
                  }}
                />
              </Tooltip>
              <style>
                {`
                  .class-${label.class_id} > svg {
                    padding: 4px;
                    stroke: ${strokeColorsMap[label.class_id]};
                    fill: ${colorsMap[label.class_id]};
                    stroke-width: 4px;
                  }
                `}
              </style>
            </Box>
          );

          return labelContent;
        })}
      </Stack>
    );
  },
);
