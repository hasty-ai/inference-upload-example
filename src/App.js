import { useEffect, useRef, useState } from 'react';
import './App.css';
import { CardMediaWithAnnotations } from './components/imageMediaWithAnnotations/ImageWithAnnotations';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import { theme } from './theme';
import { ReactComponent as Logo } from './img/hog.svg';
import { getImageSize, readAsArrayBuffer, readAsDataURL } from './helpers';
import { API_BASE_URL, HEADERS, MODEL_STATUS, PROJECT_ID } from './constants';
import { LabelClasses } from './components/labelClasses/LabelClasses';
import BottomLeftPattern from './img/bottomLeftPattern.svg';
import Flywheel from './img/flywheel.svg';
import Success from './img/success.svg';
import RightPattern from './img/rightPattern.svg';
import { UploadBox } from './components/uploadBox/UploadBox';

export const App = () => {
  const [labelClasses, setLabelClasses] = useState([]);
  const [modelStatus, setModelStatus] = useState(MODEL_STATUS.UNKNOWN);
  const [modelId, setModelId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageSizes, setImageSizes] = useState({ width: 0, height: 0 });
  const [labels, setLabels] = useState([]);
  const [model, setModel] = useState('instance_segmentor');
  const [imageUploading, setImageUploading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const [imageName, setImageName] = useState('');
  const [uploadId, setUploadId] = useState();
  const [threshold, setThreshold] = useState(50);
  const [confidence, setConfidence] = useState(50);

  const intervalRef = useRef();
  const inputRef = useRef();

  const fetchLabels = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/projects/${PROJECT_ID}/${
          model === 'instance_segmentor'
            ? 'instance_segmentation'
            : 'object_detection'
        }?include_border_mask=true`,
        {
          headers: HEADERS,
          method: 'POST',
          body: JSON.stringify({
            model_id: modelId,
            upload_id: id,
            confidence_threshold: confidence / 100,
            masker_threshold: threshold / 100,
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
    } catch (error) {
      console.error(error);
    }
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
    const url = `${API_BASE_URL}/v1/projects/${PROJECT_ID}/${model}`;

    try {
      const response = await fetch(url, { headers: HEADERS });
      const json = await response.json();

      setModelStatus(json.status || MODEL_STATUS.ERROR);
      setModelId(json.model_id || null);
    } catch (e) {
      setModelStatus('Error');
    }
  };

  const fetchLabelClasses = async () => {
    const url = `${API_BASE_URL}/v1/projects/${PROJECT_ID}/label_classes`;
    const labelClassesResponse = await fetch(url, {
      headers: HEADERS,
      method: 'GET',
      // body: {
      // todo @current
      // },
    });
    const labelClassesJson = await labelClassesResponse.json();

    setLabelClasses(labelClassesJson.items);
  };

  const refetch = () => {
    fetchLabels(uploadId);
  };

  const handleUpload = async (e) => {
    const signedUrlsUrl = `${API_BASE_URL}/v1/projects/${PROJECT_ID}/image_uploads`;

    try {
      setImageUploading(true);
      const signedUrlsResponse = await fetch(signedUrlsUrl, {
        headers: HEADERS,
        method: 'POST',
        body: JSON.stringify({ count: 1 }),
      });
      const urlsJson = await signedUrlsResponse.json();

      if (urlsJson?.items?.[0]) {
        const { id, url } = urlsJson.items[0];
        const data = await readAsArrayBuffer(e[0]);

        await fetch(`http://localhost:8080/${url}`, {
          body: data,
          method: 'PUT',
          headers: {
            'content-type': 'image/*',
          },
        });
        const imageUrl = await readAsDataURL(e[0]);
        const imageSizes = await getImageSize(e[0]);
        setImageName(e[0].name);
        setImageUrl(imageUrl);
        setImageSizes(imageSizes);
        setUploadId(id);
        fetchLabels(id);
        fetchLabelClasses();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setImageUploading(false);
    }
  };

  useEffect(() => {
    if (modelStatus !== MODEL_STATUS.LOADED && !intervalRef.current) {
      handleModelStatusCheck();
      intervalRef.current = setInterval(handleModelStatusCheck, 3000);
    } else if (modelStatus === MODEL_STATUS.LOADED) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(handleModelStatusCheck, 30000);
    }
  }, [modelStatus, handleModelStatusCheck]);

  useEffect(
    () => () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    setModelStatus(MODEL_STATUS.UNKNOWN);
  }, [model]);

  useEffect(() => {
    refetch();
  }, [confidence, threshold]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: 'background.body',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {!showPredictions ? (
          <img
            style={{
              position: 'absolute',
              width: 531,
              left: 0,
              height: 364,
              bottom: 0,
              zIndex: 1,
            }}
            src={BottomLeftPattern}
          />
        ) : null}
        {showPredictions ? (
          <img
            style={{
              position: 'absolute',
              width: 'auto',
              right: 0,
              height: 'calc(100% - 64px)',
              bottom: 0,
              top: 64,
              zIndex: 1,
            }}
            src={RightPattern}
          />
        ) : null}
        <Toolbar sx={{ bgcolor: 'background.body' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            flex={1}
            alignItems="center"
          >
            <Stack direction="row" alignItems="center">
              <Logo width={85 / 2.2} height={105 / 2.2} />
              <Typography variant="h1" ml={2}>
                Hasty Inference Primer
              </Typography>
            </Stack>
            <Box>
              <Typography variant="h5" color="#4482C3">
                PCB Components
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
        <Box position="relative" zIndex={2}>
          <Container spacing={2} sx={{ p: 3 }}>
            {/*<FormControl sx={{ maxWidth: 400 }}>*/}
            {/*<InputLabel id="model-label">Model</InputLabel>*/}
            {/*<Select labelId="model-label" value={model} onChange={handleChange}>*/}
            {/*  <MenuItem value="object_detector">Object Detection</MenuItem>*/}
            {/*  <MenuItem value="instance_segmentor">*/}
            {/*    Instance Segmentation*/}
            {/*  </MenuItem>*/}
            {/*</Select>*/}
            {/*</FormControl>*/}
            <Stack direction="row" alignItems="center">
              <Typography color="text.secondary">
                Model status:&nbsp;
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ textTransform: 'lowercase' }}
              >
                {modelStatus}
              </Typography>
              {modelStatus === MODEL_STATUS.CHECKING && (
                <CircularProgress size="1em" sx={{ ml: 1 }} />
              )}
            </Stack>
            {!showPredictions ? (
              <Grid container>
                <Grid item xs={6} alignItems="flex-end">
                  <Typography variant="h5" color="#4482C3" sx={{ mb: 3 }}>
                    Upload your image
                  </Typography>
                  <UploadBox
                    onDrop={handleUpload}
                    disabled={modelStatus !== MODEL_STATUS.LOADED}
                    inProgress={imageUploading}
                  />
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      visibility={
                        !imageUrl && !imageSizes.width ? 'hidden' : 'visible'
                      }
                    >
                      <img
                        src={Success}
                        alt="success icon"
                        style={{ height: 16, width: 16, marginRight: 5 }}
                      />
                      File uploaded successfully
                    </Stack>
                    <Button
                      sx={{ mt: 2, backgroundColor: '#2666A8' }}
                      variant="outlined"
                      disabled={!imageUrl && !imageSizes.width}
                      onClick={() => setShowPredictions(true)}
                    >
                      See predictions
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={6} textAlign="center">
                  <img src={Flywheel} alt="flywheel" height="100%" />
                </Grid>
              </Grid>
            ) : null}
            {showPredictions ? (
              <Grid container>
                <Grid item xs={8}>
                  <CardMediaWithAnnotations
                    style={{ maxWidth: '100%' }}
                    originalImageWidth={imageSizes.width}
                    labels={labels}
                    labelClasses={labelClasses}
                    src={imageUrl}
                  />
                </Grid>
                <Grid item xs={4} sx={{ bgcolor: 'background.default', p: 2 }}>
                  <Stack direction="column" height="100%">
                    <Typography color="text.secondary">
                      Image: {imageName}
                    </Typography>
                    {labels.length ? (
                      <Typography color="text.secondary">
                        {labels.length} predicted{' '}
                        {labels.length === 1 ? 'label' : 'labels'}
                      </Typography>
                    ) : (
                      <Typography
                        color="text.primary"
                        sx={{ fontWeight: 'bold' }}
                      >
                        No predicted labels
                      </Typography>
                    )}
                    {labelClasses.length ? (
                      <LabelClasses
                        setConfidence={setConfidence}
                        setThreshold={setThreshold}
                        threshold={threshold}
                        confidence={confidence}
                        labelClasses={labelClasses}
                        labels={labels}
                      />
                    ) : null}
                  </Stack>
                </Grid>
                <Button
                  sx={{ mt: 2, backgroundColor: '#2666A8' }}
                  variant="outlined"
                  onClick={() => {
                    setShowPredictions(false);
                    setLabels([]);
                    setImageUrl(null);
                    setImageSizes({ width: 0, height: 0 });
                  }}
                >
                  Upload new image
                </Button>
              </Grid>
            ) : null}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
