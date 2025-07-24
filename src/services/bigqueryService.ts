import { BigQuery } from '@google-cloud/bigquery';
import type { QueryResult, QueryRequest, QueryError, BigQueryConfig } from '../types/bigquery';

// BigQueryクライアントのインスタンス
let bigqueryClient: BigQuery | null = null;

// BigQueryクライアントを初期化
const initializeBigQuery = (config: BigQueryConfig): BigQuery => {
  if (!bigqueryClient) {
    bigqueryClient = new BigQuery({
      projectId: config.projectId,
      keyFilename: config.keyFilename,
      credentials: config.credentials,
    });
  }
  return bigqueryClient;
};

export const executeBigQueryQuery = async (
  projectId: string,
  query: string = 'SELECT * FROM mst_company',
  credentials?: any
): Promise<QueryResult> => {
  try {
    // BigQueryクライアントを初期化
    const bigquery = initializeBigQuery({
      projectId,
      credentials
    });

    // クエリオプションを設定
    const options = {
      query: query,
      location: 'US', // データセットの場所に応じて変更
    };

    // クエリを実行
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    // ジョブの完了を待機
    const [rows] = await job.getQueryResults();

    // スキーマ情報を取得
    const schema = job.metadata?.configuration?.query?.destinationTable 
      ? await getTableSchema(bigquery, job.metadata.configuration.query.destinationTable)
      : inferSchemaFromRows(rows);

    return {
      schema,
      rows: rows.map(row => ({ ...row }))
    };

  } catch (error) {
    console.error('BigQuery error:', error);
    
    // エラーメッセージを詳細化
    let errorMessage = 'クエリの実行中にエラーが発生しました';
    let errorCode = 'QUERY_ERROR';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // 認証エラーの場合
      if (error.message.includes('authentication') || error.message.includes('credentials')) {
        errorMessage = '認証に失敗しました。サービスアカウントキーを確認してください。';
        errorCode = 'AUTH_ERROR';
      }
      // プロジェクトIDエラーの場合
      else if (error.message.includes('project')) {
        errorMessage = 'プロジェクトIDが無効です。正しいGCPプロジェクトIDを入力してください。';
        errorCode = 'PROJECT_ERROR';
      }
      // テーブルが見つからない場合
      else if (error.message.includes('not found') || error.message.includes('does not exist')) {
        errorMessage = 'テーブル "mst_company" が見つかりません。テーブル名とデータセットを確認してください。';
        errorCode = 'TABLE_NOT_FOUND';
      }
    }
    
    throw {
      message: errorMessage,
      code: errorCode
    } as QueryError;
  }
};

// テーブルスキーマを取得する補助関数
const getTableSchema = async (bigquery: BigQuery, tableRef: any) => {
  try {
    const dataset = bigquery.dataset(tableRef.datasetId);
    const table = dataset.table(tableRef.tableId);
    const [metadata] = await table.getMetadata();
    
    return metadata.schema.fields.map((field: any) => ({
      name: field.name,
      type: field.type
    }));
  } catch (error) {
    console.warn('Could not get table schema:', error);
    return [];
  }
};

// 行データからスキーマを推測する補助関数
const inferSchemaFromRows = (rows: any[]) => {
  if (rows.length === 0) return [];
  
  const firstRow = rows[0];
  return Object.keys(firstRow).map(key => ({
    name: key,
    type: typeof firstRow[key] === 'number' ? 'NUMERIC' : 'STRING'
  }));
};