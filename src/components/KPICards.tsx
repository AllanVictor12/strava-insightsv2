import { DashboardStats } from '@/types/activity';
import { 
  Route, 
  Clock, 
  Mountain, 
  Activity, 
  Gauge, 
  Zap, 
  TrendingUp, 
  Flame, 
  ArrowUp,
  Heart 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardsProps {
  stats: DashboardStats;
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}min`;
};

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: 'primary' | 'strava' | 'success' | 'warning';
}

const KPICard = ({ title, value, subtitle, icon, accentColor = 'primary' }: KPICardProps) => {
  const colorClasses = {
    primary: 'text-primary',
    strava: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning'
  };
  
  return (
    <div className="relative overflow-hidden rounded-xl bg-card border border-border p-3 sm:p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg group">
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />

      <div className="flex items-start justify-between">
        <div className="space-y-0.5 sm:space-y-1 min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{title}</p>
          <p className={cn("text-lg sm:text-2xl font-bold", colorClasses[accentColor])}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          "p-2 rounded-lg bg-muted/50 transition-colors group-hover:bg-primary/10",
          colorClasses[accentColor]
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const KPICards = ({ stats }: KPICardsProps) => {
  const kpis = [
    {
      title: 'Distância Total',
      value: `${(stats.totalDistance / 1000).toFixed(1)} km`,
      icon: <Route className="w-5 h-5" />,
      accentColor: 'primary' as const
    },
    {
      title: 'Tempo Total',
      value: formatTime(stats.totalTime),
      icon: <Clock className="w-5 h-5" />,
      accentColor: 'strava' as const
    },
    {
      title: 'Elevação Total',
      value: `${stats.totalElevation.toFixed(0)} m`,
      icon: <Mountain className="w-5 h-5" />,
      accentColor: 'success' as const
    },
    {
      title: 'Total de Atividades',
      value: stats.totalActivities.toString(),
      icon: <Activity className="w-5 h-5" />,
      accentColor: 'primary' as const
    },
    {
      title: 'Velocidade Média',
      value: `${stats.averageSpeed.toFixed(1)} km/h`,
      icon: <Gauge className="w-5 h-5" />,
      accentColor: 'warning' as const
    },
    {
      title: 'Velocidade Máxima',
      value: `${stats.maxSpeed.toFixed(1)} km/h`,
      icon: <Zap className="w-5 h-5" />,
      accentColor: 'strava' as const
    },
    {
      title: 'Média por Atividade',
      value: `${(stats.averageDistancePerActivity / 1000).toFixed(1)} km`,
      icon: <TrendingUp className="w-5 h-5" />,
      accentColor: 'primary' as const
    },
    {
      title: 'Potência Média',
      value: stats.averagePower > 0 ? `${stats.averagePower.toFixed(0)} W` : 'N/A',
      icon: <Flame className="w-5 h-5" />,
      accentColor: 'warning' as const
    },
    {
      title: 'Elevação Média',
      value: `${stats.averageElevationPerActivity.toFixed(0)} m`,
      icon: <ArrowUp className="w-5 h-5" />,
      accentColor: 'success' as const
    },
    {
      title: 'Total de Kudos',
      value: stats.totalKudos.toString(),
      icon: <Heart className="w-5 h-5" />,
      accentColor: 'strava' as const
    }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
};
