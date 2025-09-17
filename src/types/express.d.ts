declare namespace Express {
  export interface Request {
    userId?: number | string;
    isAdmin?: boolean;
  }
}
