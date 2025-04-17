import {
  GetDepositDataOutput,
  MakeDepositRequestInput,
  MakeDepositRequestOutput,
} from "@/types/api/deposit";
import { apiSlice } from "./apiSlice";

const depositApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepositPaymentData: builder.query<GetDepositDataOutput["payload"], void>(
      {
        query: () => ({
          url: "api/deposit/payment/wallet",
          method: "GET",
        }),
        transformResponse: (response: GetDepositDataOutput) => response.payload,
      }
    ),
    makeDeposite: builder.mutation<
      MakeDepositRequestOutput,
      MakeDepositRequestInput
    >({
      query: (body) => ({
        url: "api/deposit",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetDepositPaymentDataQuery, useMakeDepositeMutation } =
  depositApiSlice;
