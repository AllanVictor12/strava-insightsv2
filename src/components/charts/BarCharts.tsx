import { useMemo } from 'react';
import { StravaActivity } from '@/types/activity';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TopDistanceChartProps {
  activities: StravaActivity[];
}

export const TopDistanceChart = ({ activities }: TopDistanceChartProps) => {
  const data = useMemo(() => {
    return [...activities]
      .sort((a, b) => b.distance - a.distance)
      .slice(0, 10)
      .map(a => ({
        name: a.name.length > 20 ? a.name.slice(0, 20) + '...' : a.name,
        fullName: a.name,
        distance: Number((a.distance / 1000).toFixed(1)),
        date: format(new Date(a.start_date_local), "dd 'de' MMM", { locale: ptBR })
      }))
      .reverse();
  }, [activities]);
  
  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 h-96 flex items-center justify-center">
        <p className="text-muted-foreground">Sem dados para exibir</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Top 10 Maiores Pedais
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 18%)" horizontal={false} />
            <XAxis 
              type="number"
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value} km`}
            />
            <YAxis 
              type="category"
              dataKey="name"
              stroke="hsl(215, 20%, 65%)"
              fontSize={11}
              tickLine={false}
              width={120}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222, 47%, 10%)', 
                border: '1px solid hsl(222, 47%, 18%)',
                borderRadius: '8px'
              }}
              formatter={(value: number, _, props) => [
                `${value} km`, 
                props.payload.date
              ]}
              labelFormatter={(_, payload) => payload[0]?.payload.fullName || ''}
            />
            <Bar dataKey="distance" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`hsl(198, 93%, ${50 + (index * 3)}%)`} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface TopSpeedChartProps {
  activities: StravaActivity[];
}

export const TopSpeedChart = ({ activities }: TopSpeedChartProps) => {
  const data = useMemo(() => {
    return [...activities]
      .sort((a, b) => b.average_speed - a.average_speed)
      .slice(0, 10)
      .map(a => ({
        name: a.name.length > 20 ? a.name.slice(0, 20) + '...' : a.name,
        fullName: a.name,
        speed: Number((a.average_speed * 3.6).toFixed(1)),
        date: format(new Date(a.start_date_local), "dd 'de' MMM", { locale: ptBR })
      }))
      .reverse();
  }, [activities]);
  
  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 h-96 flex items-center justify-center">
        <p className="text-muted-foreground">Sem dados para exibir</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Top 10 Mais Rápidos
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 18%)" horizontal={false} />
            <XAxis 
              type="number"
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value} km/h`}
            />
            <YAxis 
              type="category"
              dataKey="name"
              stroke="hsl(215, 20%, 65%)"
              fontSize={11}
              tickLine={false}
              width={120}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222, 47%, 10%)', 
                border: '1px solid hsl(222, 47%, 18%)',
                borderRadius: '8px'
              }}
              formatter={(value: number, _, props) => [
                `${value} km/h`, 
                props.payload.date
              ]}
              labelFormatter={(_, payload) => payload[0]?.payload.fullName || ''}
            />
            <Bar dataKey="speed" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`hsl(24, 100%, ${45 + (index * 3)}%)`} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
