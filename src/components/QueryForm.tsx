import React, { useState } from 'react';
import { Database, Play, Loader2 } from 'lucide-react';

interface QueryFormProps {
  onSubmit: (projectId: string) => void;
  isLoading: boolean;
}

export const QueryForm: React.FC<QueryFormProps> = ({ onSubmit, isLoading }) => {
  const [projectId, setProjectId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectId.trim()) {
      onSubmit(projectId.trim());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Database className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">BigQuery接続</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
            GCPプロジェクトID
          </label>
          <input
            type="text"
            id="projectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="your-gcp-project-id"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600 mb-1">実行するクエリ:</p>
          <code className="text-sm font-mono text-gray-800">SELECT * FROM mst_company</code>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !projectId.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              クエリ実行中...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              クエリ実行
            </>
          )}
        </button>
      </form>
    </div>
  );
};