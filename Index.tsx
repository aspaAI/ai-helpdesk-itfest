import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/ui/stat-card';
import { TicketTable } from '@/components/tickets/TicketTable';
import { TicketsByCategory } from '@/components/dashboard/TicketsByCategory';
import { TicketsTrend } from '@/components/dashboard/TicketsTrend';
import { TicketsByStatus } from '@/components/dashboard/TicketsByStatus';
import { TicketsByPriority } from '@/components/dashboard/TicketsByPriority';
import { useTicketMetrics } from '@/hooks/useClientRequests';
import { Ticket as TicketIcon, Clock, Sparkles, Target, Loader2 } from 'lucide-react';

export default function Index() {
  const { data: metrics, isLoading, error } = useTicketMetrics();

  if (isLoading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-destructive">Error loading dashboard</p>
          <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
        </div>
      </Layout>
    );
  }

  const totalTickets = metrics?.totalTickets || 0;
  const autoResolvedPercentage = metrics?.autoResolvedPercentage || 0;
  const avgResponseTime = metrics?.avgResponseTime || '0 min';
  const classificationAccuracy = metrics?.classificationAccuracy || 0;
  const recentTickets = metrics?.tickets.slice(0, 8) || [];

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Tickets"
            value={totalTickets}
            change={12}
            changeLabel="vs last week"
            icon={TicketIcon}
            iconColor="bg-primary/10 text-primary"
          />
          <StatCard
            title="Auto-Resolved"
            value={`${autoResolvedPercentage}%`}
            change={5}
            changeLabel="vs last week"
            icon={Sparkles}
            iconColor="bg-success/10 text-success"
          />
          <StatCard
            title="Avg Response Time"
            value={avgResponseTime}
            change={-8}
            changeLabel="faster"
            icon={Clock}
            iconColor="bg-warning/10 text-warning"
          />
          <StatCard
            title="AI Accuracy"
            value={`${classificationAccuracy}%`}
            change={2}
            changeLabel="vs last week"
            icon={Target}
            iconColor="bg-info/10 text-info"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TicketsTrend metrics={metrics?.dailyMetrics || []} />
          <TicketsByCategory tickets={metrics?.tickets || []} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <TicketsByStatus tickets={metrics?.tickets || []} />
          <TicketsByPriority tickets={metrics?.tickets || []} />
        </div>

        {/* Recent Tickets */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Tickets</h2>
            <a
              href="/tickets"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all →
            </a>
          </div>
          <TicketTable tickets={recentTickets} />
        </div>
      </div>
    </Layout>
  );
}
