'use client';

import { useEffect, useState } from 'react';
import { fetchFromBackend } from '../utils/api';

export default function ProtectedPage() {
  const [data, setData] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function getData() {
      try {
        const result = await fetchFromBackend('protected-data');
        setData(result.message);
      } catch (err: any) {
        setError(err.message);
      }
    }
    getData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return <div>Backend says: {data}</div>;
}