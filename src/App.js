import './App.css';
import { useEffect, useRef, useState } from 'react';
import { CardMediaWithAnnotations } from './ImageWithAnnotations';
import {
  AppBar,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import { theme } from './theme';
import { ReactComponent as Logo } from './icons/hog.svg';
import { getImageSize, readAsArrayBuffer, readAsDataURL } from './helpers';
import {
  API_BASE_URL,
  API_KEY,
  HEADERS,
  MODEL_STATUS,
  PROJECT_ID,
} from './constants';

export const App = () => {
  const [key, setKey] = useState(API_KEY);
  const [projectId, setProjectId] = useState(PROJECT_ID);
  const [modelStatus, setModelStatus] = useState(MODEL_STATUS.UNKNOWN);
  const [modelId, setModelId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageSizes, setImageSizes] = useState({ width: 0, height: 0 });
  const [labels, setLabels] = useState([]);
  const [model, setModel] = useState('instance_segmentor');

  const intervalRef = useRef();
  const inputRef = useRef();

  const fetchLabels = async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/v1/projects/${projectId}/${
        model === 'instance_segmentor'
          ? 'instance_segmentation'
          : 'object_detection'
      }`,
      {
        headers: HEADERS,
        method: 'POST',
        body: JSON.stringify({
          // confidence_threshold: 0.5,
          // max_detections_per_image: 10,
          model_id: modelId,
          upload_id: id,
        }),
      },
    );

    const json = await response.json();

    setLabels(
      json.map((inf) => ({
        ...inf,
        x: inf.bbox[0],
        width: inf.bbox[2] - inf.bbox[0],
        y: inf.bbox[1],
        height: inf.bbox[3] - inf.bbox[1],
      })),
    );
  };

  const handleChange = (event) => {
    setModel(event.target.value);
    setLabels([]);
    setImageUrl(null);
    setImageSizes({ width: 0, height: 0 });

    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const handleModelStatusCheck = async () => {
    setModelStatus('Checking...');
    const url = `${API_BASE_URL}/v1/projects/${projectId}/${model}`;

    try {
      const response = await fetch(url, { headers: HEADERS });
      const json = await response.json();

      setModelStatus(json.status || MODEL_STATUS.ERROR);
      setModelId(json.model_id || null);
    } catch (e) {
      setModelStatus('Error');
    }
  };

  const handleUpload = async (e) => {
    const signedUrlsUrl = `${API_BASE_URL}/v1/projects/${projectId}/image_uploads`;
    try {
      const signedUrlsResponse = await fetch(signedUrlsUrl, {
        headers: HEADERS,
        method: 'POST',
        body: JSON.stringify({ count: 1 }),
      });
      const urlsJson = await signedUrlsResponse.json();
      if (urlsJson?.items?.[0]) {
        const { id, url } = urlsJson.items[0];
        const data = await readAsArrayBuffer(e.target.files[0]);

        await fetch(`http://localhost:8080/${url}`, {
          body: data,
          method: 'PUT',
          headers: {
            'content-type': 'image/*',
          },
        });
        const imageUrl = await readAsDataURL(e.target.files[0]);
        const imageSizes = await getImageSize(e.target.files[0]);
        setImageUrl(imageUrl);
        setImageSizes(imageSizes);
        fetchLabels(id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (modelStatus !== MODEL_STATUS.LOADED && !intervalRef.current) {
      handleModelStatusCheck();
      intervalRef.current = setInterval(handleModelStatusCheck, 3000);
    } else if (modelStatus === MODEL_STATUS.LOADED) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [modelStatus, handleModelStatusCheck]);

  useEffect(() => {
    setModelStatus('Unknown');
  }, [model]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.body', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar sx={{ bgcolor: 'background.menu' }}>
            <Logo width={85 / 2.2} height={105 / 2.2} />
            <Typography variant="h1" ml={2}>
              Hasty Inference Primer
            </Typography>
          </Toolbar>
        </AppBar>
        <Stack spacing={2} sx={{ p: 3, maxWidth: 1400 }}>
          <FormControl sx={{ maxWidth: 400 }}>
            <InputLabel id="model-label">Model</InputLabel>
            <Select labelId="model-label" value={model} onChange={handleChange}>
              <MenuItem value="object_detector">Object Detection</MenuItem>
              <MenuItem value="instance_segmentor">
                Instance Segmentation
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="API Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            size={110}
          />
          <TextField
            fullWidth
            label="Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            size={110}
          />
          <Stack direction="row" alignItems="center">
            <Typography color="text.secondary">Model status:&nbsp;</Typography>
            <Typography
              color="text.secondary"
              sx={{ textTransform: 'lowercase' }}
            >
              {modelStatus}
            </Typography>
          </Stack>
          <input
            ref={inputRef}
            style={{ display: 'none' }}
            type="file"
            onChange={handleUpload}
            disabled={modelStatus !== 'LOADED'}
            id="contained-button-file"
            accept=".jpg,.jpeg,.png"
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              color="primary"
              component="span"
              disabled={modelStatus !== 'LOADED'}
            >
              Upload
            </Button>
          </label>
          <br />
          {imageUrl && imageSizes.width && (
            <CardMediaWithAnnotations
              style={{ maxWidth: '100%' }}
              originalImageWidth={imageSizes.width}
              labels={labels}
              src={imageUrl}
            />
          )}
        </Stack>
      </Box>
    </ThemeProvider>
  );
};
