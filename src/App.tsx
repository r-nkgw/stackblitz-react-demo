import React, { useState } from 'react'
import { QueryForm } from './components/QueryForm'
import { QueryResults } from './components/QueryResults'
import { executeBigQueryQuery } from './services/bigqueryService'
import type { QueryResult, QueryError } from './types/bigquery'
import { Cloud } from 'lucide-react'
import './App.css'

function App() {
  const [result, setResult] = useState<QueryResult | undefined>(undefined)
  const [error, setError] = useState<QueryError | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const handleQuerySubmit = async (projectId: string) => {
    setIsLoading(true)
    setError(undefined)
    setResult(undefined)

    try {
      const queryResult = await executeBigQueryQuery(projectId)
      setResult(queryResult)
    } catch (err) {
      setError(err as QueryError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Cloud className="w-10 h-10 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">GCP BigQuery クエリツール</h1>
          </div>
          <p className="text-gray-600">
            GCPプロジェクトIDを入力して、mst_companyテーブルのデータを取得します
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <QueryForm onSubmit={handleQuerySubmit} isLoading={isLoading} />
          <QueryResults result={result} error={error} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}

export default App
