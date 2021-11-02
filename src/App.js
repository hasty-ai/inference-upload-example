import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { CardMediaWithAnnotations } from "./ImageWithAnnotations";
import {
  AppBar,
  Box,
  Button,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { theme } from "./theme";

import { ReactComponent as Logo } from "./icons/hog.svg";
import { getImageSize, readAsArrayBuffer, readAsDataURL } from "./helpers";

const API_BASE_URL = `http://localhost:8080/https://api.hasty.ai`;
const API_KEY = "";
const PROJECT_ID = "";

function App() {
  const [key, setKey] = useState(API_KEY);
  const [projectId, setProjectId] = useState(PROJECT_ID);

  const [modelStatus, setModelStatus] = useState("Unknown");
  const [modelId, setModelId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageSizes, setImageSizes] = useState({ width: 0, height: 0 });
  const [labels, setLables] = useState([]);

  const headers = {
    "X-Api-Key": key,
    "content-type": "application/json",
  };

  const handleModelStatusCheck = async () => {
    setModelStatus("Checking ...");
    const url = `${API_BASE_URL}/v1/projects/${projectId}/instance_segmentor`;
    try {
      const response = await fetch(url, { headers });
      const json = await response.json();
      setModelStatus(json.status || "Error");
      setModelId(json.model_id || null);
    } catch (e) {
      setModelStatus("Error");
    }
  };

  const handleUpload = async (e) => {
    const signedUrlsUrl = `${API_BASE_URL}/v1/projects/${projectId}/image_uploads`;
    try {
      const signedUrlsResponse = await fetch(signedUrlsUrl, {
        headers,
        method: "POST",
        body: JSON.stringify({ count: 1 }),
      });
      const urlsJson = await signedUrlsResponse.json();
      if (urlsJson?.items?.[0]) {
        const { id, url } = urlsJson.items[0];
        const data = await readAsArrayBuffer(e.target.files[0]);

        await fetch(`http://localhost:8080/${url}`, {
          body: data,
          method: "PUT",
          headers: {
            "content-type": "image/*",
          },
        });
        const imageUrl = await readAsDataURL(e.target.files[0]);
        setImageUrl(imageUrl);
        const imageSizes = await getImageSize(e.target.files[0]);
        setImageSizes(imageSizes);
        const response = await fetch(
          `${API_BASE_URL}/v1/projects/${projectId}/instance_segmentation`,
          {
            headers,
            method: "POST",
            body: JSON.stringify({
              // confidence_threshold: 0.5,
              // max_detections_per_image: 10,
              model_id: modelId,
              upload_id: id,
            }),
          }
        );

        const json = await response.json();
        setLables(
          json.map((inf) => ({
            ...inf,
            x: inf.bbox[0],
            width: inf.bbox[2] - inf.bbox[0],
            y: inf.bbox[1],
            height: inf.bbox[3] - inf.bbox[1],
          }))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, bgcolor: "background.body", minHeight: "100vh" }}>
        <AppBar position="static">
          <Toolbar sx={{ bgcolor: "background.menu" }}>
            <Logo width={85 / 2.2} height={105 / 2.2} />
            <Typography variant="h1" ml={2}>
              Hasty Inference Primer
            </Typography>
          </Toolbar>
        </AppBar>
        <Stack spacing={2} sx={{ p: 3, maxWidth: 1400 }}>
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
            <Typography color="text.secondary" sx={{ width: 200 }}>
              Model status: {modelStatus}
            </Typography>
            <Button
              size="small"
              color="secondary"
              onClick={handleModelStatusCheck}
            >
              Check
            </Button>
          </Stack>
          <input
            style={{ display: "none" }}
            type="file"
            onChange={handleUpload}
            disabled={modelStatus !== "LOADED"}
            id="contained-button-file"
            accept=".jpg,.jpeg,.png"
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              color="primary"
              component="span"
              disabled={modelStatus !== "LOADED"}
            >
              Upload
            </Button>
          </label>
          <br />
          {imageUrl && imageSizes.width && (
            <CardMediaWithAnnotations
              style={{ maxWidth: 500 }}
              originalImageWidth={imageSizes.width}
              labels={labels}
              src={imageUrl}
            />
          )}
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

export default App;
