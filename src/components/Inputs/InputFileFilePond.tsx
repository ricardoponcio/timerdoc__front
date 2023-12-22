import { useState } from 'react';

// Import React FilePond
import { ActualFileObject, FilePondFile, ProcessServerChunkTransferOptions, ProgressServerConfigFunction, setOptions } from 'filepond';
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { api } from '../../hooks/useApi';
import { Anexo } from '../../types/Files';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
setOptions({
  forceRevert: false,
  instantUpload: false,
  onaddfile(error, file) {
    
  },
});

// Our app
export default function InputFileFilePond(props: { url: string, files?: Anexo[] }) {
  const [files, setFiles] = useState<FilePondFile[] | any>([]);
  const handleProcessSend = async (
    fieldName: string,
    // file: ActualFileObject,
    file: File | ActualFileObject,
    metadata: { [key: string]: any },
    load: (
      p:
        | string
        | {
            [key: string]: any;
          }
    ) => void,
    error: (errorText: string) => void,
    progress: ProgressServerConfigFunction,
    abort: () => void,
    transfer: (transferId: string) => void,
    ts: ProcessServerChunkTransferOptions
  ) => {
    
    if(file.name.endsWith('blob') && file.size === 695){
      error('blob')
      console.error('Tentou enviar blob');
      return
    }

    const formData = new FormData();
    // formData.append("selectedFile", file);
    formData.append(fieldName, file);

    // const response = await
    api.post(props.url,formData,{
      headers: {
        "Accept": "application/json, text/plain, multipart/form-data, */*",
        "Content-Type": "multipart/form-data"
      },
      data: formData,
      onUploadProgress: e => {
        progress(!!e.total, e.loaded, e.total || 0);
      }
    }).then(response=> {
      
      load(`OK`);
    }).catch(re => {
      
      error(re);
    });
  };

  // FilePondInitialFile
  
  return (
    <div className="App">
      <FilePond
        // files={files}
        files={props.files?.map<string>(f => f.referencia)}
        
        // onupdatefiles={setFiles}
        // onaddfile={setFiles}
        allowMultiple={true}
        maxFiles={3}
        server={{
          // process: (a,s,d,f,g,h,j,k,l)=>{},

          process: handleProcessSend,
          fetch: props.files?.map<string>(f => {return f.referencia})[0]
        }}
        onupdatefiles={fileItem => setFiles(fileItem)}
        name="files"
        // sets the file input name, it's filepond by default
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  );
}
