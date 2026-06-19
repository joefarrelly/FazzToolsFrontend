import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import AltTable from 'components/AltTable';
import KeybindUpload from 'components/KeybindUpload';
import LoadingSpinner from 'components/LoadingSpinner';
import { cookies } from 'cookies';
import { config } from 'Constants';

const heads = ['Name', 'Realm', 'Spec 1', 'Spec 2', 'Spec 3', 'Spec 4'];

function Keybind() {
  const [data, setData] = useState([]);
  const [inputKey, setInputKey] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(config.url.API_URL + '/api/profile/users/', {
          params: { user: cookies.get('userid'), page: 'all' },
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
    <PageLayout title="Keybind">
      <KeybindUpload inputKey={inputKey} onChange={setInputKey} />
      <div className="mt-5">
        {loading && <LoadingSpinner />}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!loading && !error && <AltTable alts={data} heads={heads} page="kb" />}
      </div>
    </PageLayout>
  );
}

export default Keybind;
