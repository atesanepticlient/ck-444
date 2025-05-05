"use client";
import React, { useState } from "react";

import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

import zod from "zod";
import { withdrawSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useMakeWithdrawMutation } from "@/lib/features/withdrawSlice";
import { toast } from "sonner";
import { INTERNAL_SERVER_ERROR } from "@/error";
import InvoiceModal from "./invoice-modal";
import { Prisma } from "@prisma/client";

interface WithdrawFormProps {
  cardId: string;
  maxWithdraw: number;
  minWithdraw: number;
}

const WithdrawForm = ({
  cardId,
  maxWithdraw,
  minWithdraw,
}: WithdrawFormProps) => {
  const [withdraw, setWithdraw] =
    useState<Prisma.WithdrawGetPayload<{ include: { card: true } }>>();

  const form = useForm<zod.infer<typeof withdrawSchema>>({
    defaultValues: { amount: "", password: "" },
    resolver: zodResolver(withdrawSchema),
  });

  const [makeWithdrawApi, { isLoading }] = useMakeWithdrawMutation();

  const handleWithdraw = (data: zod.infer<typeof withdrawSchema>) => {
    makeWithdrawApi({
      amount: +data.amount,
      cardId,
      password: data.password,
    })
      .unwrap()
      .then((res) => {
        setWithdraw(res.withdraw);
      })
      .catch((error) => {
        if (error.data.error) {
          toast.error(error.data.error);
        } else {
          toast.error(INTERNAL_SERVER_ERROR);
        }
      });
  };

  return (
    <div className="sticky bottom-0 left-0 bg-gray-50 py-2 border-t">
      <h4 className="text-base font-semibold ">Withdraw : </h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleWithdraw)}>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute top-[10px] left-2 text-gray-500">
                  Amount
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={`${minWithdraw} ~ ${maxWithdraw}`}
                    disabled={isLoading}
                    className="w-full pl-20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute top-[10px] left-2 text-gray-500">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder={`*****`}
                    disabled={isLoading}
                    className="w-full pl-20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            disabled={isLoading}
            className="text-white disabled:cursor-not-allowed disabled:bg-blue-800 bg-blue-600 hover:bg-blue-700 hover:transition-colors px-4 py-2 cursor-pointer rounded-sm shadow-sm w-full mt-8"
          >
            {isLoading ? "Withdrawing..." : "Withdraw"}
          </button>
        </form>
      </Form>

      {withdraw && (
        <InvoiceModal
          onClose={() => setWithdraw(undefined)}
          modalOpne={!!withdraw}
          withdraw={withdraw}
        />
      )}
    </div>
  );
};

export default WithdrawForm;
