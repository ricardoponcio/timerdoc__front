import { Box, Button, Text } from '@chakra-ui/react';
import { TiInfo } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
import './NotFound.sass';

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <main id="page-not-found">
      <section>
        <TiInfo />
        <Box className="info-not-found">
          <Text as={'h1'}>OPS! PÁGINA NÃO ENCONTRADA</Text>
          <p>O conteúdo solicitado não foi encontrado</p>
          <Button
            onClick={() => navigate(-1)}
            colorScheme={'gray'}
            variant={'outline'}
          >
            Voltar
          </Button>
        </Box>
      </section>
    </main>
  );
};
