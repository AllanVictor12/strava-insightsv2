import { useMemo } from 'react';
import { StravaActivity } from '@/types/activity';
import { ResponsivePie } from '@nivo/pie';
import { getDay } from 'date-fns';
import { darkTheme, CHART_PALETTE } from '@/lib/nivo-theme';

interface ChartProps {
  activities: StravaActivity[];
}

const getActivityGroup = (type: string) => {
  switch (type) {
    case 'MountainBikeRide':
    case 'Ride':
      return 'MTB';
    case 'Walk':
    case 'Run':
      return 'Caminhada';
    default:
      return type;
  }
};

function EmptyState() {
  return (
    <div className="rounded-xl bg-card border border-border p-6 h-80 flex items-center justify-center">
      <p className="text-muted-foreground">Sem dados para exibir</p>
    </div>
  );
}

function DonutChart({ data, title }: { data: { id: string; label: string; value: number }[]; title: string }) {
  if (data.length === 0) return <EmptyState />;

  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <div className="h-64">
        <ResponsivePie
          data={data}
          theme={darkTheme}
          colors={CHART_PALETTE}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.6}
          padAngle={2}
          cornerRadius={4}
          activeOuterRadiusOffset={6}
          borderWidth={0}
          enableArcLinkLabels={true}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="hsl(215, 20%, 75%)"
          arcLinkLabelsThickness={1.5}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLinkLabelsDiagonalLength={12}
          arcLinkLabelsStraightLength={8}
          arcLabelsSkipAngle={20}
          arcLabelsTextColor="hsl(222, 47%, 6%)"
          arcLabel={(d) => `${((d.arc.angleDeg / 360) * 100).toFixed(0)}%`}
          motionConfig="gentle"
          transitionMode="pushIn"
          tooltip={({ datum }) => (
            <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: datum.color }} />
                <span className="text-foreground font-medium text-sm">{datum.label}</span>
              </div>
              <p className="text-muted-foreground text-xs mt-1">
                {datum.value} atividades ({((datum.arc.angleDeg / 360) * 100).toFixed(1)}%)
              </p>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export const ActivityTypeChart = ({ activities }: ChartProps) => {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    activities.forEach(a => {
      const group = getActivityGroup(a.sport_type);
      counts[group] = (counts[group] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ id: name, label: name, value: count }))
      .sort((a, b) => b.value - a.value);
  }, [activities]);

  return <DonutChart data={data} title="Distribuição por Tipo de Atividade" />;
};

export const DistanceRangeChart = ({ activities }: ChartProps) => {
  const data = useMemo(() => {
    const ranges = [
      { name: '< 20km', min: 0, max: 20 },
      { name: '20-40km', min: 20, max: 40 },
      { name: '40-60km', min: 40, max: 60 },
      { name: '> 60km', min: 60, max: Infinity },
    ];

    return ranges
      .map(range => {
        const count = activities.filter(a => {
          const km = a.distance / 1000;
          return km >= range.min && km < range.max;
        }).length;
        return { id: range.name, label: range.name, value: count };
      })
      .filter(d => d.value > 0);
  }, [activities]);

  return <DonutChart data={data} title="Distribuição por Faixa de Distância" />;
};

export const WeekdayChart = ({ activities }: ChartProps) => {
  const data = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const counts = new Array(7).fill(0);

    activities.forEach(a => {
      const dayIndex = getDay(new Date(a.start_date_local));
      counts[dayIndex]++;
    });

    return days
      .map((name, index) => ({ id: name, label: name, value: counts[index] }))
      .filter(d => d.value > 0);
  }, [activities]);

  return <DonutChart data={data} title="Frequência por Dia da Semana" />;
};

export const TimeOfDayChart = ({ activities }: ChartProps) => {
  const data = useMemo(() => {
    const periods = ['Manhã', 'Tarde', 'Noite', 'Madrugada'];
    const counts: Record<string, number> = {};
    periods.forEach(p => (counts[p] = 0));

    activities.forEach(a => {
      const hour = new Date(a.start_date_local).getHours();
      if (hour >= 5 && hour < 12) counts['Manhã']++;
      else if (hour >= 12 && hour < 18) counts['Tarde']++;
      else if (hour >= 18 && hour < 22) counts['Noite']++;
      else counts['Madrugada']++;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ id: name, label: name, value }))
      .filter(d => d.value > 0);
  }, [activities]);

  return <DonutChart data={data} title="Distribuição por Horário" />;
};
