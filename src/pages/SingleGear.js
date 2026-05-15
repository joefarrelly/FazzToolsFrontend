import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import { config } from 'Constants';

const slots = [
  'Head', 'Neck', 'Shoulder', 'Back', 'Chest', 'Wrist', 'Hands', 'Belt',
  'Legs', 'Feet', 'Ring 1', 'Ring 2', 'Trinket 1', 'Trinket 2', 'Weapon 1', 'Weapon 2',
];

function SingleGear() {
  const [data, setData] = useState([]);
  const { alt, realm } = useParams();

  useEffect(() => {
    async function getData() {
      const response = await axios.get(config.url.API_URL + '/api/profile/altequipments/', {
        params: {
          page: 'single',
          alt,
          realm,
          fields: ['.altName', '.altRealm', '.get_altClass_display', 'head', 'neck', 'shoulder', 'back', 'chest', 'wrist', 'hands', 'belt', 'legs', 'feet', 'ring1', 'ring2', 'trinket1', 'trinket2', 'weapon1', 'weapon2'],
        },
      });
      setData(response.data);
    }
    getData();
  }, [alt, realm]);

  const title = `${alt[0].toUpperCase()}${alt.slice(1)} - ${realm[0].toUpperCase()}${realm.slice(1)}: Gear`;
  return (
    <PageLayout title={title}>
      <table className="border-collapse text-sm">
        <thead>
          <tr>
            <th className="bg-zinc-800 text-zinc-300 px-4 py-2 border border-zinc-700 font-semibold">Slot</th>
            <th className="bg-zinc-800 text-zinc-300 px-4 py-2 border border-zinc-700 font-semibold">Item</th>
            <th className="bg-zinc-800 text-zinc-300 px-4 py-2 border border-zinc-700 font-semibold">ilvl</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-zinc-800/50 transition-colors">
              <td className="bg-zinc-900 px-4 py-2 border border-zinc-700 text-zinc-400 text-sm">{slots[index]}</td>
              <td className="bg-zinc-900 px-4 py-2 border border-zinc-700 text-zinc-200 text-sm">{item[0]}</td>
              <td className="bg-zinc-900 px-4 py-2 border border-zinc-700 text-zinc-200 text-sm text-center">{item[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageLayout>
  );
}

export default SingleGear;
