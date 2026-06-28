import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import PetTable from 'components/PetTable';
import LoadingSpinner from 'components/LoadingSpinner';
import { cookies } from 'cookies';
import { config } from 'Constants';
import type { CollectionEntry } from 'types';

function Pet() {
  const [data, setData] = useState<CollectionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(config.url.API_URL + '/api/profile/userpets/', {
          params: { user: cookies.get('userid') },
        });
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const countData = data.slice(-3);
  return (
    <PageLayout title={`Pet ${countData[0]?.[0] ?? ''}/${countData[2]?.[0] ?? ''}`}>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && <PetTable alts={data.slice(0, -3)} />}
    </PageLayout>
  );
}

export default Pet;
