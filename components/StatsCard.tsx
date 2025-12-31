//component/dashboard/StatsCard.tsx
"use client";

import { Card, CardBody } from "@heroui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

import { StatsCardProps } from "@/types/StatsCardType";

export const StatsCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = "primary",
  currency = 'USD',
}: StatsCardProps) => {
  const isNumber = typeof value === 'number';
  const numericValue = isNumber ? (value as number) : undefined;
  const formattedValue = isNumber
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(numericValue!)
    : (value as string);
  const valueClass = isNumber && numericValue! < 0 ? 'text-2xl font-bold text-danger' : 'text-2xl font-bold';

  return (
    <Card className="h-full">
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-default-600">{title}</p>
            <p className={valueClass}>{formattedValue}</p>
            <div className="flex items-center mt-1">
              {change > 0 ? (
                <ArrowUpIcon className="h-4 w-4 text-success" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-danger" />
              )}
              <span className={`text-sm ml-1 ${change > 0 ? "text-success" : "text-danger"}`}>
                {Math.abs(change)}%
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-full bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};