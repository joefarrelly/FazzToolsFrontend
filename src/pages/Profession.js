import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import AltTable from 'components/AltTable';
import LoadingSpinner from 'components/LoadingSpinner';
import { cookies } from 'cookies';
import { config } from 'Constants';

const heads = ['Name', 'Realm', 'Profession 1', 'Profession 2'];

function Profession() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(config.url.API_URL + '/api/profile/altprofessions/', {
          params: {
            user: cookies.get('userid'),
            fields: [
              '.alt_name',
              '.alt_realm',
              '.get_alt_class_display',
              'get_profession_1_display',
              'get_profession_2_display',
            ],
          },
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

  return (
    <PageLayout title="Profession">
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && <AltTable alts={data} heads={heads} page="profession" />}
    </PageLayout>
  );
}

export default Profession;
