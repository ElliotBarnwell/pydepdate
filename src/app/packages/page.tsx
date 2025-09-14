"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Example from "./chart";
import { ReleaseHistory } from "./pypihistory";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReleaseTable from "./table";

export default function PyPIPage() {
  const [submittedPkgs, setSubmittedPkgs] = useState<string[]>([""]);
  const [packages, setPackages] = useState<string[]>([""]);
  const [count, setCount] = useState(1);
  const [history, setHistory] = useState<ReleaseHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2020-01-01"),
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2020-01-01"));

  function versionToNumber(version: string) {
    // Example: "1.2.3" => 1.002003
    const number_version = version
      .split(".")
      .map((num) => num.padStart(3, "0"))
      .join("");
    if (!version) return null;
    return Number(number_version);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedPkgs(packages.map((str) => str.trim()));
  };

  useEffect(() => {
    async function fetchHistories() {
      setLoading(true);
      try {
        const results = await Promise.all(
          submittedPkgs.map(async (pkg) => {
            const res = await fetch(`https://pypi.org/pypi/${pkg}/json`);
            const data = await res.json();

            const releases: ReleaseHistory[] = Object.entries(
              data.releases,
            ).map(([version, releases]: [string, any]) => ({
              name: pkg,
              version_str: version,
              version: versionToNumber(version),
              date: releases?.[0]?.upload_time ?? "unknown",
            }));

            console.log("release : ", releases);

            return releases;
          }),
        );
        // Convert array to object { packageName: releases }
        setHistory(results.flat());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistories();
  }, [submittedPkgs]);

  if (loading) return <p>Loading…</p>;

  // Update a package name at index i
  const handleChange = (index: number, value: string) => {
    console.log("Changing package at index", index, "to", value);
    const newPackages = [...packages];
    newPackages[index] = value;
    setPackages(newPackages);
  };

  // Add a form
  const handleAdd = () => {
    setCount(count + 1);
    setPackages([...packages, ""]);
  };

  // Remove the last form
  const handleRemove = () => {
    if (count <= 1) return;
    setCount(count - 1);
    setPackages(packages.slice(0, -1));
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">PyPI Package History Viewer</h1>
      <form onSubmit={handleSubmit} className="mb-4 items-center space-x-2">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        {packages.map((pkg, ind) => (
          <div key={ind} className="flex items-center space-x-2">
            <input
              type="text"
              value={pkg}
              onChange={(e) => handleChange(ind, e.target.value)}
              placeholder={`Package #${ind + 1}`}
              className="border p-2 rounded flex-1"
            />
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Show History
        </button>
        <button type="button" onClick={() => handleAdd()}>
          <FaPlus />
        </button>
        <button type="button" onClick={() => handleRemove()}>
          <FaMinus />
        </button>
      </form>

      <ReleaseTable />
    </main>
  );
}
