import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PageLayout from 'components/PageLayout';
import KeybindTable from 'components/KeybindTable';
import LoadingSpinner from 'components/LoadingSpinner';
import { cookies } from 'cookies';
import { config } from 'Constants';
import type { KeybindEntry } from 'types';

function capitalize(str: string): string {
  return str ? str[0].toUpperCase() + str.slice(1) : '';
}

function SingleKeybind() {
  const [data, setData] = useState<KeybindEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { alt, realm, spec } = useParams<{ alt: string; realm: string; spec: string }>();

  useEffect(() => {
    if (!alt || !realm || !spec) return;
    async function getData() {
      try {
        const response = await axios.get(config.url.API_URL + '/api/profile/users/', {
          params: { user: cookies.get('userid'), page: 'single', alt, realm, spec },
        });
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [alt, realm, spec]);

  if (!alt || !realm || !spec) return null;
  const title = `${capitalize(alt)} - ${capitalize(realm)}: ${capitalize(spec)}`;
  return (
    <PageLayout title={title}>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && (
        <div className="flex flex-wrap gap-6">
          {data.map((table, index) => (
            <KeybindTable key={index} binds={table} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default SingleKeybind;
