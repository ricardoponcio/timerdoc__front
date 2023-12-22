import { Button, Input, InputGroup, InputLeftAddon, InputRightAddon } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { api } from '../../hooks/useApi';
import { Anexo } from '../../types/Files';

export const InputFileV = (props: { url: string; files?: Anexo[] }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInput = useRef(null);
  const submitForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', selectedFile as Blob);

    api
      .post(props.url, formData, {
        headers: {
          Accept: 'application/json, text/plain, multipart/form-data, */*',
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      })
      .then((response) => {
        
      })
      .catch((re) => {
        
      });
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    // handle validations
    setSelectedFile(e.target.files[0]);
  };
  const selectFile = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    //@ts-ignore
    fileInput.current.click();
  };
  return (
    <form>
      <InputGroup>
        <InputLeftAddon children={<Button onClick={selectFile}><FaSearch /></Button>} />
        <FileUploader
          onFileSelect={(file) => setSelectedFile(file)}
          //   onFileSelectError={({ error }) => alert(error)}
        />
        <Input isReadOnly value={selectedFile?.name}/>
        <Input
          borderRadius={0}
          display={'none'}
          type="file"
          ref={fileInput}
          onChange={handleFileInput}
        />
        <InputRightAddon children={<Button onClick={submitForm}>Submit</Button>} />
        {/* <Button onClick={submitForm}>Submit</Button> */}
      </InputGroup>
    </form>
  );
};
export const FileUploader = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  const fileInput = useRef(null);
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    // handle validations
    onFileSelect(e.target.files[0]);
  };

  return (
    // <InputGroup className="file-uploader">
    <Input
      borderRadius={0}
      display={'none'}
      type="file"
      ref={fileInput}
      onChange={handleFileInput}
    />

    //   {/* <button
    //     //   @ts-ignore
    //     onClick={(e) => fileInput.current && fileInput.current.click()}
    //     className="btn btn-primary"
    //   /> */}
  );
};
