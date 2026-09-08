// src/hooks/useManifest.ts
import { useState, useEffect } from 'react';

interface Manifest {
  name: string;
  short_name?: string;
  description?: string;
  [key: string]: any;
}

function useManifest(): Manifest {
  const [manifest, setManifest] = useState<Manifest>({
    name: 'React Template',
  });

  useEffect(() => {
    fetch('/manifest.json')
      .then((response) => response.json())
      .then((data) => setManifest(data))
      .catch((error) => console.error('Error loading manifest:', error));
  }, []);

  return manifest;
}

export default useManifest;
