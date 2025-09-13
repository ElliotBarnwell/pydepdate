"use client";

import { useEffect, useState } from "react";
import PyPIHistory from "./pypihistory";
import { FaPlus, FaMinus } from 'react-icons/fa';
import Example from "./chart";
import type {ReleaseHistory} from "./pypihistory";

export default function PyPIPage() {
  const [submittedPkgs, setSubmittedPkgs] = useState<string[]>([""]);
  const [packages, setPackages] = useState<string[]>([""]);
  const [count, setCount] = useState(1)
  const [history, setHistory] = useState<ReleaseHistory[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedPkgs(packages.map(str => str.trim()));
  };

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
      <Example data={history} />
      <h1 className="text-2xl font-bold mb-4">PyPI Package History Viewer</h1>
      <form onSubmit={handleSubmit} className="mb-4 items-center space-x-2">
        {packages.map((pkg,ind) => (
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
      </form>
      <button
          type="button"
          onClick={() => handleAdd()}
      >
      <FaPlus/>
      </button>
      <button
          type="button"
          onClick={() => handleRemove()}
      >
      <FaMinus/>
      </button>
      {submittedPkgs.map((pkg,ind) => (<PyPIHistory key={ind} packageName={pkg} />))}
    </main>
  );
}


