import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import ProfessionTable from 'components/ProfessionTable';
import { config } from 'Constants';

function SingleProfession() {
  const [data, setData] = useState([]);
  const { alt, realm, profession } = useParams();

  useEffect(() => {
    async function getData() {
      const response = await axios.get(config.url.API_URL + '/api/profile/altprofessiondatas/', {
        params: { alt, realm, profession },
      });
      setData(response.data);
    }
    getData();
  }, [alt, realm, profession]);

  const title = `${alt[0].toUpperCase()}${alt.slice(1)} - ${realm[0].toUpperCase()}${realm.slice(1)}: ${profession[0].toUpperCase()}${profession.slice(1)}`;
  return (
    <PageLayout title={title}>
      <ProfessionTable tiers={data} />
    </PageLayout>
  );
}

export default SingleProfession;
