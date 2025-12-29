//component/dashboard/ChartCard.tsx
"use client";
import { Card, CardBody, CardHeader } from "@heroui/react";

import { ChartCardProps } from "@/types/ChartCardType";

export const ChartCard = ({ title, children }: ChartCardProps) => (
  <Card className="h-full">
    <CardHeader>
      <h3 className="text-lg font-semibold">{title}</h3>
    </CardHeader>
    <CardBody className="pt-0">{children}</CardBody>
  </Card>
);