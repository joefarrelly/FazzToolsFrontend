import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import PetTable from 'components/PetTable';
import { cookies } from 'cookies';
import { config } from 'Constants';

function Pet() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await axios.get(config.url.API_URL + '/api/profile/userpets/', {
        params: { user: cookies.get('userid') },
      });
      setData(response.data);
    }
    getData();
  }, []);

  const countData = data.slice(-3);
  return (
    <PageLayout title={`Pet ${countData[0] ?? ''}/${countData[2] ?? ''}`}>
      <PetTable alts={data.slice(0, -3)} />
    </PageLayout>
  );
}

export default Pet;
