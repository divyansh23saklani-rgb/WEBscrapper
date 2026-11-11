import React from 'react';
import { Link, CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface LinkResult {
  url: string;
  status_code: number;
  redirected_to: string | null;
}

interface LinkCheckResultsProps {
  data?: {
    results: LinkResult[];
    total_links: number;
    error: string | null;
  };
}

const LinkCheckResults: React.FC<LinkCheckResultsProps> = ({ data }) => {
  const results: LinkResult[] = data?.results ?? [];
  const totalLinks: number = data?.total_links ?? results.length;
  const error: string | null = data?.error ?? null;

  const errorCount = results.filter((r) => r.status_code >= 400).length;
  const redirectCount = results.filter((r) => r.status_code >= 300 && r.status_code < 400).length;
  const successCount = results.filter((r) => r.status_code >= 200 && r.status_code < 300).length;

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300)
      return 'text-green-600 bg-green-50 border-green-200';
    if (statusCode >= 300 && statusCode < 400)
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusIcon = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return <CheckCircle className="h-4 w-4" />;
    if (statusCode >= 300 && statusCode < 400) return <AlertTriangle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const getStatusText = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'Success';
    if (statusCode >= 300 && statusCode < 400) return 'Redirect';
    if (statusCode >= 400 && statusCode < 500) return 'Client Error';
    if (statusCode >= 500) return 'Server Error';
    return 'Unknown';
  };

  if (error) {
    return (
      <div className="p-4 text-red-600 border border-red-200 rounded-lg bg-red-50">
        Error: {error}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-4 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
        No link check results available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Link className="h-5 w-5 text-green-600 mr-2" />
        <h4 className="font-semibold text-gray-800">Link Check Dashboard</h4>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{totalLinks}</div>
          <div className="text-sm text-gray-600">Total Links</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{successCount}</div>
          <div className="text-sm text-gray-600">Successful</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{errorCount}</div>
          <div className="text-sm text-gray-600">Errors</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{redirectCount}</div>
          <div className="text-sm text-gray-600">Redirects</div>
        </div>
      </div>

      {/* Links Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Redirect
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <ExternalLink className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span
                        className="text-sm text-gray-900 truncate max-w-xs"
                        title={r.url}
                      >
                        {r.url}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        r.status_code
                      )}`}
                    >
                      {getStatusIcon(r.status_code)}
                      <span className="ml-1">{getStatusText(r.status_code)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-gray-900">{r.status_code}</span>
                  </td>
                  <td className="px-4 py-3">
                    {r.redirected_to ? (
                      <span
                        className="text-sm text-blue-600 truncate max-w-xs"
                        title={r.redirected_to}
                      >
                        {r.redirected_to}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LinkCheckResults;
