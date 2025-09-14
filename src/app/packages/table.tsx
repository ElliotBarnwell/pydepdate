import { useEffect, useState, useCallback } from "react";
import { ReleaseHistory } from "../page";

export default function ReleaseTable({
  releases,
  startDate,
  endDate,
}: {
  releases: { [key: string]: ReleaseHistory[] };
  startDate: Date | null;
  endDate: Date | null;
}) {
  const [filteredReleases, setFilteredReleases] = useState<
    Record<string, ReleaseHistory[]>
  >({});
  const [packages, setPackages] = useState<string[]>(Object.keys(releases));
  const [allDates, setAllDates] = useState<string[]>([]);

  useEffect(() => {
    setPackages(Object.keys(releases));
    setFilteredReleases(filterAllReleasesByDate(releases));
    // get dates for date column
    setAllDates(getAllReleaseDates(releases));
  }, [releases]);

  function isValidDateString(str: string): boolean {
    const date = new Date(str);
    return !isNaN(date.getTime());
  }

//   function getAllReleaseDates(
//     releases: Record<string, ReleaseHistory[]>,
//   ): string[] {
//     const dateSet = new Set<string>();
//     Object.values(releases).forEach((releaseList) => {
//       releaseList.forEach((release) => {
//         if (displayRelease(release)) {
//           dateSet.add(release.date);
//         }
//       });
//     });
//     return Array.from(dateSet).sort(
//       (a, b) => new Date(a).getTime() - new Date(b).getTime(),
//     );
//   }

    const getAllReleaseDates = useCallback((
    releases: Record<string, ReleaseHistory[]>
  ) => {
    const dateSet = new Set<string>();
    Object.values(releases).forEach((releaseList) => {
      releaseList.forEach((release) => {
        if (displayRelease(release)) {
          dateSet.add(release.date);
        }
      });
    });
    return Array.from(dateSet).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );
  }, []);

  const filterAllReleasesByDate = useCallback((releases: Record<string, ReleaseHistory[]>) => {
    const filtered: Record<string, ReleaseHistory[]> = {};
    if (!startDate && !endDate) {
      return releases;
    }
    for (const [pkg, releaseList] of Object.entries(releases)) {
      filtered[pkg] = releaseList.filter((release) => {
        return displayRelease(release);
      });
    }
    return filtered;
}, []);

//   function filterAllReleasesByDate1(
//     releases: Record<string, ReleaseHistory[]>,
//   ): Record<string, ReleaseHistory[]> {
//     const filtered: Record<string, ReleaseHistory[]> = {};
//     for (const [pkg, releaseList] of Object.entries(releases)) {
//       filtered[pkg] = releaseList.filter((release) => {
//         return displayRelease(release);
//       });
//     }
//     return filtered;
//   }

  function displayRelease(release: ReleaseHistory): boolean {
    const releaseDate = new Date(release.date);
    if (startDate && releaseDate < startDate) return false;
    if (endDate && releaseDate > endDate) return false;
    if (!isValidDateString(release.date)) return false;
    return true;
  }

  function generateTableRows() {
    return allDates.map((date) => (
      <tr
        key={date}
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
      >
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {new Date(date).toLocaleDateString("en-GB")}
        </th>
        {packages.map((pkg) => {
          const release = filteredReleases[pkg]?.find((r) => r.date === date);
          return (
            <td key={pkg} className="px-6 py-4">
              {release ? release.version : "-"}
            </td>
          );
        })}
      </tr>
    ));
  }

  return (
    <div className="relative overflow-x-auto px-5">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Release Date (DD/MM/YYYY)
            </th>
            {packages.map((pkg) => (
              <th scope="col" className="px-6 py-3" key={pkg}>
                {pkg}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{generateTableRows()}</tbody>
      </table>
      <div></div>
    </div>
  );
}
