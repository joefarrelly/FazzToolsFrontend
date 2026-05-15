import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import MountTable from 'components/MountTable';
import { cookies } from 'cookies';
import { config } from 'Constants';

function Mount() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await axios.get(config.url.API_URL + '/api/profile/usermounts/', {
        params: { user: cookies.get('userid') },
      });
      setData(response.data);
    }
    getData();
  }, []);

  const countData = data.slice(-3);
  return (
    <PageLayout title={`Mount ${countData[0] ?? ''}/${countData[2] ?? ''}`}>
      <MountTable alts={data.slice(0, -3)} />
    </PageLayout>
  );
}

export default Mount;
