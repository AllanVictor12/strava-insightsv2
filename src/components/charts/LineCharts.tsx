import { useMemo } from 'react';
import { StravaActivity } from '@/types/activity';
import { ResponsiveLine } from '@nivo/line';
import { format, getMonth, getYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { darkTheme, chartColors } from '@/lib/nivo-theme';

interface SpeedEvolutionChartProps {
  activities: StravaActivity[];
}

export const SpeedEvolutionChart = ({ activities }: SpeedEvolutionChartProps) => {
  const data = useMemo(() => {
    // Filtrar apenas pedais (MTB e Ride)
    const bikeOnly = activities.filter(
      a => a.sport_type === 'MountainBikeRide' || a.sport_type === 'Ride'
    );

    // Agregar por mês
    const monthlySpeed: Record<string, { total: number; count: number }> = {};
    bikeOnly.forEach(a => {
      const date = new Date(a.start_date_local);
      const key = `${getYear(date)}-${String(getMonth(date) + 1).padStart(2, '0')}`;
      if (!monthlySpeed[key]) monthlySpeed[key] = { total: 0, count: 0 };
      monthlySpeed[key].total += a.average_speed * 3.6;
      monthlySpeed[key].count++;
    });

    const points = Object.entries(monthlySpeed)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, { total, count }]) => {
        const [year, month] = key.split('-');
        return {
          x: format(new Date(parseInt(year), parseInt(month) - 1), 'MMM yy', { locale: ptBR }),
          y: Number((total / count).toFixed(1)),
        };
      });

    return [{ id: 'Velocidade Média', data: points }];
  }, [activities]);

  if (activities.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 h-80 flex items-center justify-center">
        <p className="text-muted-foreground">Sem dados para exibir</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Evolução da Velocidade Média - Pedal
      </h3>
      <div className="h-72">
        <ResponsiveLine
          data={data}
          theme={darkTheme}
          colors={[chartColors.strava]}
          margin={{ top: 10, right: 20, bottom: 40, left: 55 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
          curve="catmullRom"
          enableArea={true}
          areaOpacity={0.1}
          lineWidth={2.5}
          pointSize={6}
          pointColor={chartColors.strava}
          pointBorderWidth={2}
          pointBorderColor="hsl(0, 0%, 7%)"
          enableGridX={false}
          axisBottom={{
            tickRotation: -45,
            tickSize: 0,
            tickPadding: 8,
            truncateTickAt: 0,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            format: (v) => `${v} km/h`,
          }}
          useMesh={true}
          tooltip={({ point }) => (
            <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
              <p className="text-foreground font-medium text-sm">{point.data.x as string}</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                <span style={{ color: chartColors.strava }}>{point.data.yFormatted} km/h</span>
              </p>
            </div>
          )}
          motionConfig="gentle"
        />
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

    activities.forEach((activity) => {
      const date = new Date(activity.start_date_local);
      const key = `${getYear(date)}-${String(getMonth(date) + 1).padStart(2, '0')}`;
      monthlyData[key] = (monthlyData[key] || 0) + activity.distance / 1000;
    });

    const points = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, distance]) => {
        const [year, month] = key.split('-');
        return {
          x: format(new Date(parseInt(year), parseInt(month) - 1), 'MMM yy', { locale: ptBR }),
          y: Number(distance.toFixed(1)),
        };
      });

    return [{ id: 'Distância', data: points }];
  }, [activities]);

  if (activities.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 h-80 flex items-center justify-center">
        <p className="text-muted-foreground">Sem dados para exibir</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Distância Mensal</h3>
      <div className="h-72">
        <ResponsiveLine
          data={data}
          theme={darkTheme}
          colors={[chartColors.strava]}
          margin={{ top: 10, right: 20, bottom: 40, left: 55 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 'auto' }}
          curve="catmullRom"
          enableArea={true}
          areaOpacity={0.12}
          lineWidth={2.5}
          pointSize={6}
          pointColor={chartColors.strava}
          pointBorderWidth={2}
          pointBorderColor="hsl(222, 47%, 10%)"
          enableGridX={false}
          axisBottom={{
            tickRotation: -45,
            tickSize: 0,
            tickPadding: 8,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            format: (v) => `${v} km`,
          }}
          useMesh={true}
          tooltip={({ point }) => (
            <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
              <p className="text-foreground font-medium text-sm">{point.data.x as string}</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                <span style={{ color: chartColors.strava }}>{point.data.yFormatted} km</span>
              </p>
            </div>
          )}
          motionConfig="gentle"
        />
      </div>
    </div>
  );
};
