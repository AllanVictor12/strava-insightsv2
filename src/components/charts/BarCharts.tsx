import { useMemo } from 'react';
import { StravaActivity } from '@/types/activity';
import { ResponsiveBar } from '@nivo/bar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { darkTheme, chartColors } from '@/lib/nivo-theme';

interface TopDistanceChartProps {
  activities: StravaActivity[];
}

export const TopDistanceChart = ({ activities }: TopDistanceChartProps) => {
  const data = useMemo(() => {
    return [...activities]
      .sort((a, b) => b.distance - a.distance)
      .slice(0, 10)
      .map((a) => ({
        id: a.name.length > 16 ? a.name.slice(0, 16) + '...' : a.name,
        fullName: a.name,
        distance: Number((a.distance / 1000).toFixed(1)),
        date: format(new Date(a.start_date_local), "dd 'de' MMM", { locale: ptBR }),
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
    <div className="rounded-xl bg-card border border-border p-3 sm:p-6">
      <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-4">Top 10 Maiores Pedais</h3>
      <div className="h-64 sm:h-80">
        <ResponsiveBar
          data={data}
          keys={['distance']}
          indexBy="id"
          theme={darkTheme}
          colors={chartColors.primary}
          colorBy="indexValue"
          margin={{ top: 5, right: 20, bottom: 5, left: 100 }}
          layout="horizontal"
          padding={0.25}
          borderRadius={4}
          borderWidth={0}
          enableGridX={true}
          enableGridY={false}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
          }}
          enableLabel={true}
          label={(d) => `${d.value} km`}
          labelSkipWidth={40}
          labelTextColor="hsl(0, 0%, 100%)"
          tooltip={({ data: d }) => (
            <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
              <p className="text-foreground font-medium text-sm">{d.fullName as string}</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {d.distance} km &middot; {d.date as string}
              </p>
            </div>
          )}
          motionConfig="gentle"
          defs={[
            {
              id: 'gradient-blue',
              type: 'linearGradient',
              colors: [
                { offset: 0, color: 'hsl(198, 93%, 50%)' },
                { offset: 100, color: 'hsl(198, 93%, 65%)' },
              ],
            },
          ]}
          fill={[{ match: '*', id: 'gradient-blue' }]}
        />
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
      .map((a) => ({
        id: a.name.length > 16 ? a.name.slice(0, 16) + '...' : a.name,
        fullName: a.name,
        speed: Number((a.average_speed * 3.6).toFixed(1)),
        date: format(new Date(a.start_date_local), "dd 'de' MMM", { locale: ptBR }),
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
    <div className="rounded-xl bg-card border border-border p-3 sm:p-6">
      <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-4">Top 10 Mais Rápidos</h3>
      <div className="h-64 sm:h-80">
        <ResponsiveBar
          data={data}
          keys={['speed']}
          indexBy="id"
          theme={darkTheme}
          colors={chartColors.strava}
          colorBy="indexValue"
          margin={{ top: 5, right: 20, bottom: 5, left: 100 }}
          layout="horizontal"
          padding={0.25}
          borderRadius={4}
          borderWidth={0}
          enableGridX={true}
          enableGridY={false}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
          }}
          enableLabel={true}
          label={(d) => `${d.value} km/h`}
          labelSkipWidth={40}
          labelTextColor="hsl(0, 0%, 100%)"
          tooltip={({ data: d }) => (
            <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
              <p className="text-foreground font-medium text-sm">{d.fullName as string}</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {d.speed} km/h &middot; {d.date as string}
              </p>
            </div>
          )}
          motionConfig="gentle"
          defs={[
            {
              id: 'gradient-orange',
              type: 'linearGradient',
              colors: [
                { offset: 0, color: 'hsl(24, 100%, 42%)' },
                { offset: 100, color: 'hsl(24, 100%, 58%)' },
              ],
            },
          ]}
          fill={[{ match: '*', id: 'gradient-orange' }]}
        />
      </div>
    </div>
  );
};
