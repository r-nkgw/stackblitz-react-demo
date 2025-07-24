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
}

export interface QueryError {
  message: string;
  code?: string;
}