import { Icon, useDisclosure } from '@chakra-ui/react';
import ConfirmModal from 'components/Modal/ConfirmModal';
import { useBooleanHoverIcon } from 'hooks/useBooleanHoverIcon';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons';
import { MdCheckCircle, MdDelete, MdDeleteForever } from 'react-icons/md';
import { AnexoItem } from '../AnexoList';

export const IconsUploaded = ({
  file,
  onExcludeFile,
}: {
  file: AnexoItem;
  onExcludeFile: (id: number) => void;
}) => {
  const { t } = useTranslation();
  const disExcludeFile = useDisclosure();
  const { element, ...propsHover } = useBooleanHoverIcon<IconType>({
    true: MdDelete,
    false: MdDeleteForever,
  });
  const handleExludeFile = async () => {
    onExcludeFile(file.id);
  };
  return (
    <>
      <MdCheckCircle
        size={26}
        color="#78e5d5"
      />
      <Icon
        title={t('actions.delete')}
        cursor={'pointer'}
        boxSize={26}
        color="#DC143C"
        as={element}
        onClick={disExcludeFile.onOpen}
        {...propsHover}
      />
      <ConfirmModal
        continue={handleExludeFile}
        disClose={disExcludeFile}
        message={t('common.confirmDocExclude', { fileName: file.name })}
      />
    </>
  );
};
