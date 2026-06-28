import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import LoadingSpinner from 'components/LoadingSpinner';
import { config } from 'Constants';

const slots = [
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

function capitalize(str: string): string {
  return str ? str[0].toUpperCase() + str.slice(1) : '';
}

function SingleGear() {
  const [data, setData] = useState<[string, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { alt, realm } = useParams<{ alt: string; realm: string }>();

  useEffect(() => {
    if (!alt || !realm) return;
    async function getData() {
      try {
        const response = await axios.get(config.url.API_URL + '/api/profile/altequipments/', {
          params: {
            page: 'single',
            alt,
            realm,
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [alt, realm]);

  if (!alt || !realm) return null;
  const title = `${capitalize(alt)} - ${capitalize(realm)}: Gear`;
  return (
    <PageLayout title={title}>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && (
        <table className="border-collapse text-sm">
          <thead>
            <tr>
              <th className="bg-zinc-800 text-zinc-300 px-4 py-2 border border-zinc-700 font-semibold">
                Slot
              </th>
              <th className="bg-zinc-800 text-zinc-300 px-4 py-2 border border-zinc-700 font-semibold">
                Item
              </th>
              <th className="bg-zinc-800 text-zinc-300 px-4 py-2 border border-zinc-700 font-semibold">
                ilvl
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-zinc-800/50 transition-colors">
                <td className="bg-zinc-900 px-4 py-2 border border-zinc-700 text-zinc-400 text-sm">
                  {slots[index]}
                </td>
                <td className="bg-zinc-900 px-4 py-2 border border-zinc-700 text-zinc-200 text-sm">
                  {item[0]}
                </td>
                <td className="bg-zinc-900 px-4 py-2 border border-zinc-700 text-zinc-200 text-sm text-center">
                  {item[1]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PageLayout>
  );
}

export default SingleGear;
