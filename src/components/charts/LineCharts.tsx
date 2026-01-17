import { useMemo } from 'react';
import { StravaActivity } from '@/types/activity';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { format, parseISO, startOfMonth, getMonth, getYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SpeedEvolutionChartProps {
  activities: StravaActivity[];
}

export const SpeedEvolutionChart = ({ activities }: SpeedEvolutionChartProps) => {
  const data = useMemo(() => {
    const sorted = [...activities]
      .sort((a, b) => new Date(a.start_date_local).getTime() - new Date(b.start_date_local).getTime());
    
    // Média móvel de 5 atividades
    return sorted.map((activity, index) => {
      const windowStart = Math.max(0, index - 4);
      const windowActivities = sorted.slice(windowStart, index + 1);
      const avgSpeed = windowActivities.reduce((sum, a) => sum + a.average_speed * 3.6, 0) / windowActivities.length;
      
      return {
        date: format(new Date(activity.start_date_local), 'dd/MM', { locale: ptBR }),
        fullDate: format(new Date(activity.start_date_local), "dd 'de' MMM, yyyy", { locale: ptBR }),
        speed: Number((activity.average_speed * 3.6).toFixed(1)),
        avgSpeed: Number(avgSpeed.toFixed(1)),
        name: activity.name
      };
    });
  }, [activities]);
  
  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 h-80 flex items-center justify-center">
        <p className="text-muted-foreground">Sem dados para exibir</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Evolução da Velocidade Média (Média Móvel 5 atividades)
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(198, 93%, 59%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(198, 93%, 59%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 18%)" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value} km/h`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222, 47%, 10%)', 
                border: '1px solid hsl(222, 47%, 18%)',
                borderRadius: '8px'
              }}
              labelFormatter={(_, payload) => payload[0]?.payload.fullDate || ''}
              formatter={(value: number, name: string) => [
                `${value} km/h`, 
                name === 'avgSpeed' ? 'Média Móvel' : 'Velocidade'
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="avgSpeed" 
              stroke="hsl(198, 93%, 59%)" 
              strokeWidth={2}
              fill="url(#speedGradient)"
            />
            <Line 
              type="monotone" 
              dataKey="speed" 
              stroke="hsl(24, 100%, 50%)" 
              strokeWidth={1}
              dot={false}
              opacity={0.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface MonthlyDistanceChartProps {
  activities: StravaActivity[];
}

export const MonthlyDistanceChart = ({ activities }: MonthlyDistanceChartProps) => {
  const data = useMemo(() => {
    const monthlyData: Record<string, number> = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.start_date_local);
      const key = `${getYear(date)}-${String(getMonth(date) + 1).padStart(2, '0')}`;
      monthlyData[key] = (monthlyData[key] || 0) + activity.distance / 1000;
    });
    
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, distance]) => {
        const [year, month] = key.split('-');
        return {
          month: format(new Date(parseInt(year), parseInt(month) - 1), 'MMM yy', { locale: ptBR }),
          distance: Number(distance.toFixed(1))
        };
      });
  }, [activities]);
  
  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 h-80 flex items-center justify-center">
        <p className="text-muted-foreground">Sem dados para exibir</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Distância Mensal
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="distanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(24, 100%, 50%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(24, 100%, 50%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 18%)" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value} km`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222, 47%, 10%)', 
                border: '1px solid hsl(222, 47%, 18%)',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${value} km`, 'Distância']}
            />
            <Area 
              type="monotone" 
              dataKey="distance" 
              stroke="hsl(24, 100%, 50%)" 
              strokeWidth={2}
              fill="url(#distanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
