import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import AltTable from 'components/AltTable';
import { cookies } from 'cookies';
import { config } from 'Constants';

const heads = ['Faction', 'Level', 'Race', 'Class', 'Name', 'Realm', 'Account'];

function Account() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await axios.get(config.url.API_URL + '/api/profile/alts/', {
        params: {
          user: cookies.get('userid'),
          fields: ['altFaction', 'altLevel', 'get_altRace_display', 'get_altClass_display', 'altName', 'altRealm', 'altAccountId'],
        },
      });
      setData(response.data);
    }
    getData();
  }, []);

  return (
    <PageLayout title="Account">
      <AltTable alts={data} heads={heads} />
    </PageLayout>
  );
}

export default Account;
