export type ActionResult<T> = { success: boolean; data?: T; error?: string, status?: number };

export interface DepositResponse {
  transaction: {
    id: string;
    amount: string;
    toUserId: string;
    createdAt: string;
    status: string;
  };
}
