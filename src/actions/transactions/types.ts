export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface DepositResponse {
  transaction: {
    id: string;
    amount: string;
    toUserId: string;
    createdAt: string;
    status: string;
  };
}
