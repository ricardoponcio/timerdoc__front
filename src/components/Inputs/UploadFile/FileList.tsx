import { Box, CircularProgress, Flex, StackDivider, VStack } from '@chakra-ui/react';
import { api } from 'hooks/useApi';
import moment from 'moment';
import { ReactNode } from 'react';
import { IconBaseProps } from 'react-icons';
import { BsFillFileEarmarkWordFill, BsImage } from 'react-icons/bs';
import { MdArticle, MdError, MdLink } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import { VscFilePdf } from 'react-icons/vsc';
import { AnexoItem } from './AnexoList';
import { IconsUploaded } from './Icons/IconsUploaded';
import './UploadContainer.sass';

export const FileList = (props: {
  files: AnexoItem[];
  urlDownload: string;
  onExcludeFile: (id: number) => void;
}) => {
  const getIconByTypeFile = (extension: string): ReactNode => {
    const propsIcon: IconBaseProps = {
      size: '26',
      color: '#222',
      className: 'icon-type-file',
    };
    const extFile = ['pdf'];
    if (extFile.includes(extension)) return <VscFilePdf {...propsIcon} />;

    const extImage = ['tif', 'tiff', 'bmp', 'jpg', 'jpeg', 'png', 'eps', 'raw'];
    if (extImage.includes(extension)) return <BsImage {...propsIcon} />;

    const extExcel = ['xlsx', 'xlsm', 'xlsb', 'xltx', 'xltm', 'xlt', 'xls'];
    if (extExcel.includes(extension)) return <RiFileExcel2Line {...propsIcon} />;

    const extWord = ['docx', 'docm', 'dotx', 'dotm'];
    if (extWord.includes(extension)) return <BsFillFileEarmarkWordFill {...propsIcon} />;

    return <MdArticle {...propsIcon} />;
  };
  const getExtension = (filename: string): string => {
    return filename.split('.').pop() || '';
  };
  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      className="file-list"
    >
      {props.files.map((file) => (
        <Box
          w={'full'}
          className="file-item"
          key={file.id}
        >
          <Flex>
            {/* Add prevw de imagem?  */}
            {getIconByTypeFile(getExtension(file.name))}
            <div className="file-info">
              <strong>{file.name}</strong>
              <span title={file.size?.toString().concat(' B')}>
                {file.readableSize}
                &nbsp;&middot;
                {moment(file.date).format('L LT')}
              </span>
            </div>
          </Flex>
          <div className="file-actions">
            {!file.uploaded && !file.error && (
              <CircularProgress
                size={6}
                value={file.progress}
                thickness="12px"
                isIndeterminate={file.progress === 100}
              />
            )}
            {file.url && (
              <MdLink
                title="Download"
                className="link_download"
                size={26}
                color="#222"
                onClick={() =>
                  api
                    .get(`${props.urlDownload}/download/${file.id}`, { responseType: 'blob' })
                    .then((response) => {
                      // referencia em obj para download
                      const href = URL.createObjectURL(response.data);
                      const link = document.createElement('a');
                      // atribuicoes para o `a`
                      link.href = href;
                      link.setAttribute('download', file.name);
                      document.body.appendChild(link);
                      link.click();
                      // remocao dos tmp
                      document.body.removeChild(link);
                      URL.revokeObjectURL(href);
                    })
                }
              />
            )}
            {file.uploaded && (
              <IconsUploaded
                file={file}
                onExcludeFile={props.onExcludeFile}
              />
            )}
            {file.error && (
              <MdError
                size={26}
                color="#e57878"
              />
            )}
          </div>
        </Box>
      ))}
    </VStack>
  );
};
