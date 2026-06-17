import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import KeybindTable from 'components/KeybindTable';
import { cookies } from 'cookies';
import { config } from 'Constants';

function capitalize(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : '';
}

function SingleKeybind() {
  const [data, setData] = useState([]);
  const { alt, realm, spec } = useParams();

  useEffect(() => {
    if (!alt || !realm || !spec) return;
    async function getData() {
      const response = await axios.get(config.url.API_URL + '/api/profile/users/', {
        params: { user: cookies.get('userid'), page: 'single', alt, realm, spec },
      });
      setData(response.data);
    }
    getData();
  }, [alt, realm, spec]);

  if (!alt || !realm || !spec) return null;
  const title = `${capitalize(alt)} - ${capitalize(realm)}: ${capitalize(spec)}`;
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
