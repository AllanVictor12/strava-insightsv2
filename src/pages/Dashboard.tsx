import { useState, useCallback } from 'react';
import { FilterState } from '@/types/activity';
import { useActivities } from '@/hooks/useActivities';
import { FilterSidebar } from '@/components/FilterSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { KPICards } from '@/components/KPICards';
import { PersonalRecords } from '@/components/PersonalRecords';
import { ActivitiesTable } from '@/components/ActivitiesTable';
import { ActivityTypeChart, DistanceRangeChart, WeekdayChart, TimeOfDayChart } from '@/components/charts/PieCharts';
import { SpeedEvolutionChart, MonthlyDistanceChart } from '@/components/charts/LineCharts';
import { TopDistanceChart, TopSpeedChart } from '@/components/charts/BarCharts';
import { DistanceSpeedScatter } from '@/components/charts/ScatterChart';
import { ActivityHeatmap } from '@/components/charts/Heatmap';

const Dashboard = () => {
  const [filters, setFilters] = useState<FilterState>({
    dateFilter: 'thisYear',
    activityType: 'all',
    distanceFilter: 'all',
    speedFilter: 'all',
    elevationFilter: 'all'
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { activities, stats, personalRecords } = useActivities(filters);
  
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simula atualização
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1000);
  }, []);
  
  return (
    <div className="min-h-screen bg-background dark">
      <div className="flex w-full">
        <FilterSidebar 
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1 min-w-0">
          <DashboardHeader 
            lastUpdate={lastUpdate}
            onRefresh={handleRefresh}
            onToggleSidebar={() => setSidebarOpen(true)}
            isRefreshing={isRefreshing}
          />
          
          <main className="p-4 lg:p-6 space-y-6">
            {/* KPIs */}
            <section>
              <KPICards stats={stats} />
            </section>
            
            {/* Heatmap */}
            <section>
              <ActivityHeatmap activities={activities} />
            </section>
            
            {/* Personal Records */}
            <section>
              <PersonalRecords records={personalRecords} />
            </section>
            
            {/* Charts Row 1 - Line Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpeedEvolutionChart activities={activities} />
              <MonthlyDistanceChart activities={activities} />
            </section>
            
            {/* Charts Row 2 - Pie Charts */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ActivityTypeChart activities={activities} />
              <DistanceRangeChart activities={activities} />
              <WeekdayChart activities={activities} />
              <TimeOfDayChart activities={activities} />
            </section>
            
            {/* Charts Row 3 - Bar Charts + Scatter */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TopDistanceChart activities={activities} />
              <TopSpeedChart activities={activities} />
              <DistanceSpeedScatter activities={activities} />
            </section>
            
            {/* Activities Table */}
            <section>
              <ActivitiesTable activities={activities} />
            </section>
            
            {/* Footer */}
            <footer className="text-center py-6 text-sm text-muted-foreground">
              <p>MTB Dashboard • Dados do Strava</p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
