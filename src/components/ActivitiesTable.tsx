import { useState, useMemo } from 'react';
import { StravaActivity } from '@/types/activity';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpDown, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Heart,
  Bike,
  Footprints,
  PersonStanding
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivitiesTableProps {
  activities: StravaActivity[];
}

type SortField = 'name' | 'start_date_local' | 'distance' | 'moving_time' | 'total_elevation_gain' | 'average_speed' | 'kudos_count';
type SortDirection = 'asc' | 'desc';

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'MountainBikeRide':
    case 'Ride':
      return <Bike className="w-4 h-4 text-primary" />;
    case 'Run':
      return <PersonStanding className="w-4 h-4 text-success" />;
    case 'Walk':
      return <Footprints className="w-4 h-4 text-warning" />;
    default:
      return <Bike className="w-4 h-4 text-muted-foreground" />;
  }
};

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
};

export const ActivitiesTable = ({ activities }: ActivitiesTableProps) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('start_date_local');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const filteredAndSortedActivities = useMemo(() => {
    let filtered = activities;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = activities.filter(a => 
        a.name.toLowerCase().includes(searchLower)
      );
    }
    
    return [...filtered].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;
      
      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'start_date_local':
          aVal = new Date(a.start_date_local).getTime();
          bVal = new Date(b.start_date_local).getTime();
          break;
        default:
          aVal = a[sortField];
          bVal = b[sortField];
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }, [activities, search, sortField, sortDirection]);
  
  const totalPages = Math.ceil(filteredAndSortedActivities.length / itemsPerPage);
  const paginatedActivities = filteredAndSortedActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const exportToCSV = () => {
    const headers = ['Nome', 'Data', 'Tipo', 'Distância (km)', 'Tempo', 'Elevação (m)', 'Vel. Média (km/h)', 'Kudos'];
    const rows = filteredAndSortedActivities.map(a => [
      a.name,
      format(new Date(a.start_date_local), 'dd/MM/yyyy HH:mm'),
      a.sport_type,
      (a.distance / 1000).toFixed(2),
      formatTime(a.moving_time),
      a.total_elevation_gain.toFixed(0),
      (a.average_speed * 3.6).toFixed(1),
      a.kudos_count
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'atividades_strava.csv';
    link.click();
  };
  
  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-auto p-0 hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className={cn(
        "ml-1 w-3 h-3",
        sortField === field && "text-primary"
      )} />
    </Button>
  );
  
  return (
    <div className="rounded-xl bg-card border border-border">
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="text-lg font-semibold text-foreground">Atividades Recentes</h2>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome..." 
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 bg-muted/50"
              />
            </div>
            <Button variant="outline" size="icon" onClick={exportToCSV} title="Exportar CSV">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12"></TableHead>
              <TableHead>
                <SortButton field="name">Nome</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="start_date_local">Data</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="distance">Distância</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="moving_time">Tempo</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="total_elevation_gain">Elevação</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="average_speed">Vel. Média</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="kudos_count">Kudos</SortButton>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhuma atividade encontrada
                </TableCell>
              </TableRow>
            ) : (
              paginatedActivities.map(activity => (
                <TableRow key={activity.id} className="group">
                  <TableCell>
                    {getActivityIcon(activity.sport_type)}
                  </TableCell>
                  <TableCell className="font-medium">
                    <span className="group-hover:text-primary transition-colors">
                      {activity.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(activity.start_date_local), "dd MMM yyyy, HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {(activity.distance / 1000).toFixed(1)} km
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatTime(activity.moving_time)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {activity.total_elevation_gain.toFixed(0)} m
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {(activity.average_speed * 3.6).toFixed(1)} km/h
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center gap-1 text-secondary">
                      <Heart className="w-3 h-3" />
                      {activity.kudos_count}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredAndSortedActivities.length)} de {filteredAndSortedActivities.length}
          </p>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {currentPage} / {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
