import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import ProfessionTable from 'components/ProfessionTable';
import LoadingSpinner from 'components/LoadingSpinner';
import { config } from 'Constants';

function capitalize(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : '';
}

function SingleProfession() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { alt, realm, profession } = useParams();

  useEffect(() => {
    if (!alt || !realm || !profession) return;
    async function getData() {
      try {
        const response = await axios.get(config.url.API_URL + '/api/profile/altprofessiondatas/', {
          params: { alt, realm, profession },
        });
        setData(response.data);
      } catch (err) {
        setError(err.message ?? 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [alt, realm, profession]);

  if (!alt || !realm || !profession) return null;
  const title = `${capitalize(alt)} - ${capitalize(realm)}: ${capitalize(profession)}`;
  return (
    <PageLayout title={title}>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && <ProfessionTable tiers={data} />}
    </PageLayout>
  );
}

export default SingleProfession;
