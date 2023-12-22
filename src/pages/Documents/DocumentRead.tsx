import { Card, CardBody } from '@chakra-ui/react';
import CardDocGeralEdit from 'components/Documents/CardDocGeralEdit';
import CardReleaseDetail from 'components/Documents/CardReleaseDetail';
import CardReleases from 'components/Documents/CardReleases';
import { DocumentContext } from 'components/Documents/DocumentContext';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { DocumentRelease } from 'types/DocumentRelease';
import { DocumentGeneral } from 'types/Documets';
import './DocumentRead.sass';

export function DocumentRead() {
  const id = Number(useParams().id);
  const [release, setRelease] = useState<DocumentRelease | null>(null);
  const queryClient = useQueryClient();
  const keyBaseUrl = `documents/${id}/release`;
  const updatelList = (release: DocumentRelease) => {
    queryClient.invalidateQueries(keyBaseUrl);
  };

  const [document, setDocument] = useState<DocumentGeneral | null>(null);
  return (
    <DocumentContext.Provider value={{ document, setDocument }}>
      <CardDocGeralEdit id={id} />
      <Card
        className="card-margin"
        variant="filled"
      >
        <CardBody
          p="0"
          className="flex-around flex-a-start f-children-100 flex-mobile"
          gap={3}
        >
          <CardReleases
            id={id}
            release={release}
            setRelease={setRelease}
            keyBaseUrl={keyBaseUrl}
          />
          <CardReleaseDetail
            id={id}
            release={release}
            setRelease={setRelease}
            onUpdateSucess={updatelList}
            keyBaseUrl={keyBaseUrl}
          />
        </CardBody>
      </Card>
    </DocumentContext.Provider>
  );
}
