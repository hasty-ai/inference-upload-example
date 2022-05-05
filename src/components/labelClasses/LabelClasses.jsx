import React from 'react';
import { ColoredSquare } from '../coloredSquare/ColoredSquare';
import { Box, FormControl, InputLabel, Stack, Typography } from '@mui/material';
import { OutlinedInput } from '@mui/material';

export const LabelClasses = ({
  labelClasses,
  labels,
  setConfidence,
  setThreshold,
  confidence,
  threshold,
}) => {
  const labelsCountMap = labelClasses
    .map(({ id }) => id)
    .reduce((acc, val) => {
      acc[val] = labels.filter(({ class_id }) => class_id === val).length;
      return acc;
    }, {});

  return (
    <Stack sx={{ position: 'relative', height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" my={2}>
        <FormControl sx={{ width: '49%' }}>
          <InputLabel>Confidence</InputLabel>
          <OutlinedInput
            value={confidence}
            onChange={(event) => setConfidence(event.target.value)}
          />
        </FormControl>
        <FormControl sx={{ width: '49%' }}>
          <InputLabel>Masker threshold</InputLabel>
          <OutlinedInput
            value={threshold}
            onChange={(event) => setThreshold(event.target.value)}
          />
        </FormControl>
      </Stack>
      <InputLabel>Object classes</InputLabel>
      <Box
        sx={{
          overflow: 'auto',
          position: 'absolute',
          top: 125,
          bottom: 8,
          right: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        {labelClasses.map((labelClass) => (
          <Stack key={labelClass.id} direction="row" alignItems="center">
            <ColoredSquare color={labelClass.color} />
            <Typography color="primary.contrastText" sx={{ ml: 1 }}>
              {labelClass.name}
            </Typography>
            <Typography color="text.secondary" sx={{ ml: 1 }}>
              ({labelsCountMap[labelClass.id]} label
              {labelsCountMap[labelClass.id] === 1 ? '' : 's'})
            </Typography>
          </Stack>
        ))}
      </Box>
    </Stack>
  );
};
