import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { CardMediaWithAnnotations } from './ImageWithAnnotations';

const baseUrl = `http://localhost:8080/https://api.hasty.ai`


function getImageSize(image) {
  return new Promise((resolve, reject) => {
    try {
      const fileReader = new FileReader()

      fileReader.onload = () => {
        const img = new Image()

        img.onload = () => {
          resolve({ width: img.width, height: img.height })
        }

        img.src = fileReader.result
      }

      fileReader.readAsDataURL(image)
    } catch (e) {
      reject(e)
    }
  })
}
function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = reject;
      fr.onload = function() {
          resolve(fr.result);
      }
      fr.readAsArrayBuffer(file);
  });
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = reject;
      fr.onload = function() {
          resolve(fr.result);
      }
      fr.readAsDataURL(file);
  });
}


function App() {
  const [key, setKey] = useState('dSf0Qdexh4lBTxt0ENJpFr4Orz8sM1Yea0U0Z2MthIgN7DhLWNQPQ0zr0j3xLEHNtWIzMydPAFsjKKMELzY3hQ');
  const [projectId, setProjectId] = useState('8061497a-2eb9-40c1-971c-b05d07f5a7e7');

  const [modelStatus, setModelStatus] = useState('Unknown');
  const [modelId, setModelId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageSizes, setImageSizes] = useState({width: 0, height: 0});
  const [uploadStatus, setUploadStatus] = useState('Not started');
  const [labels, setLables] = useState([]);

  const headers = {
    'X-Api-Key': key,
    'content-type': 'application/json'
  }


  const handleModelStatusCheck = async () => {
    setModelStatus('Checking ...');
    const url = `${baseUrl}/v1/projects/${projectId}/instance_segmentor`;
    try {
      const response = await fetch(url, {headers});
      const json = await response.json();
      setModelStatus(json.status || 'Error');
      setModelId(json.model_id || null)
    } catch (e) {
      setModelStatus('Error');
    }
  }

  const handleUpload = async (e) => {
    console.log(e);
    const signedUrlsUrl = `${baseUrl}/v1/projects/${projectId}/image_uploads`;
    setUploadStatus('In progress');
    try {
      const signedUrlsResponse = await fetch(signedUrlsUrl, {
        headers,
        method: 'POST',
        body: JSON.stringify({count: 1})
      })
      const urlsJson = await signedUrlsResponse.json();
      if (urlsJson?.items?.[0]) {
        const {id, url} = urlsJson.items[0];
        const data = await readAsArrayBuffer(e.target.files[0]);
        console.log('xx1', data)

        const uploadResponse = await fetch(`http://localhost:8080/${url}`, {
          body: data,
          method: "PUT",
          // credentials: false,
          headers: {
            'content-type': 'image/*',
          }
        });
        const imageUrl = await readAsDataURL(e.target.files[0]);
        setImageUrl(imageUrl);
        const imageSizes = await getImageSize(e.target.files[0]);
        setImageSizes(imageSizes);
        console.log('cc', imageSizes)
        console.log('xx')
        // const uploadJson = await uploadResponse.json();
        // console.log('zzz');
        console.log('asdasd',`${baseUrl}/v1/projects/${projectId}/instance_segmentation`,  JSON.stringify({
          "confidence_threshold": 0.5,
          "max_detections_per_image": 10,
          upload_id: id,
          // filename: e.target.files[0].name,
        }));

        const response = await fetch(`${baseUrl}/v1/projects/${projectId}/instance_segmentation`, {
          headers,
          method: 'POST',
          body: JSON.stringify({
            "confidence_threshold": 0.5,
            "max_detections_per_image": 10,
            model_id: modelId,
            upload_id: id,
            // filename: e.target.files[0].name,
          }),
        });

        const json = await response.json();
        console.log('zz', json.map(
          (
            inf
              ,
          ) => ({
            ...inf,
            x: inf.bbox[0],
            y: inf.bbox[1],
          }),
        ))
        setLables( json.map(
          (
            inf
              ,
          ) => ({
            ...inf,
            x: inf.bbox[0],
            width: inf.bbox[2] - inf.bbox[0],
            y: inf.bbox[1],
            height: inf.bbox[3]  - inf.bbox[1],
          }),
        ));

      }
    } catch (e) {
      setUploadStatus('Error');
    }
  };

  return (
    <div style={{padding: 30}}>
      <h2>Key</h2>
      <input type="text" value={key} onChange={e => setKey(e.target.value)}  size={110}/>
      <h2>Project id</h2>
      <input type="text" value={projectId} onChange={e => setProjectId(e.target.value)}  size={110}/>
      <hr />
      <hr/ >
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{width: 200}}>
        Model status: {modelStatus}
        </div>
        <button onClick={handleModelStatusCheck}>Check</button>
      </div>
      <input type="file" onChange={handleUpload} disabled={modelStatus !== 'LOADED'} />
      <br />
      {imageUrl && imageSizes.width && <CardMediaWithAnnotations style={{maxWidth: 500}} originalImageWidth={imageSizes.width} labels={labels} src={imageUrl} />}
    </div>
  );
}

export default App;
