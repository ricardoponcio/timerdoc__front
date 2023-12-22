import { Box, Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useFilesize } from 'services/ObjectsUtils';
import './UploadContainer.sass';

export const Upload = ({ onUpload }: { onUpload: (file: File[]) => void }) => {
  const { t } = useTranslation();
  const [invalid, setInvalid] = useState(false);
  const maxSize = 1048576 * 5; // 1 MB * 5
  const renderDragMessage = (isDragActive: boolean, isDragReject: boolean, files: File[]) => {
    if (isDragReject) return t('error.filesInvalid');
    if (!isDragActive) return t('orthers.dragAndDrop');
    if (files.length > 0 && files.some((f) => f.size > maxSize)) {
      setInvalid(true);
      return t('storage.maxFileSize', { maxSize: useFilesize(maxSize) });
    }
    setInvalid(false);
    return t('orthers.dropFiles');
  };

  return (
    <Dropzone
      accept={{
        'image/*': [],
        'text/csv': ['.csv', '.txt', '.xml'],
        'application/vnd.ms-excel': [
          '.xls',
          '.xlsx',
          '.pdf',
          '.doc',
          '.docx',
          '.zip',
          '.7z',
          '.gz',
        ],
      }}
      maxSize={maxSize}
      onDropAccepted={onUpload}
    >
      {({
        getRootProps,
        getInputProps,
        isDragAccept,
        isDragReject,
        fileRejections,
        acceptedFiles,
      }) => (
        <Box
          className={classNames('dropzone', {
            ['is-drag-accept']: isDragAccept && !invalid,
            ['is-drag-reject']: isDragReject || invalid,
          })}
          {...getRootProps()}
        >
          {/* {console.log(fileRejections)} */}
          <input {...getInputProps()} />

          <Text>
            {renderDragMessage(isDragAccept, isDragReject, [
              ...fileRejections.map((f) => f.file),
              ...acceptedFiles,
            ])}
          </Text>
        </Box>
      )}
    </Dropzone>
  );
};
