import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import KeybindTable from 'components/KeybindTable';
import { cookies } from 'cookies';
import { config } from 'Constants';

function SingleKeybind() {
  const [data, setData] = useState([]);
  const { alt, realm, spec } = useParams();

  useEffect(() => {
    async function getData() {
      const response = await axios.get(config.url.API_URL + '/api/profile/users/', {
        params: { user: cookies.get('userid'), page: 'single', alt, realm, spec },
      });
      setData(response.data);
    }
    getData();
  }, [alt, realm, spec]);

  const title = `${alt[0].toUpperCase()}${alt.slice(1)} - ${realm[0].toUpperCase()}${realm.slice(1)}: ${spec[0].toUpperCase()}${spec.slice(1)}`;
  return (
    <PageLayout title={title}>
      <div className="flex flex-wrap gap-6">
        {data.map((table, index) => (
          <KeybindTable key={index} binds={table} />
        ))}
      </div>
    </PageLayout>
  );
}

export default SingleKeybind;
