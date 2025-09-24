import { timeToMinutes } from "@/lib/utils";

export type UseSalaryCalculationArgs = {
  totalSalary: number;
  transformAmount: number;
  gosiFactor: number;
  overtimeHours: string;
  overtimeHoursDouble: string;
  deductions: string;
  transportationAllowance?: boolean;
};

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateBaseSalary(totalSalary: number): number {
  return round2(totalSalary / 1.35);
}

const overtimeBase = (baseSalary: number) => {
  const hourly = baseSalary / 30 / 8 / 60; // daily 8 hours
  return ({ minutes, rate }: { minutes: number; rate: number }) => {
    return round2(hourly * minutes * rate);
  };
};

export function calculateGosi(
  salary: number,
  transformAmount: number,
  gosiFactor: number
): number {
  if (!transformAmount || !gosiFactor) return 0;
  return round2((salary * gosiFactor * 0.06) / transformAmount);
}

export function calculateDeductions(salary: number, minutes: number): number {
  const perMinute = salary / 30 / 8 / 60;
  return round2(perMinute * minutes);
}

const useSalaryCalculation = (args: UseSalaryCalculationArgs) => {
  const {
    totalSalary,
    transformAmount,
    gosiFactor,
    overtimeHours,
    overtimeHoursDouble,
    transportationAllowance,
    deductions: deductionsTimeFormat,
  } = args;

  const baseSalary = calculateBaseSalary(totalSalary);
  const allowances =
    round2(baseSalary * 0.35) + (transportationAllowance ? 150 : 0);

  const calculateOvertime = overtimeBase(baseSalary);

  const overtimeSingleAmount = calculateOvertime({
    minutes: timeToMinutes(overtimeHours),
    rate: 1.5,
  });

  const overtimeDoubleAmount = calculateOvertime({
    minutes: timeToMinutes(overtimeHoursDouble),
    rate: 2,
  });

  const gosi = calculateGosi(totalSalary, transformAmount, gosiFactor);
  const deductions = calculateDeductions(
    totalSalary,
    timeToMinutes(deductionsTimeFormat)
  );
  const netSalary = round2(
    baseSalary +
      allowances +
      overtimeSingleAmount +
      overtimeDoubleAmount -
      gosi -
      deductions
  );

  return {
    baseSalary,
    allowances,
    overtimeSingleAmount,
    overtimeDoubleAmount,
    gosi,
    deductions,
    netSalary,
  };
};

export { useSalaryCalculation };
