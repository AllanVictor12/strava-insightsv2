import { useMemo } from 'react';
import { StravaActivity } from '@/types/activity';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { darkTheme, chartColors } from '@/lib/nivo-theme';

interface DistanceSpeedScatterProps {
  activities: StravaActivity[];
}

export const DistanceSpeedScatter = ({ activities }: DistanceSpeedScatterProps) => {
  const data = useMemo(() => {
    const points = activities.map((a) => ({
      x: Number((a.distance / 1000).toFixed(1)),
      y: Number((a.average_speed * 3.6).toFixed(1)),
      name: a.name,
      elevation: a.total_elevation_gain,
    }));

    return [{ id: 'Atividades', data: points }];
  }, [activities]);

  if (activities.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 h-96 flex items-center justify-center">
        <p className="text-muted-foreground">Sem dados para exibir</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border p-3 sm:p-6">
      <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Distância vs Velocidade</h3>
      <p className="text-xs text-muted-foreground mb-4">Tamanho do ponto = elevação</p>
      <div className="h-64 sm:h-80">
        <ResponsiveScatterPlot
          data={data}
          theme={darkTheme}
          colors={[chartColors.primary]}
          margin={{ top: 10, right: 10, bottom: 50, left: 50 }}
          xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
          nodeSize={(d) => {
            const elevation = (d.data as { elevation?: number }).elevation ?? 0;
            return Math.max(6, Math.min(24, elevation / 40));
          }}
          blendMode="screen"
          enableGridX={true}
          enableGridY={true}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            legend: 'Distância (km)',
            legendPosition: 'middle',
            legendOffset: 38,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            legend: 'Velocidade (km/h)',
            legendPosition: 'middle',
            legendOffset: -48,
          }}
          useMesh={true}
          tooltip={({ node }) => {
            const d = node.data as { x: number; y: number; name?: string; elevation?: number };
            return (
              <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                <p className="text-foreground font-medium text-sm">{d.name}</p>
                <div className="space-y-0.5 mt-1">
                  <p className="text-xs text-muted-foreground">
                    Distância: <span style={{ color: chartColors.primary }}>{d.x} km</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Velocidade: <span style={{ color: chartColors.strava }}>{d.y} km/h</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Elevação: <span style={{ color: chartColors.success }}>{d.elevation?.toFixed(0)} m</span>
                  </p>
                </div>
              </div>
            );
          }}
          motionConfig="gentle"
        />
      </div>
    </div>
  );
};
