"use client";
import { useTranslations } from "next-intl";
import { z } from "zod/mini";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSalaryCalculation } from "@/hooks/useSalaryCalculation";
import { timeFormat } from "@/lib/utils";

const schema = z.object({
  totalSalary: z.string("form.required").check(z.minLength(1, "form.required")),
  transformAmount: z.string("form.required"),
  gosiFactor: z.string("form.required"),
  overtimeHours: z.string("form.required"),
  overtimeHoursDouble: z.string("form.required"),
  deductions: z.string("form.required"),
});

type FormValues = z.infer<typeof schema>;

const safe = (amount?: string | null, defaultValue: number = 0) => {
  return +(amount || defaultValue);
};

const defaultValues = {
  totalSalary: "",
  transformAmount: "425",
  gosiFactor: "106",
  overtimeHours: "",
  overtimeHoursDouble: "",
  deductions: "",
};

export default function HomePage() {
  const t = useTranslations();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues,
  });

  const values = form.watch();

  const live = useSalaryCalculation({
    totalSalary: safe(values.totalSalary),
    transformAmount: safe(values.transformAmount),
    gosiFactor: safe(values.gosiFactor),
    overtimeHours: values.overtimeHours,
    overtimeHoursDouble: values.overtimeHoursDouble,
    deductions: values.deductions,
  });

  return (
    <div className="p-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("app.title")}</CardTitle>
              <CardDescription>{t("app.description")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <form className="grid gap-4 grid-cols-12">
            <Input
              className="col-span-12"
              label={t("form.totalSalary")}
              type="text"
              inputMode="decimal"
              {...form.register("totalSalary")}
              error={
                form.formState.errors.totalSalary?.message
                  ? t(form.formState.errors.totalSalary.message)
                  : undefined
              }
              onChange={(e) => {
                const numeric = e.target.value.replace(/[^0-9.]/g, "");
                form.setValue("totalSalary", numeric);
              }}
            />

            <Input
              className="col-span-12 md:col-span-6"
              label={t("form.gosiFactorYemeni")}
              type="text"
              inputMode="decimal"
              {...form.register("gosiFactor")}
              error={
                form.formState.errors.gosiFactor?.message
                  ? t(form.formState.errors.gosiFactor.message)
                  : undefined
              }
              onChange={(e) => {
                const numeric = e.target.value.replace(/[^0-9.]/g, "");
                form.setValue("gosiFactor", numeric);
              }}
            />

            <Input
              className="col-span-12 md:col-span-6"
              label={t("form.transformAmount")}
              type="text"
              inputMode="decimal"
              {...form.register("transformAmount")}
              error={
                form.formState.errors.transformAmount?.message
                  ? t(form.formState.errors.transformAmount.message)
                  : undefined
              }
              onChange={(e) => {
                const numeric = e.target.value.replace(/[^0-9.]/g, "");
                form.setValue("transformAmount", numeric);
              }}
            />

            <Input
              label={t("form.overtimeHours")}
              type="text"
              placeholder={t("form.h_m")}
              className="col-span-12 md:col-span-6"
              inputMode="decimal"
              {...form.register("overtimeHours")}
              error={
                form.formState.errors.overtimeHours?.message
                  ? t(form.formState.errors.overtimeHours.message)
                  : undefined
              }
              onChange={(e) => {
                const value = timeFormat(e.target.value);
                form.setValue("overtimeHours", value);
              }}
            />

            <Input
              className="col-span-12 md:col-span-6"
              label={t("form.overtimeHoursDouble")}
              placeholder={t("form.h_m")}
              inputMode="decimal"
              {...form.register("overtimeHoursDouble")}
              onChange={(e) => {
                const value = timeFormat(e.target.value);
                form.setValue("overtimeHoursDouble", value);
              }}
            />

            <Input
              className="col-span-12"
              label={t("form.deductions")}
              placeholder={t("form.h_m")}
              type="text"
              inputMode="numeric"
              {...form.register("deductions")}
              onChange={(e) => {
                const value = timeFormat(e.target.value);
                form.setValue("deductions", value);
              }}
            />

            <div className="flex gap-3 sm:col-span-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => form.reset(defaultValues)}
              >
                {t("form.reset")}
              </Button>
            </div>
          </form>
          <div className="rounded-md border p-4 grid gap-2">
            <div className="flex justify-between">
              <span>{t("result.baseSalary")}</span>
              <span>{live.baseSalary}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("result.allowances")}</span>
              <span>{live.allowances}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("result.overtime15")}</span>
              <span>{live.overtimeSingleAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("result.overtime20")}</span>
              <span>{live.overtimeDoubleAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("result.overtime")}</span>
              <span>
                {live.overtimeSingleAmount + live.overtimeDoubleAmount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("result.gosi")}</span>
              <span>{live.gosi}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("result.deductions")}</span>
              <span>{live.deductions}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>{t("result.netSalary")}</span>
              <span>{live.netSalary}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
