export interface ErrorInterface {
  id: number;
  name: string;
  message: string;
  stack: string;
  sqlCode?: string;
  sqlHint?: string;
  sqlQuery?: string;
  sqlParameters?: string[];
}
