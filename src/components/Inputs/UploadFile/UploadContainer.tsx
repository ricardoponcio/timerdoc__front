import { Flex } from '@chakra-ui/react';
import { uniqueId } from 'lodash';
import React from 'react';
import { useFilesize } from 'services/ObjectsUtils';
import { api } from '../../../hooks/useApi';
import { Anexo } from '../../../types/Files';
import { AnexoItem } from './AnexoList';
import { FileList } from './FileList';
import { Upload } from './Upload';
import './UploadContainer.sass';

type MyProps = {
  urlBaseRequest: string;
  prevList?: Anexo[];
};
type MyState = {
  filesList: AnexoItem[];
};
export class UploadContainer extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);
    //this.componentDidMount()
  }
  state: MyState = { filesList: [] };

  processUpload = (itemFile: AnexoItem) => {
    if (!itemFile.file) return;
    const formData = new FormData();
    formData.append('file', itemFile.file);
    api
      .post<Anexo[]>(`${this.props.urlBaseRequest}/upload`, formData, {
        onUploadProgress: (e) => {
          const progress = Math.round((e.loaded / (e.total || e.loaded)) * 100);
          this.updateFileData(itemFile.id, { progress });
        },
      })
      .then((response) => {
        this.updateFileData(itemFile.id, {
          url: response.data[0].referencia,
          uploaded: true,
          id: response.data[0].id,
        });
      })
      .catch((erro) => {
        console.error(erro);
        this.updateFileData(itemFile.id, {
          error: true,
        });
      });
  };
  componentDidMount(): void {
    if (!this.props.prevList) return;
    this.setState({
      filesList: this.props.prevList.map((file) => ({
        ...file,
        name: file.nomeArquivo,
        size: file.tamanho,
        readableSize: file.tamanho ? `${useFilesize(Number(file.tamanho))}` : '???',
        progress: 100,
        uploaded: true,
        error: false,
        url: file.referencia,
      })),
    });
  }
  componentWillUnmount(): void {
    //this.state.filesList.forEach(file => URL.revokeObjectURL(file.preview || ''));
  }
  updateFileData = (idFile: number | string, data: Partial<AnexoItem>) => {
    this.setState((state) => ({
      filesList: state.filesList.map((upFile) => {
        return Number(idFile) === Number(upFile.id) ? { ...upFile, ...data } : upFile;
      }),
    }));
  };
  handleUpload = (files: File[]) => {
    const filesToUpload = files.map<AnexoItem>((file) => ({
      file,
      id: -Number(uniqueId()), // ids negativos seraò os gerados no upload, e os positivos serao os retornados pela api
      name: file.name,
      readableSize: `${useFilesize(file.size)}`,
      preview: URL.createObjectURL(file), // caso queira colocar image de preview
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
      date: new Date(),
    }));
    this.setState(
      (state) => ({
        filesList: state.filesList.concat(filesToUpload),
      }),
      // Motivo pelo qual a nao foi usado o arrow fn, pois o callback apos setar o doc na lista funciona melhor
      // no setState em ClassComponets
      () => filesToUpload.forEach(this.processUpload)
    );
  };
  excludeFile = async (idDoc: number) => {
    // /documents/{documentId}/release/{idRelease}/attach-delete/{idDoc}
    await api.delete(`${this.props.urlBaseRequest}/attach-delete/${idDoc}`);
    this.setState({
      filesList: this.state.filesList.filter((f) => f.id != idDoc),
    });
  };
  render(): React.ReactNode {
    return (
      <Flex className="upload-container">
        <Upload onUpload={this.handleUpload} />
        {!!this.state?.filesList?.length && (
          <FileList
            files={this.state?.filesList}
            onExcludeFile={this.excludeFile}
            urlDownload={this.props.urlBaseRequest}
          />
        )}
      </Flex>
    );
  }
}
