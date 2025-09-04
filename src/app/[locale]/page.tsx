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

const schema = z.object({
  totalSalary: z.string("form.required").check(z.minLength(1, "form.required")),
  transformAmount: z.string("form.required").check((ctx) => {
    if (!ctx.value || +ctx.value < 1) {
      ctx.issues.push({
        code: "custom",
        message: "form.must_be_at_least_one",
        input: ctx.value,
      });
    }
  }),
  overtimeHours: z.string("form.required"),
  overtimeHoursDouble: z.string("form.required"),
  deductionsMinutes: z.string("form.required"),
});

type FormValues = z.infer<typeof schema>;

const safe = (amount?: string | null, defaultValue: number = 0) => {
  return +(amount || defaultValue);
};

const defaultValues = {
  totalSalary: "",
  transformAmount: "425",
  overtimeHours: "",
  overtimeHoursDouble: "",
  deductionsMinutes: "",
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
    transformAmount: safe(values.transformAmount, 1),
    overtimeHours: safe(values.overtimeHours),
    overtimeHoursDouble: safe(values.overtimeHoursDouble),
    deductionsMinutes: safe(values.deductionsMinutes),
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
              className="col-span-12"
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
              id="overtimeHours"
              type="text"
              className="col-span-12 md:col-span-6"
              inputMode="decimal"
              {...form.register("overtimeHours")}
              onChange={(e) => {
                const numeric = e.target.value.replace(/[^0-9.]/g, "");
                form.setValue("overtimeHours", numeric);
              }}
            />

            <Input
              className="col-span-12 md:col-span-6"
              label={t("form.overtimeHoursDouble")}
              inputMode="decimal"
              {...form.register("overtimeHoursDouble")}
              onChange={(e) => {
                const numeric = e.target.value.replace(/[^0-9.]/g, "");

                form.setValue("overtimeHoursDouble", numeric);
              }}
            />

            <Input
              className="col-span-12"
              label={t("form.deductionsMinutes")}
              type="text"
              inputMode="numeric"
              {...form.register("deductionsMinutes")}
              onChange={(e) => {
                const numeric = e.target.value.replace(/[^0-9.]/g, "");
                form.setValue("deductionsMinutes", numeric);
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
