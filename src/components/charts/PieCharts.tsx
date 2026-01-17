import { useMemo } from 'react';
import { StravaActivity } from '@/types/activity';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from 'recharts';
import { format, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityTypeChartProps {
  activities: StravaActivity[];
}

const COLORS = [
  'hsl(198, 93%, 59%)', // primary
  'hsl(24, 100%, 50%)', // strava orange
  'hsl(142, 71%, 45%)', // success green
  'hsl(262, 83%, 58%)', // purple
];

const getActivityLabel = (type: string) => {
  switch (type) {
    case 'MountainBikeRide': return 'MTB';
    case 'Ride': return 'Estrada';
    case 'Walk': return 'Caminhada';
    case 'Run': return 'Corrida';
    default: return type;
  }
};

export const ActivityTypeChart = ({ activities }: ActivityTypeChartProps) => {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    activities.forEach(a => {
      const type = a.sport_type;
      counts[type] = (counts[type] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([type, count]) => ({
        name: getActivityLabel(type),
        value: count,
        percentage: ((count / activities.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value);
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
        Distribuição por Tipo de Atividade
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percentage }) => `${name} (${percentage}%)`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222, 47%, 10%)', 
                border: '1px solid hsl(222, 47%, 18%)',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${value} atividades`, 'Total']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface DistanceRangeChartProps {
  activities: StravaActivity[];
}

export const DistanceRangeChart = ({ activities }: DistanceRangeChartProps) => {
  const data = useMemo(() => {
    const ranges = [
      { name: '< 20km', min: 0, max: 20 },
      { name: '20-40km', min: 20, max: 40 },
      { name: '40-60km', min: 40, max: 60 },
      { name: '> 60km', min: 60, max: Infinity }
    ];
    
    return ranges.map(range => {
      const count = activities.filter(a => {
        const km = a.distance / 1000;
        return km >= range.min && km < range.max;
      }).length;
      
      return {
        name: range.name,
        value: count,
        percentage: activities.length > 0 ? ((count / activities.length) * 100).toFixed(1) : '0'
      };
    }).filter(d => d.value > 0);
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
        Distribuição por Faixa de Distância
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percentage }) => `${name} (${percentage}%)`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222, 47%, 10%)', 
                border: '1px solid hsl(222, 47%, 18%)',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${value} atividades`, 'Total']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface WeekdayChartProps {
  activities: StravaActivity[];
}

export const WeekdayChart = ({ activities }: WeekdayChartProps) => {
  const data = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const counts = new Array(7).fill(0);
    
    activities.forEach(a => {
      const dayIndex = getDay(new Date(a.start_date_local));
      counts[dayIndex]++;
    });
    
    return days.map((name, index) => ({
      name,
      value: counts[index],
      percentage: activities.length > 0 ? ((counts[index] / activities.length) * 100).toFixed(1) : '0'
    })).filter(d => d.value > 0);
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
        Frequência por Dia da Semana
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percentage }) => `${name} (${percentage}%)`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222, 47%, 10%)', 
                border: '1px solid hsl(222, 47%, 18%)',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${value} atividades`, 'Total']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface TimeOfDayChartProps {
  activities: StravaActivity[];
}

export const TimeOfDayChart = ({ activities }: TimeOfDayChartProps) => {
  const data = useMemo(() => {
    const periods = [
      { name: 'Manhã (5h-12h)', min: 5, max: 12 },
      { name: 'Tarde (12h-18h)', min: 12, max: 18 },
      { name: 'Noite (18h-22h)', min: 18, max: 22 },
      { name: 'Madrugada', min: 22, max: 5 }
    ];
    
    const counts: Record<string, number> = {};
    periods.forEach(p => counts[p.name] = 0);
    
    activities.forEach(a => {
      const hour = new Date(a.start_date_local).getHours();
      if (hour >= 5 && hour < 12) counts['Manhã (5h-12h)']++;
      else if (hour >= 12 && hour < 18) counts['Tarde (12h-18h)']++;
      else if (hour >= 18 && hour < 22) counts['Noite (18h-22h)']++;
      else counts['Madrugada']++;
    });
    
    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
        percentage: activities.length > 0 ? ((value / activities.length) * 100).toFixed(1) : '0'
      }))
      .filter(d => d.value > 0);
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
        Distribuição por Horário
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percentage }) => `${name.split(' ')[0]} (${percentage}%)`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222, 47%, 10%)', 
                border: '1px solid hsl(222, 47%, 18%)',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${value} atividades`, 'Total']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
