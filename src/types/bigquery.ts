export interface QueryResult {
  rows: any[];
  schema: {
    name: string;
    type: string;
  }[];
}

export interface QueryRequest {
  projectId: string;
  query: string;
  keyFile?: string;
}

export interface QueryError {
  message: string;
  code?: string;
}

export interface BigQueryConfig {
  projectId: string;
  keyFilename?: string;
  credentials?: any;
}