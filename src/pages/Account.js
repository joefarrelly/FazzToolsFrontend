import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import AltTable from 'components/AltTable';
import LoadingSpinner from 'components/LoadingSpinner';
import { cookies } from 'cookies';
import { config } from 'Constants';

const heads = ['Faction', 'Level', 'Race', 'Class', 'Name', 'Realm', 'Account'];

function Account() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(config.url.API_URL + '/api/profile/alts/', {
          params: {
            user: cookies.get('userid'),
            fields: [
              'alt_faction',
              'alt_level',
              'get_alt_race_display',
              'get_alt_class_display',
              'alt_name',
              'alt_realm',
              'alt_account_id',
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
    <PageLayout title="Account">
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && <AltTable alts={data} heads={heads} />}
    </PageLayout>
  );
}

export default Account;
