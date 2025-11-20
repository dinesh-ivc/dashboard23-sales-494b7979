'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Globe, Store, Package } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [stats, setStats] = useState({
    totalWebsiteVisits: 0,
    totalStoreVisits: 0,
    totalProducts: 0,
    totalUsers: 0
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from API endpoints
    // For demo purposes, we're using mock data
    setStats({
      totalWebsiteVisits: 1248,
      totalStoreVisits: 863,
      totalProducts: 142,
      totalUsers: 24
    });

    setChartData([
      { name: 'Jan', visits: 400 },
      { name: 'Feb', visits: 300 },
      { name: 'Mar', visits: 200 },
      { name: 'Apr', visits: 278 },
      { name: 'May', visits: 189 },
      { name: 'Jun', visits: 239 },
    ]);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales Dashboard</h1>
          <p className="text-muted-foreground">Track your website visits, store visits, and product performance</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/website-visits">View Website Visits</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/store-visits">View Store Visits</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Website Visits</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWebsiteVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Visits</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStoreVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">5 new products added</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">2 new users this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Website Traffic</CardTitle>
            <CardDescription>Monthly website visits over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visits" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your sales data efficiently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Add Website Visit</h3>
                  <p className="text-sm text-muted-foreground">Record a new website visit</p>
                </div>
                <Button asChild size="sm">
                  <Link href="/dashboard/website-visits">Add</Link>
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Add Store Visit</h3>
                  <p className="text-sm text-muted-foreground">Record a new store visit</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/store-visits">Add</Link>
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Manage Products</h3>
                  <p className="text-sm text-muted-foreground">Add or edit product information</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/products">Manage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest sales dashboard updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Globe className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New website visit recorded</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Store className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Store visit updated</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Package className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New product added</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}