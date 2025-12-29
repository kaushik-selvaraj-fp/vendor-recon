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
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { EyeIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export const RecentOrders = () => {
  const orders = [
    {
      id: "#12345",
      customer: "John Doe",
      amount: "$299.99",
      status: "completed",
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    {
      id: "#12346",
      customer: "Jane Smith",
      amount: "$159.50",
      status: "pending",
      avatar: "https://i.pravatar.cc/150?u=2",
    },
    {
      id: "#12347",
      customer: "Mike Johnson",
      amount: "$89.99",
      status: "processing",
      avatar: "https://i.pravatar.cc/150?u=3",
    },
    {
      id: "#12348",
      customer: "Sarah Wilson",
      amount: "$449.00",
      status: "completed",
      avatar: "https://i.pravatar.cc/150?u=4",
    },
    {
      id: "#12349",
      customer: "Tom Brown",
      amount: "$199.99",
      status: "cancelled",
      avatar: "https://i.pravatar.cc/150?u=5",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "processing":
        return "primary";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
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
            <TableColumn>ORDER</TableColumn>
            <TableColumn>CUSTOMER</TableColumn>
            <TableColumn>AMOUNT</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTION</TableColumn>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar size="sm" src={order.avatar} />
                    <span>{order.customer}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
                <TableCell>
                  <Chip
                    color={getStatusColor(order.status)}
                    size="sm"
                    variant="flat"
                  >
                    {order.status}
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
                      <DropdownItem key={"2"}>Edit Order</DropdownItem>
                      <DropdownItem key={"3"} className="text-danger">
                        Cancel Order
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