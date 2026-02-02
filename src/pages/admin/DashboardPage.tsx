import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import { mockUsers, mockCustomers, mockRouteStats } from '@/data/mockData';
import { Users, Building2, Route, TrendingUp, Clock, MapPin } from 'lucide-react';

export default function DashboardPage() {
  const activeUsers = mockUsers.filter((u) => u.status === 'active').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your logistics operations
          </p>
        </div>

        {/* Stats Grid */}
        {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={mockUsers.length}
            subtitle={`${activeUsers} active`}
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Customers"
            value={mockCustomers.length}
            subtitle="Registered locations"
            icon={<Building2 className="h-6 w-6" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Routes Calculated"
            value={mockRouteStats.totalRoutes}
            subtitle="This month"
            icon={<Route className="h-6 w-6" />}
            trend={{ value: 23, isPositive: true }}
          />
          <StatCard
            title="Success Rate"
            value={`${mockRouteStats.successRate}%`}
            subtitle="Route accuracy"
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div> */}

        {/* Secondary Stats */}
        {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-info/10 text-info">
                <MapPin className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Distance</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockRouteStats.avgDistance} km
                </p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <Clock className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Duration</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockRouteStats.avgDuration} min
                </p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-success/10 text-success">
                <TrendingUp className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Algorithm</p>
                <p className="text-2xl font-bold text-foreground">
                  Dijkstra
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Recent Activity */}
      </div>
    </DashboardLayout>
  );
}
