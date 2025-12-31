//component/dashboard/RecentOrders.tsx
"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { EyeIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export const RecentOrders = () => {
  const entries = [
    {
      id: "REC-1001",
      vendor: "Ming Fa Food",
      amount: 506.96,
      status: "reconciled",
      avatar: "https://i.pravatar.cc/150?u=11",
    },
    {
      id: "REC-1002",
      vendor: "Singapore Commercial",
      amount: 313.05,
      status: "pending",
      avatar: "https://i.pravatar.cc/150?u=12",
    },
    {
      id: "REC-1003",
      vendor: "The Seafood Company",
      amount: 670.46,
      status: "discrepancy",
      avatar: "https://i.pravatar.cc/150?u=13",
    },
    {
      id: "REC-1004",
      vendor: "YIHAI (SINGAPORE) FOOD PTE",
      amount: 193.91,
      status: "reconciled",
      avatar: "https://i.pravatar.cc/150?u=14",
    },
    {
      id: "REC-1005",
      vendor: "Acme Supplies",
      amount: 432.19,
      status: "flagged",
      avatar: "https://i.pravatar.cc/150?u=15",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reconciled":
        return "success";
      case "pending":
        return "warning";
      case "discrepancy":
        return "danger";
      case "flagged":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center w-full">
              <h3 className="text-lg font-semibold">Recent Reconciliations</h3>
          <Button
            endContent={<EyeIcon className="h-4 w-4" />}
            size="sm"
            variant="light"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <Table removeWrapper aria-label="Recent orders table">
          <TableHeader>
            <TableColumn>VENDOR</TableColumn>
            <TableColumn>AMOUNT</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTION</TableColumn>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{entry.vendor}</span>
                    <span className="text-xs text-default-500">{entry.id}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">${entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>
                  <Chip
                    color={getStatusColor(entry.status)}
                    size="sm"
                    variant="flat"
                  >
                    {entry.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <EllipsisVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem key={"1"}>View Details</DropdownItem>
                      <DropdownItem key={"2"}>Mark Reconciled</DropdownItem>
                      <DropdownItem key={"3"} className="text-danger">
                        Flag
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};