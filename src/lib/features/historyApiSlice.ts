import { apiSlice } from "./apiSlice";
interface HistoryParams {
  type: string;
  status: string;
  page: number;
  id?: string | null;
}
const historyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHistory: builder.query({
      query: ({ type, status, page, id }: HistoryParams) => {
        const params = new URLSearchParams();
        params.append("type", type);
        params.append("status", status);
        params.append("page", page.toString());
        if (id) params.append("id", id);
        return `/api/history?${params.toString()}`;
      },
    }),
  }),
});

export const { useGetHistoryQuery } = historyApiSlice;
