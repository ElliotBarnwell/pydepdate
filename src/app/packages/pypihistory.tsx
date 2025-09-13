"use client"; // if you're using Next.js App Router

import { useEffect, useState } from "react";

export type ReleaseHistory = {
  name: string;
  version_str: string;
  version: number | null;
  date: Date;
};

export async function fetchPackageHistory(packageName: string): Promise<ReleaseHistory[]> {
  const res = await fetch(`https://pypi.org/pypi/${packageName}/json`);
  if (!res.ok) throw new Error("Failed to fetch package data");
  const data = await res.json();

  const releases = data.releases as Record<string, any[]>;
  const history: ReleaseHistory[] = [];

  for (const [version, files] of Object.entries(releases)) {
    if (files.length === 0) continue;
    const uploadTime = new Date(files[0].upload_time);
    history.push({ name: packageName, version_str: version, version: Number(version), date: uploadTime });
  }

  // sort by date
  return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

