import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import LoadingSpinner from 'components/LoadingSpinner';
import AddonFileUpload from 'components/AddonFileUpload';
import AccountTable, { type AccountAlt, type AddonAltData } from 'components/AccountTable';
import { cookies } from 'cookies';
import { config } from 'Constants';
import type { MythicPlusEntry } from 'types';

type RawAltRow = [number, string, string, string, number, string, string, string, number];

interface RawAddonAltData {
  alt_id: number;
  gold: number | null;
  played_time_total: number | null;
  played_time_level: number | null;
}

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
  const [addonByAlt, setAddonByAlt] = useState<Map<number, AddonAltData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadKey, setUploadKey] = useState(0);

  const getData = useCallback(async () => {
    try {
      const user = cookies.get('userid');
      const [altsRes, mythicRes, professionsRes, addonRes] = await Promise.all([
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
        axios.get(config.url.API_URL + '/api/profile/users/', { params: { user, page: 'addon' } }),
      ]);

      const sortedAlts = (altsRes.data as RawAltRow[])
        .map(parseAlt)
        .sort((a, b) => b.level - a.level || b.ilvl - a.ilvl);
      setAlts(sortedAlts);
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
      setAddonByAlt(
        new Map(
          (addonRes.data as RawAddonAltData[]).map((a) => [
            a.alt_id,
            { gold: a.gold, playedTimeTotal: a.played_time_total },
          ])
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <PageLayout title="Account">
      <div className="mb-4">
        <AddonFileUpload
          inputKey={uploadKey}
          onChange={() => {
            setUploadKey((k) => k + 1);
            getData();
          }}
        />
      </div>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && (
        <AccountTable
          alts={alts}
          mythicByAlt={mythicByAlt}
          professionsByAlt={professionsByAlt}
          addonByAlt={addonByAlt}
        />
      )}
    </PageLayout>
  );
}

export default Account;
