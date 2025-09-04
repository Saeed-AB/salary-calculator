export type UseSalaryCalculationArgs = {
  totalSalary: number;
  transformAmount: number;
  overtimeHours: number; // 1.5x
  overtimeHoursDouble: number; // 2x
  deductionsMinutes: number;
};

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateBaseSalary(totalSalary: number): number {
  return round2(totalSalary * 0.65);
}

const overtimeBase = (baseSalary: number) => {
  const hourly = baseSalary / 30 / 8; // daily 8 hours
  return ({ hours, rate }: { hours: number; rate: number }) => {
    return hourly * hours * rate;
  };
};

export function calculateGosi(salary: number, transformAmount: number): number {
  if (!transformAmount || transformAmount === 0) return 0;
  console.log(salary * 106 * 0.06);
  return round2((salary * 106 * 0.06) / transformAmount);
}

export function calculateDeductions(salary: number, minutes: number): number {
  const perMinute = salary / 30 / 8 / 60;
  return round2(perMinute * minutes);
}

const useSalaryCalculation = (args: UseSalaryCalculationArgs) => {
  const {
    totalSalary,
    transformAmount,
    overtimeHours,
    overtimeHoursDouble,
    deductionsMinutes,
  } = args;

  const baseSalary = calculateBaseSalary(totalSalary);

  const calculateOvertime = overtimeBase(baseSalary);

  const overtimeSingleAmount = calculateOvertime({
    hours: overtimeHours,
    rate: 1.5,
  });

  const overtimeDoubleAmount = calculateOvertime({
    hours: overtimeHoursDouble,
    rate: 2,
  });

  const gosi = calculateGosi(totalSalary, transformAmount);
  const deductions = calculateDeductions(totalSalary, deductionsMinutes);
  const netSalary = round2(
    totalSalary +
      overtimeSingleAmount +
      overtimeDoubleAmount -
      gosi -
      deductions
  );

  return {
    baseSalary,
    overtimeSingleAmount,
    overtimeDoubleAmount,
    gosi,
    deductions,
    netSalary,
  };
};

export { useSalaryCalculation };
