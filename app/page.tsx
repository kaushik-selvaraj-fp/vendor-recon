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
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

  const salesData = [
    { name: "Jan", sales: 4000, revenue: 2400 },
    { name: "Feb", sales: 3000, revenue: 1398 },
    { name: "Mar", sales: 2000, revenue: 9800 },
    { name: "Apr", sales: 2780, revenue: 3908 },
    { name: "May", sales: 1890, revenue: 4800 },
    { name: "Jun", sales: 2390, revenue: 3800 },
    { name: "Jul", sales: 3490, revenue: 4300 },
  ];

  const categoryData = [
    { name: "Electronics", value: 400, color: "#0070f3" },
    { name: "Clothing", value: 300, color: "#7c3aed" },
    { name: "Home", value: 200, color: "#f59e0b" },
    { name: "Books", value: 100, color: "#ef4444" },
  ];

  const topProducts = [
    { name: "iPhone 15 Pro", sales: 1234, revenue: "$1,234,000", trend: 12 },
    { name: "MacBook Air M2", sales: 856, revenue: "$856,000", trend: 8 },
    { name: "AirPods Pro", sales: 2341, revenue: "$468,200", trend: -3 },
    { name: "iPad Pro", sales: 567, revenue: "$567,000", trend: 15 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {currentView === 'dashboard' && (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Dashboard</h1>
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
            color="success"
            icon={CurrencyDollarIcon}
            title="Total Revenue"
            value="$54,239"
          />
          <StatsCard
            change={8.2}
            color="primary"
            icon={ShoppingCartIcon}
            title="Total Orders"
            value="1,423"
          />
          <StatsCard
            change={-2.1}
            color="warning"
            icon={UserGroupIcon}
            title="Total Users"
            value="12,847"
          />
          <StatsCard
            change={15.3}
            color="secondary"
            icon={EyeIcon}
            title="Page Views"
            value="89,342"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ChartCard title="Sales Overview">
              <ResponsiveContainer height={300} width="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    dataKey="sales"
                    stroke="#0070f3"
                    strokeWidth={2}
                    type="monotone"
                  />
                  <Line
                    dataKey="revenue"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div>
            <ChartCard title="Sales by Category">
              <ResponsiveContainer height={300} width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={categoryData}
                    dataKey="value"
                    outerRadius={80}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((item) => (
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
                <h3 className="text-lg font-semibold">Top Products</h3>
                <Button size="sm" variant="light" onPress={onOpen}>
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Product
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
                        {product.sales} sales
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
        </>
        )}
        {(currentView === 'add-vendor' || currentView === 'edit-vendor') && (
          <Card className="max-w-md mx-auto mt-10">
            <CardHeader>
              <h2 className="text-xl font-bold">{selectedVendor ? 'Edit Vendor' : 'Add Vendor'}</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Vendor Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Input
                  label="Contact Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <Button type="submit" color="primary">{selectedVendor ? 'Update' : 'Save'}</Button>
              </form>
            </CardBody>
          </Card>
        )}
        {currentView === 'vendors-list' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Vendors</h1>
              <Button onClick={() => { setSelectedVendor(null); setFormData({name:'',email:'',phone:''}); setCurrentView('add-vendor'); }}>Add Vendor</Button>
            </div>
            <Table>
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Phone</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.phone}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => { setSelectedVendor(vendor); setFormData({ name: vendor.name, email: vendor.email, phone: vendor.phone }); setCurrentView('edit-vendor'); }}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}