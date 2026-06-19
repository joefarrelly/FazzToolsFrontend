import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import MountTable from 'components/MountTable';
import LoadingSpinner from 'components/LoadingSpinner';
import { cookies } from 'cookies';
import { config } from 'Constants';

function Mount() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(config.url.API_URL + '/api/profile/usermounts/', {
          params: { user: cookies.get('userid') },
        });
        setData(response.data);
      } catch (err) {
        setError(err.message ?? 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const countData = data.slice(-3);
  return (
    <PageLayout title={`Mount ${countData[0] ?? ''}/${countData[2] ?? ''}`}>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && <MountTable alts={data.slice(0, -3)} />}
    </PageLayout>
  );
}

export default Mount;
