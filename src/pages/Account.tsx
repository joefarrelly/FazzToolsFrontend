import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import LoadingSpinner from 'components/LoadingSpinner';
import AccountAltRow, { type AccountAlt } from 'components/AccountAltRow';
import { cookies } from 'cookies';
import { config } from 'Constants';
import type { MythicPlusEntry } from 'types';

type RawAltRow = [number, string, string, string, number, string, string, string, number];

function parseAlt(row: RawAltRow): AccountAlt {
  return {
    altId: row[0],
    name: row[1],
    realm: row[2],
    realmSlug: row[3],
    level: row[4],
    race: row[5],
    className: row[6],
    faction: row[7],
    ilvl: row[8],
  };
}

function Account() {
  const [alts, setAlts] = useState<AccountAlt[]>([]);
  const [mythicByAlt, setMythicByAlt] = useState<Map<number, number>>(new Map());
  const [professionsByAlt, setProfessionsByAlt] = useState<Map<number, [string, string]>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const user = cookies.get('userid');
        const [altsRes, mythicRes, professionsRes] = await Promise.all([
          axios.get(config.url.API_URL + '/api/profile/alts/', {
            params: {
              user,
              fields: [
                'alt_id',
                'alt_name',
                'alt_realm',
                'alt_realm_slug',
                'alt_level',
                'get_alt_race_display',
                'get_alt_class_display',
                'alt_faction',
                'alt_ilvl',
              ],
            },
          }),
          axios.get(config.url.API_URL + '/api/profile/altmythicplus/', { params: { user } }),
          axios.get(config.url.API_URL + '/api/profile/altprofessions/', {
            params: {
              user,
              fields: ['.alt_id', 'get_profession_1_display', 'get_profession_2_display'],
            },
          }),
        ]);

        setAlts((altsRes.data as RawAltRow[]).map(parseAlt));
        setMythicByAlt(
          new Map((mythicRes.data as MythicPlusEntry[]).map((m) => [m.alt, m.mythic_rating]))
        );
        setProfessionsByAlt(
          new Map(
            (professionsRes.data as [number, string, string][]).map(([altId, p1, p2]) => [
              altId,
              [p1, p2],
            ])
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data.');
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
      {!loading && !error && (
        <div className="max-w-2xl">
          {alts.map((alt) => (
            <AccountAltRow
              key={alt.altId}
              alt={alt}
              mythicRating={mythicByAlt.get(alt.altId) ?? null}
              professions={professionsByAlt.get(alt.altId) ?? null}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default Account;
