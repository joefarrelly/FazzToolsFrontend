import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import AltTable from 'components/AltTable';
import { cookies } from 'cookies';
import { config } from 'Constants';

const heads = [
  'Name',
  'Realm',
  'Avg',
  'Head',
  'Neck',
  'Shoulder',
  'Back',
  'Chest',
  'Wrist',
  'Hands',
  'Belt',
  'Legs',
  'Feet',
  'Ring 1',
  'Ring 2',
  'Trinket 1',
  'Trinket 2',
  'Weapon 1',
  'Weapon 2',
];

function Gear() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await axios.get(config.url.API_URL + '/api/profile/altequipments/', {
        params: {
          user: cookies.get('userid'),
          page: 'all',
          fields: [
            '.alt_name',
            '.alt_realm',
            '.get_alt_class_display',
            'head',
            'neck',
            'shoulder',
            'back',
            'chest',
            'wrist',
            'hands',
            'belt',
            'legs',
            'feet',
            'ring1',
            'ring2',
            'trinket1',
            'trinket2',
            'weapon1',
            'weapon2',
          ],
        },
      });
      setData(response.data);
    }
    getData();
  }, []);

  return (
    <PageLayout title="Gear">
      <AltTable alts={data} heads={heads} page="gear" />
    </PageLayout>
  );
}

export default Gear;
