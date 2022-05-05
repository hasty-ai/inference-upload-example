import React from 'react';
import { useDropzone } from 'react-dropzone';
import Upload from '../../img/upload.svg';
import { CardActionArea, CircularProgress, Typography } from '@mui/material';

const fileSizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const step = 1024;
const formatFileSize = (bytes, decimals = 2) => {
  if (!bytes) return '0 Bytes';

  const power = Math.floor(Math.log(bytes) / Math.log(step));

  return `${parseFloat((bytes / step ** power).toFixed(decimals))} ${
    fileSizes[power]
  }`;
};
const acceptedFileTypes = [
  'image/jpeg',
  'image/jpg',
  'image/jpe',
  'image/png',
  'image/svg',
  'image/bmp',
  'image/webp',
  'image/tiff',
];

export const UploadBox = ({
  onDrop,
  disabled = false,
  inProgress = false,
  maxSize,
  fileTypesText,
  children,
}) => {
  const dropzoneProps = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize,
    disabled,
  });
  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    rejectedFiles,
  } = dropzoneProps;
  const { ref, ...rootProps } = getRootProps();
  const hasRejectedFiles = rejectedFiles?.length > 0;

  return (
    <CardActionArea
      {...rootProps}
      disabled={disabled}
      ref={ref}
      sx={{
        flex: 1,
        border: '1px dashed',
        borderColor: 'text.secondary',
        textAlign: 'center',
        p: 2,
        cursor: 'pointer',
        height: '17em',
      }}
      data-testid="upload-box"
    >
      <input {...getInputProps()} />
      {isDragAccept && <Typography>Release to upload file</Typography>}
      {inProgress && (
        <>
          <CircularProgress size={60} />
          <Typography>Uploading</Typography>
        </>
      )}
      {!isDragAccept && !inProgress && !isDragReject && (
        <img src={Upload} style={{ height: '5em' }} />
      )}
      {hasRejectedFiles && (
        <>
          <Typography gutterBottom>File rejected</Typography>
          <Typography gutterBottom fontWeight="bold">
            Please note:
          </Typography>
        </>
      )}
      {(isDragReject || hasRejectedFiles) && (
        <>
          <Typography gutterBottom>
            Supported file types:{' '}
            {fileTypesText ||
              acceptedFileTypes
                .map((fileType) => fileType.split('/')[1])
                .join(', ')}
            .
          </Typography>
          <Typography gutterBottom>
            Maximum file size is {formatFileSize(maxSize)}.
          </Typography>
          <Typography>Drag-and-drop of folders is not supported.</Typography>
        </>
      )}
      {!isDragAccept && !inProgress && !isDragReject && !hasRejectedFiles && (
        <Typography display="block" mt={2}>
          Drag the image you want to upload here or click to browse files
        </Typography>
      )}
      {children}
    </CardActionArea>
  );
};
