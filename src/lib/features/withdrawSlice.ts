import { apiSlice } from "./apiSlice";
import {
  MakeWithdrawInput,
  MakeWithdrawOutput,
  WithdrawPageData,
} from "@/types/api/withdraw";

const depositApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    makeWithdraw: builder.mutation<MakeWithdrawOutput, MakeWithdrawInput>({
      query: (body) => ({
        url: "api/withdraw",
        method: "POST",
        body,
      }),
      invalidatesTags: ["withdraw"],
    }),
    fetchWithdrawPageData: builder.query<WithdrawPageData, void>({
      query: () => ({
        url: "api/withdraw/page",
        method: "GET",
      }),
      providesTags: ["withdraw"],
    }),
  }),
});

export const { useMakeWithdrawMutation, useFetchWithdrawPageDataQuery } =
  depositApiSlice;
