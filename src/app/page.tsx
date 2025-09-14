"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import ReleaseTable from "./packages/table";

export type ReleaseHistory = {
  version: string;
  date: string;
};

export default function PyPIPage() {
  const [submittedPkgs, setSubmittedPkgs] = useState<string[]>([]);
  const [packages, setPackages] = useState<string[]>([""]);
  const [count, setCount] = useState(1);
  const [history, setHistory] = useState<Record<string, ReleaseHistory[]>>({});
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2000-01-01"),
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [useDatePicker, setUseDatePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedPkgs(packages.map((str) => str.trim()));
  };

  useEffect(() => {
    async function fetchHistories() {
      setLoading(true);
      setError(null);
      try {
        const invalidPkgs: string[] = [];
        const results = await Promise.all(
          submittedPkgs.map(async (pkg) => {
            const res = await fetch(`https://pypi.org/pypi/${pkg}/json`);
            const data = await res.json();
            if (res.status !== 200) {
              invalidPkgs.push(pkg);
              return [pkg, []] as const;
            }
            const releases: ReleaseHistory[] = Object.entries(
              data.releases,
            ).map(([version, releases]: [string, any]) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
              
              version: version,
              date: releases?.[0]?.upload_time ?? "unknown",
            }));

            return [pkg, releases] as const;
          }),
        );
        setHistory(Object.fromEntries(results));
        if (invalidPkgs.length > 0) {
          setError(`Invalid package names: ${invalidPkgs.join(", ")}`);
        }
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
      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">Error!</span> {error}
        </div>
      )}
      <h1 className="text-5xl font-bold mb-4 p-5">
        PyPI Package History Viewer
      </h1>
      <form onSubmit={handleSubmit} className="mb-4 items-center space-x-2">
        <label className="inline-flex items-center cursor-pointer p-5">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={useDatePicker}
            onChange={() => setUseDatePicker((v) => !v)}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Use Date Picker
          </span>
        </label>
        <br />
        {useDatePicker && (
          <div
            id="date-range-picker"
            date-rangepicker="true"
            className="flex items-center p-5"
          >
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none p-5">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </div>
              <input
                id="datepicker-range-start"
                name="start"
                type="date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Select date start"
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                onChange={(e) => {
                  setStartDate(
                    e.target.value ? new Date(e.target.value) : null,
                  );
                }}
              />
            </div>
            <span className="mx-4 text-gray-500">to</span>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none p-5">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </div>
              <input
                id="datepicker-range-end"
                name="end"
                type="date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Select date end"
                value={endDate ? endDate.toISOString().split("T")[0] : ""}
                onChange={(e) => {
                  setEndDate(e.target.value ? new Date(e.target.value) : null);
                }}
              />
            </div>
          </div>
        )}

        {packages.map((pkg, ind) => (
          <div key={ind} className="flex items-center space-x-2 px-5 py-3">
            <input
              type="text"
              value={pkg}
              onChange={(e) => handleChange(ind, e.target.value)}
              placeholder={`Package #${ind + 1}`}
              className="border p-2 rounded w-60"
            />
          </div>
        ))}

        <div className="flex items-center space-x-2 p-5">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Show History
          </button>
          <button type="button" className="p-2" onClick={() => handleAdd()}>
            <FaPlus />
          </button>
          <button type="button" className="p-2" onClick={() => handleRemove()}>
            <FaMinus />
          </button>
        </div>
      </form>

      <ReleaseTable
        releases={history}
        startDate={startDate}
        endDate={endDate}
      />
    </main>
  );
}
//                //value={endDate ? endDate.toISOString().split("T")[0] : ""}
