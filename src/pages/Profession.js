import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import AltTable from 'components/AltTable';
import { cookies } from 'cookies';
import { config } from 'Constants';

const heads = ['Name', 'Realm', 'Profession 1', 'Profession 2'];

function Profession() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await axios.get(config.url.API_URL + '/api/profile/altprofessions/', {
        params: {
          user: cookies.get('userid'),
          fields: ['.altName', '.altRealm', '.get_altClass_display', 'get_profession1_display', 'get_profession2_display'],
        },
      });
      setData(response.data);
    }
    getData();
  }, []);

  return (
    <PageLayout title="Profession">
      <AltTable alts={data} heads={heads} page="profession" />
    </PageLayout>
  );
}

export default Profession;
