import React from 'react';
import { CheckCircle, AlertCircle, Table } from 'lucide-react';
import { QueryResult, QueryError } from '../types/bigquery';

interface QueryResultsProps {
  result?: QueryResult;
  error?: QueryError;
  isLoading: boolean;
}

export const QueryResults: React.FC<QueryResultsProps> = ({ result, error, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">クエリを実行しています...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
          <h3 className="text-lg font-semibold text-red-800">エラーが発生しました</h3>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error.message}</p>
          {error.code && (
            <p className="text-sm text-red-600 mt-2">エラーコード: {error.code}</p>
          )}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8 text-gray-500">
          <Table className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>プロジェクトIDを入力してクエリを実行してください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">クエリ結果</h3>
        <span className="ml-auto text-sm text-gray-600">
          {result.rows.length} 件のレコード
        </span>
      </div>

      {result.rows.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>データが見つかりませんでした</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {result.schema.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.name}
                    <span className="text-gray-400 ml-1">({column.type})</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {result.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {result.schema.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {row[column.name] !== null && row[column.name] !== undefined
                        ? String(row[column.name])
                        : <span className="text-gray-400 italic">null</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};