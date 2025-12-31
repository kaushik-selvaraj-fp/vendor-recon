//app/dashboard/page.tsx
"use client";

import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Avatar,
  Input,
  Select,
  SelectItem,
  Badge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/react";

interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
}
import {
  UserGroupIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  EyeIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { RecentOrders } from "@/components/RecentOrders";
import { ChartCard } from "@/components/ChartCard";
import { StatsCard } from "@/components/StatsCard";
import { Sidebar } from "@/components/Sidebar";

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState('dashboard');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [vendors, setVendors] = useState<Vendor[]>([
    { id: 1, name: 'ABC Corp', email: 'contact@abc.com', phone: '123-456-7890' },
    { id: 2, name: 'XYZ Ltd', email: 'info@xyz.com', phone: '987-654-3210' },
  ]);

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleNavClick = (href: string) => {
    if (href === '/dashboard') setCurrentView('dashboard');
    else if (href === '/vendors') setCurrentView('vendors-list');
    // For other href, could add router.push, but for now ignore
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedVendor) {
      // update
      setVendors(vendors.map(v => v.id === selectedVendor.id ? { ...v, ...formData } : v));
      setSelectedVendor(null);
    } else {
      // add
      setVendors([...vendors, { id: Date.now(), ...formData }]);
    }
    setCurrentView('vendors-list');
  };

  const monthlyTrendData = [
    { month: "Jan 2025", totalReconciliations: 45, discrepanciesFound: 12, matchedInvoices: 230, totalVariance: 15000 },
    { month: "Feb 2025", totalReconciliations: 52, discrepanciesFound: 15, matchedInvoices: 280, totalVariance: 22000 },
    { month: "Mar 2025", totalReconciliations: 48, discrepanciesFound: 10, matchedInvoices: 265, totalVariance: 18000 },
    { month: "Apr 2025", totalReconciliations: 61, discrepanciesFound: 18, matchedInvoices: 310, totalVariance: 25000 },
    { month: "May 2025", totalReconciliations: 58, discrepanciesFound: 14, matchedInvoices: 295, totalVariance: 20000 },
    { month: "Jun 2025", totalReconciliations: 65, discrepanciesFound: 11, matchedInvoices: 340, totalVariance: 16000 },
  ];

  const reconStatusData = [
    { name: "Reconciled", value: 400, color: "#10b981" },
    { name: "Pending", value: 300, color: "#f59e0b" },
    { name: "Discrepancy", value: 200, color: "#ef4444" },
    { name: "Flagged", value: 100, color: "#7c3aed" },
  ];

  const topProducts = [
    { name: "Ming Fa Food", sales: 1234, revenue: "$1,234,000", trend: 12 },
    { name: "Singapore Commercial", sales: 856, revenue: "$856,000", trend: 8 },
    { name: "The Seadfood Compnay", sales: 2341, revenue: "$468,200", trend: -3 },
    { name: "YIHAI (SINGAPORE) FOOD PTE", sales: 567, revenue: "$567,000", trend: 15 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Vendor Recon Dashboard</h1>
            <p className="text-default-600">Welcome back, Admin!</p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              className="w-64"
              placeholder="Search..."
              startContent={<MagnifyingGlassIcon className="h-4 w-4" />}
            />
            <Badge color="danger" content="5">
              <Button isIconOnly variant="light">
                <BellIcon className="h-5 w-5" />
              </Button>
            </Badge>
            <Avatar src="https://i.pravatar.cc/150?u=admin" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            change={12.5}
            color="warning"
            icon={CurrencyDollarIcon}
            title="Total Variance Amount"
            value={-54239}
          />
          <StatsCard
            change={8.2}
            color="primary"
            icon={ExclamationTriangleIcon}
            title="Total Discrepancies"
            value="1,423"
          />
          <StatsCard
            change={-2.1}
            color="warning"
            icon={UserGroupIcon}
            title="Pending Reconciliations"
            value="12,847"
          />
          <StatsCard
            change={15.3}
            color="secondary"
            icon={CheckCircleIcon}
            title="Completion Rate"
            value="89.34%"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ChartCard title="Monthly Reconciliation Trends">
              <ResponsiveContainer height={320} width="100%">
                <LineChart data={monthlyTrendData} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="y-axis-count" tick={{ fontSize: 12 }} label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
                  <YAxis yAxisId="y-axis-amount" orientation="right" tick={{ fontSize: 12 }} label={{ value: 'Amount ($)', angle: 90, position: 'insideRight', style: { fontSize: 12 } }} tickFormatter={(val) => `$${Number(val).toLocaleString()}`} />
                  <Tooltip formatter={(value: any, name?: string) => {
                    const displayName = name ?? '';
                    // If this series is the variance series, format as currency
                    if (typeof value === 'number' && displayName.toLowerCase().includes('variance')) {
                      return [`$${Number(value).toLocaleString()}`, displayName];
                    }
                    // Otherwise return the value as-is (counts)
                    return [value, displayName];
                  }} wrapperStyle={{ fontSize: 12 }} contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />

                  <Line yAxisId="y-axis-count" type="monotone" dataKey="totalReconciliations" name="Total Reconciliations" stroke="#4A90E2" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  <Line yAxisId="y-axis-count" type="monotone" dataKey="discrepanciesFound" name="Discrepancies Found" stroke="#E74C3C" strokeWidth={2} dot={false} />
                  <Line yAxisId="y-axis-count" type="monotone" dataKey="matchedInvoices" name="Matched Invoices" stroke="#7ED321" strokeWidth={2} dot={false} />
                  <Line yAxisId="y-axis-amount" type="monotone" dataKey="totalVariance" name="Total Variance ($)" stroke="#F5A623" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div>
            <ChartCard title="Reconciliation Status">
              <ResponsiveContainer height={300} width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={reconStatusData}
                    dataKey="value"
                    outerRadius={80}
                  >
                    {reconStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {reconStatusData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrders />

          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold">Vendors</h3>
                <Button size="sm" variant="light" onPress={onOpen}>
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Vendor
                </Button>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-default-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-default-600">
                        {product.sales} Invoices
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.revenue}</p>
                      <div className="flex items-center justify-end">
                        {product.trend > 0 ? (
                          <ArrowUpIcon className="h-4 w-4 text-success" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 text-danger" />
                        )}
                        <span
                          className={`text-sm ml-1 ${product.trend > 0 ? "text-success" : "text-danger"}`}
                        >
                          {Math.abs(product.trend)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Add Product Modal */}
        <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
          <ModalContent>
            <ModalHeader>Add New Product</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input label="Product Name" placeholder="Enter product name" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Price" placeholder="$0.00" startContent="$" />
                  <Input label="Stock" placeholder="0" type="number" />
                </div>
                <Select label="Category" placeholder="Select category">
                  <SelectItem key="electronics">Electronics</SelectItem>
                  <SelectItem key="clothing">Clothing</SelectItem>
                  <SelectItem key="home">Home</SelectItem>
                  <SelectItem key="books">Books</SelectItem>
                </Select>
                <Input label="Description" placeholder="Product description" />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={onClose}>
                Add Product
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}