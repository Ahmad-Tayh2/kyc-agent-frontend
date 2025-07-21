export function handleApiResponse<T>(res: {
  status: boolean;
  message: string;
  data: T | null;
  errors: Record<string, string[]> | null;
}): T {
  if (!res.status) {
    const firstError =
      res.errors && typeof res.errors === 'object'
        ? Object.values(res.errors)?.[0]?.[0]
        : 'Something went wrong.';
    throw new Error(firstError || 'Something went wrong.');
  }

  if (res.data === null) {
    throw new Error('No data returned from the server.');
  }

  return res.data;
}
