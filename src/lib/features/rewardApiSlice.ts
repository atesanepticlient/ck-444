import { InviationRewardGetOutput } from "@/types/api/reward";
import { apiSlice } from "./apiSlice";

const rewardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    findInvitationRewardData: builder.query<InviationRewardGetOutput, void>({
      query: () => ({
        url: "api/invitation-bonus",
        method: "GET",
      }),
      providesTags: ["invitationReward"],
    }),

    clamInvitationReward: builder.mutation<
      { success: boolean },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `api/invitation-bonus/${id}`,
        body: {},
        method: "PUT",
      }),
      invalidatesTags: ["invitationReward"],
    }),
  }),
});

export const {
  useFindInvitationRewardDataQuery,
  useClamInvitationRewardMutation,
} = rewardApiSlice;
