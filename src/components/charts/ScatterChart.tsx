import { useMemo } from 'react';
import { StravaActivity } from '@/types/activity';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ZAxis
} from 'recharts';

interface DistanceSpeedScatterProps {
  activities: StravaActivity[];
}

export const DistanceSpeedScatter = ({ activities }: DistanceSpeedScatterProps) => {
  const data = useMemo(() => {
    return activities.map(a => ({
      name: a.name,
      distance: Number((a.distance / 1000).toFixed(1)),
      speed: Number((a.average_speed * 3.6).toFixed(1)),
      elevation: a.total_elevation_gain,
      z: Math.max(50, Math.min(300, a.total_elevation_gain / 2))
    }));
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
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        Distância vs Velocidade
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Tamanho do ponto = elevação
      </p>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 18%)" />
            <XAxis 
              type="number"
              dataKey="distance"
              name="Distância"
              unit=" km"
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              type="number"
              dataKey="speed"
              name="Velocidade"
              unit=" km/h"
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
            />
            <ZAxis type="number" dataKey="z" range={[20, 200]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: 'hsl(222, 47%, 10%)', 
                border: '1px solid hsl(222, 47%, 18%)',
                borderRadius: '8px'
              }}
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;
                const data = payload[0].payload;
                return (
                  <div className="p-3 space-y-1">
                    <p className="font-medium text-foreground">{data.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Distância: <span className="text-primary">{data.distance} km</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Velocidade: <span className="text-secondary">{data.speed} km/h</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Elevação: <span className="text-success">{data.elevation.toFixed(0)} m</span>
                    </p>
                  </div>
                );
              }}
            />
            <Scatter 
              name="Atividades" 
              data={data} 
              fill="hsl(198, 93%, 59%)"
              fillOpacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
