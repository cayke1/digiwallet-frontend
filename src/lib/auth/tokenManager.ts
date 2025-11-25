let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export const tokenManager = {
  isRefreshing: (): boolean => isRefreshing,

  setRefreshing: (value: boolean): void => {
    isRefreshing = value;
  },

  getRefreshPromise: (): Promise<any> | null => refreshPromise,

  setRefreshPromise: (promise: Promise<any> | null): void => {
    refreshPromise = promise;
  },

  reset: (): void => {
    isRefreshing = false;
    refreshPromise = null;
  },
};
