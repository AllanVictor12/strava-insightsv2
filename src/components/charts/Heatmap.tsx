import { useMemo } from 'react';
import { StravaActivity } from '@/types/activity';
import { 
  startOfYear, 
  endOfYear, 
  eachDayOfInterval, 
  format, 
  getDay,
  isSameDay,
  getMonth
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ActivityHeatmapProps {
  activities: StravaActivity[];
}

export const ActivityHeatmap = ({ activities }: ActivityHeatmapProps) => {
  const targetYear = useMemo(() => {
    if (activities.length === 0) return new Date().getFullYear();
    const years = activities.map(a => new Date(a.start_date_local).getFullYear());
    // Use the most common year in the filtered data
    const counts: Record<number, number> = {};
    years.forEach(y => { counts[y] = (counts[y] || 0) + 1; });
    return Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
  }, [activities]);

  const data = useMemo(() => {
    const ref = new Date(targetYear, 0, 1);
    const yearStart = startOfYear(ref);
    const yearEnd = endOfYear(ref);
    
    const allDays = eachDayOfInterval({ start: yearStart, end: yearEnd });
    
    const activityMap: Record<string, { count: number; distance: number }> = {};
    activities.forEach(a => {
      const dateKey = format(new Date(a.start_date_local), 'yyyy-MM-dd');
      if (!activityMap[dateKey]) {
        activityMap[dateKey] = { count: 0, distance: 0 };
      }
      activityMap[dateKey].count++;
      activityMap[dateKey].distance += a.distance / 1000;
    });
    
    // Organiza por semana
    const weeks: { date: Date; count: number; distance: number }[][] = [];
    let currentWeek: { date: Date; count: number; distance: number }[] = [];
    
    // Preenche os dias vazios no início
    const firstDayOfWeek = getDay(yearStart);
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: new Date(0), count: -1, distance: 0 });
    }
    
    allDays.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayData = activityMap[dateKey] || { count: 0, distance: 0 };
      
      currentWeek.push({ 
        date: day, 
        count: dayData.count, 
        distance: dayData.distance 
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [activities, targetYear]);
  
  const getColor = (count: number) => {
    if (count === -1) return 'bg-transparent';
    if (count === 0) return 'bg-muted/30';
    if (count === 1) return 'bg-primary/30';
    if (count === 2) return 'bg-primary/50';
    if (count >= 3) return 'bg-primary';
    return 'bg-muted/30';
  };
  
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Calendário de Atividades ({targetYear})
      </h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-fit">
          {/* Month labels */}
          <div className="flex mb-2">
            <div className="w-8" /> {/* Spacer for day labels */}
            {months.map((month, i) => (
              <div 
                key={month} 
                className="text-xs text-muted-foreground"
                style={{ width: `${100 / 12}%`, minWidth: '36px' }}
              >
                {month}
              </div>
            ))}
          </div>
          
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => (
                <div 
                  key={day} 
                  className="h-3 text-xs text-muted-foreground flex items-center"
                  style={{ display: i % 2 === 1 ? 'flex' : 'none' }}
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div className="flex gap-[2px]">
              {data.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[2px]">
                  {week.map((day, dayIndex) => (
                    <Tooltip key={dayIndex} delayDuration={100}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "w-3 h-3 rounded-sm transition-colors cursor-pointer hover:ring-1 hover:ring-primary/50",
                            getColor(day.count)
                          )}
                        />
                      </TooltipTrigger>
                      {day.count >= 0 && (
                        <TooltipContent side="top" className="text-xs">
                          <p className="font-medium">
                            {format(day.date, "dd 'de' MMM, yyyy", { locale: ptBR })}
                          </p>
                          {day.count > 0 ? (
                            <p className="text-muted-foreground">
                              {day.count} {day.count === 1 ? 'atividade' : 'atividades'} • {day.distance.toFixed(1)} km
                            </p>
                          ) : (
                            <p className="text-muted-foreground">Sem atividades</p>
                          )}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 justify-end">
            <span className="text-xs text-muted-foreground">Menos</span>
            <div className="w-3 h-3 rounded-sm bg-muted/30" />
            <div className="w-3 h-3 rounded-sm bg-primary/30" />
            <div className="w-3 h-3 rounded-sm bg-primary/50" />
            <div className="w-3 h-3 rounded-sm bg-primary" />
            <span className="text-xs text-muted-foreground">Mais</span>
          </div>
        </div>
      </div>
    </div>
  );
};
