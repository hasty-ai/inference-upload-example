import React, { useEffect } from 'react';

export const Camera = () => {
  async function getMedia(constraints) {
    let stream = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      /* use the stream */
    } catch (err) {
      /* handle the error */
    }
  }

  useEffect(() => {
    // getMedia({ video: true });
  }, []);

  return null;
};
