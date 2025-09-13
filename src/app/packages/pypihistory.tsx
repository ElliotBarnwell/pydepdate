"use client"; // if you're using Next.js App Router

import { useEffect, useState } from "react";

export type ReleaseHistory = {
  name: string;
  version: string;
  date: Date;
};

async function fetchPackageHistory(packageName: string): Promise<ReleaseHistory[]> {
  const res = await fetch(`https://pypi.org/pypi/${packageName}/json`);
  if (!res.ok) throw new Error("Failed to fetch package data");
  const data = await res.json();

  const releases = data.releases as Record<string, any[]>;
  const history: ReleaseHistory[] = [];

  for (const [version, files] of Object.entries(releases)) {
    if (files.length === 0) continue;
    const uploadTime = new Date(files[0].upload_time);
    history.push({ name: packageName, version, date: uploadTime });
  }

  // sort by date
  return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export default function PyPIHistory({ packageName}: { packageName: string}) {
  const [history, setHistory] = useState<ReleaseHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackageHistory(packageName)
      .then(setHistory)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [packageName]);

  if (loading) return <p>Loading history for {packageName}...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">Release History for {packageName}</h2>
      <ul className="list-disc ml-5">
        {history.map((release) => (
          <li key={release.version}>
            <span className="font-mono">{release.version}</span> –{" "}
            {new Date(release.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}