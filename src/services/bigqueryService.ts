import type { QueryResult, QueryRequest, QueryError } from '../types/bigquery';

// 実際の環境では、バックエンドAPIを通じてBigQueryにアクセスします
// フロントエンドから直接BigQueryにアクセスするのはセキュリティ上推奨されません
export const executeBigQueryQuery = async (
  projectId: string,
  query: string = 'SELECT * FROM mst_company'
): Promise<QueryResult> => {
  try {
    // 実際の実装では、バックエンドAPIエンドポイントを呼び出します
    // 例: const response = await fetch('/api/bigquery', { ... });
    
    // デモ用のモックデータ
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒の遅延をシミュレート
    
    // モックデータを返す（実際の環境では削除してください）
    const mockResult: QueryResult = {
      schema: [
        { name: 'company_id', type: 'STRING' },
        { name: 'company_name', type: 'STRING' },
        { name: 'industry', type: 'STRING' },
        { name: 'founded_year', type: 'INTEGER' },
        { name: 'employee_count', type: 'INTEGER' },
        { name: 'revenue', type: 'FLOAT' },
        { name: 'created_at', type: 'TIMESTAMP' }
      ],
      rows: [
        {
          company_id: 'COMP001',
          company_name: '株式会社テクノロジー',
          industry: 'IT・ソフトウェア',
          founded_year: 2010,
          employee_count: 150,
          revenue: 2500000000,
          created_at: '2024-01-15T09:30:00Z'
        },
        {
          company_id: 'COMP002',
          company_name: '製造業株式会社',
          industry: '製造業',
          founded_year: 1995,
          employee_count: 500,
          revenue: 8000000000,
          created_at: '2024-01-16T10:15:00Z'
        },
        {
          company_id: 'COMP003',
          company_name: 'サービス企業',
          industry: 'サービス業',
          founded_year: 2018,
          employee_count: 75,
          revenue: 1200000000,
          created_at: '2024-01-17T14:20:00Z'
        },
        {
          company_id: 'COMP004',
          company_name: '金融グループ',
          industry: '金融・保険',
          founded_year: 1980,
          employee_count: 1200,
          revenue: 15000000000,
          created_at: '2024-01-18T08:45:00Z'
        },
        {
          company_id: 'COMP005',
          company_name: '小売チェーン',
          industry: '小売業',
          founded_year: 2005,
          employee_count: 300,
          revenue: 4500000000,
          created_at: '2024-01-19T11:30:00Z'
        }
      ]
    };

    return mockResult;

    /* 実際のBigQuery実装例（バックエンドで実装）:
    
    const response = await fetch('/api/bigquery/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        query
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'クエリの実行に失敗しました');
    }

    return await response.json();
    */

  } catch (error) {
    console.error('BigQuery error:', error);
    throw {
      message: error instanceof Error ? error.message : 'クエリの実行中にエラーが発生しました',
      code: 'QUERY_ERROR'
    } as QueryError;
  }
};