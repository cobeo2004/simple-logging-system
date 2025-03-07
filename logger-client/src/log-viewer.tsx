import React, { useState, useEffect, ChangeEvent } from "react";
import { format } from "date-fns";

// Define types for our log data
interface LogEntry {
  id: string;
  timestamp: string;
  level: string;
  source: string;
  message: string;
  data?: Record<string, any>;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface FilterState {
  startDate: string;
  endDate: string;
  level: string;
  source: string;
  search: string;
}

// Log level badge component
const LevelBadge = ({ level }: { level: string }) => {
  const colorMap: Record<string, string> = {
    error: "bg-red-100 text-red-800",
    warn: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
    debug: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colorMap[level] || "bg-gray-100"
      }`}
    >
      {level}
    </span>
  );
};

const LogViewer = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    startDate: format(new Date(Date.now() - 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    level: "",
    source: "",
    search: "",
  });

  // Fetch logs based on current filters and pagination
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await fetch(`http://localhost:4000/logs?${params}`, {
        headers: {
          "x-api-key": "this-is-a-secret-key",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setLogs(data.data);
      setPagination({
        ...pagination,
        total: data.meta.total,
        pages: data.meta.pages,
      });
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sources and levels for filter dropdowns
  const fetchMetadata = async () => {
    try {
      const headers = {
        "x-api-key": "this-is-a-secret-key",
      };

      const sourcesPromise = fetch("http://localhost:4000/logs/sources", {
        headers,
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      });

      const levelsPromise = fetch("http://localhost:4000/logs/levels", {
        headers,
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      });

      const [sourcesData, levelsData] = await Promise.all([
        sourcesPromise,
        levelsPromise,
      ]);

      setSources(sourcesData);
      setLevels(levelsData);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchMetadata();
    fetchLogs();
  }, []);

  // Refetch logs when filters or pagination changes
  useEffect(() => {
    fetchLogs();
  }, [filters, pagination.page, pagination.limit]);

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    // Reset to first page when filters change
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setPagination({
      ...pagination,
      page: newPage,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white">
      <h1 className="text-2xl font-bold mb-6">Log Viewer</h1>

      {/* Filters */}
      <div className="bg-gray-900 p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Date Range
          </label>
          <div className="flex space-x-2">
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="border rounded px-3 py-2 text-sm w-full bg-gray-800 text-white border-gray-700"
            />
            <span className="self-center">to</span>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="border rounded px-3 py-2 text-sm w-full bg-gray-800 text-white border-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Source
          </label>
          <select
            name="source"
            value={filters.source}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2 text-sm w-full bg-gray-800 text-white border-gray-700"
          >
            <option value="">All Sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Level
          </label>
          <select
            name="level"
            value={filters.level}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2 text-sm w-full bg-gray-800 text-white border-gray-700"
          >
            <option value="">All Levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Search
          </label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search in messages..."
            className="border rounded px-3 py-2 text-sm w-full bg-gray-800 text-white border-gray-700"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-gray-900 rounded shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No logs found matching your criteria
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <LevelBadge level={log.level} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {log.source}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        onClick={() => alert(JSON.stringify(log.data, null, 2))}
                        className="text-indigo-400 hover:text-indigo-300"
                        disabled={!log.data}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-300">
              Showing page {pagination.page} of {pagination.pages}(
              {pagination.total} total logs)
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 rounded border border-gray-600 text-sm disabled:opacity-50 bg-gray-800 text-white"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 rounded border border-gray-600 text-sm disabled:opacity-50 bg-gray-800 text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogViewer;
