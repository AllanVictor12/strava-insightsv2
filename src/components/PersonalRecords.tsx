import { PersonalRecord } from '@/types/activity';
import { Trophy, Route, Zap, Mountain, Clock, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersonalRecordsProps {
  records: PersonalRecord[];
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'route': return <Route className="w-6 h-6" />;
    case 'zap': return <Zap className="w-6 h-6" />;
    case 'mountain': return <Mountain className="w-6 h-6" />;
    case 'clock': return <Clock className="w-6 h-6" />;
    case 'heart': return <Heart className="w-6 h-6" />;
    default: return <Trophy className="w-6 h-6" />;
  }
};

export const PersonalRecords = ({ records }: PersonalRecordsProps) => {
  if (records.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-secondary" />
          <h2 className="text-lg font-semibold text-foreground">Recordes Pessoais</h2>
        </div>
        <p className="text-muted-foreground text-center py-8">
          Nenhum recorde encontrado para os filtros selecionados.
        </p>
      </div>
    );
  }
  
  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-secondary" />
        <h2 className="text-lg font-semibold text-foreground">Recordes Pessoais</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {records.map((record, index) => (
          <div 
            key={index}
            className={cn(
              "relative overflow-hidden rounded-lg p-4",
              "bg-gradient-to-br from-muted/30 to-muted/10",
              "border border-border/50 hover:border-secondary/50",
              "transition-all duration-300 hover:scale-105"
            )}
          >
            <div className="absolute top-0 right-0 p-2 text-secondary/20">
              {getIcon(record.icon)}
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {record.title}
              </p>
              <p className="text-2xl font-bold text-secondary">
                {record.value}
              </p>
              <div className="pt-2 border-t border-border/50">
                <p className="text-sm text-foreground truncate" title={record.activityName}>
                  {record.activityName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {record.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
