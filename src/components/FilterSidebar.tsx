import { useState } from 'react';
import { Calendar, Filter, Bike, Mountain, Gauge, Route, X, ChevronDown } from 'lucide-react';
import { 
  FilterState, 
  DateFilter, 
  ActivityType, 
  DistanceFilter, 
  SpeedFilter, 
  ElevationFilter 
} from '@/types/activity';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

const dateFilterOptions: { value: DateFilter; label: string }[] = [
  { value: 'today', label: 'Hoje' },
  { value: 'yesterday', label: 'Ontem' },
  { value: 'last7days', label: 'Últimos 7 dias' },
  { value: 'last4weeks', label: 'Últimas 4 semanas' },
  { value: 'lastMonth', label: 'Último mês' },
  { value: 'last3months', label: 'Últimos 3 meses' },
  { value: 'last6months', label: 'Últimos 6 meses' },
  { value: 'thisYear', label: 'Este ano' },
  { value: 'lastYear', label: 'Ano anterior' },
  { value: 'allTime', label: 'Todo o período' },
  { value: 'custom', label: 'Período personalizado' },
];

const activityTypeOptions: { value: ActivityType; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'MTB', label: 'MTB' },
  { value: 'Caminhada', label: 'Caminhada' },
];

const distanceOptions: { value: DistanceFilter; label: string }[] = [
  { value: 'all', label: 'Todos os pedais' },
  { value: 'short', label: '< 20km (Curto)' },
  { value: 'medium', label: '20-40km (Médio)' },
  { value: 'long', label: '40-60km (Longo)' },
  { value: 'veryLong', label: '> 60km (Muito longo)' },
];

const speedOptions: { value: SpeedFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'below15', label: '< 15 km/h' },
  { value: '15to20', label: '15-20 km/h' },
  { value: '20to25', label: '20-25 km/h' },
  { value: 'above25', label: '> 25 km/h' },
];

const elevationOptions: { value: ElevationFilter; label: string }[] = [
  { value: 'all', label: 'Qualquer elevação' },
  { value: 'flat', label: 'Plano (< 200m)' },
  { value: 'moderate', label: 'Moderado (200-500m)' },
  { value: 'mountainous', label: 'Montanhoso (500-1000m)' },
  { value: 'extreme', label: 'Extremo (> 1000m)' },
];

export const FilterSidebar = ({ filters, onFiltersChange, isOpen, onClose }: FilterSidebarProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };
  
  const resetFilters = () => {
    const defaultFilters: FilterState = {
      dateFilter: 'thisYear',
      activityType: 'all',
      distanceFilter: 'all',
      speedFilter: 'all',
      elevationFilter: 'all'
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };
  
  const activeFiltersCount = [
    filters.dateFilter !== 'thisYear',
    filters.activityType !== 'all',
    filters.distanceFilter !== 'all',
    filters.speedFilter !== 'all',
    filters.elevationFilter !== 'all'
  ].filter(Boolean).length;
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-card border-r border-border",
        "transform transition-transform duration-300 ease-in-out",
        "lg:transform-none lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Filtros</h2>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Date Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                Período
              </label>
              <Select 
                value={localFilters.dateFilter} 
                onValueChange={(value) => updateFilter('dateFilter', value as DateFilter)}
              >
                <SelectTrigger className="w-full bg-muted/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateFilterOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {localFilters.dateFilter === 'custom' && (
                <div className="space-y-2 mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        {localFilters.customDateStart 
                          ? format(localFilters.customDateStart, "dd/MM/yyyy", { locale: ptBR })
                          : "Data inicial"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarPicker
                        mode="single"
                        selected={localFilters.customDateStart}
                        onSelect={(date) => updateFilter('customDateStart', date)}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        {localFilters.customDateEnd 
                          ? format(localFilters.customDateEnd, "dd/MM/yyyy", { locale: ptBR })
                          : "Data final"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarPicker
                        mode="single"
                        selected={localFilters.customDateEnd}
                        onSelect={(date) => updateFilter('customDateEnd', date)}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
            
            {/* Activity Type */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Bike className="w-4 h-4 text-primary" />
                Tipo de Atividade
              </label>
              <Select 
                value={localFilters.activityType} 
                onValueChange={(value) => updateFilter('activityType', value as ActivityType)}
              >
                <SelectTrigger className="w-full bg-muted/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activityTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Distance */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Route className="w-4 h-4 text-primary" />
                Distância
              </label>
              <Select 
                value={localFilters.distanceFilter} 
                onValueChange={(value) => updateFilter('distanceFilter', value as DistanceFilter)}
              >
                <SelectTrigger className="w-full bg-muted/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {distanceOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Speed */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Gauge className="w-4 h-4 text-primary" />
                Velocidade Média
              </label>
              <Select 
                value={localFilters.speedFilter} 
                onValueChange={(value) => updateFilter('speedFilter', value as SpeedFilter)}
              >
                <SelectTrigger className="w-full bg-muted/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {speedOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Elevation */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Mountain className="w-4 h-4 text-primary" />
                Elevação
              </label>
              <Select 
                value={localFilters.elevationFilter} 
                onValueChange={(value) => updateFilter('elevationFilter', value as ElevationFilter)}
              >
                <SelectTrigger className="w-full bg-muted/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {elevationOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={resetFilters}
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
