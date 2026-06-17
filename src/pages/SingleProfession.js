import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import ProfessionTable from 'components/ProfessionTable';
import { config } from 'Constants';

function capitalize(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : '';
}

function SingleProfession() {
  const [data, setData] = useState([]);
  const { alt, realm, profession } = useParams();

  useEffect(() => {
    if (!alt || !realm || !profession) return;
    async function getData() {
      const response = await axios.get(config.url.API_URL + '/api/profile/altprofessiondatas/', {
        params: { alt, realm, profession },
      });
      setData(response.data);
    }
    getData();
  }, [alt, realm, profession]);

  if (!alt || !realm || !profession) return null;
  const title = `${capitalize(alt)} - ${capitalize(realm)}: ${capitalize(profession)}`;
  return (
    <PageLayout title={title}>
      <ProfessionTable tiers={data} />
    </PageLayout>
  );
}

export default SingleProfession;
