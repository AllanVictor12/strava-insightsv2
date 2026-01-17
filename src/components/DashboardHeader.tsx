import { RefreshCw, Menu, Maximize, Share2, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardHeaderProps {
  lastUpdate: Date;
  onRefresh: () => void;
  onToggleSidebar: () => void;
  isRefreshing: boolean;
}

export const DashboardHeader = ({ 
  lastUpdate, 
  onRefresh, 
  onToggleSidebar,
  isRefreshing 
}: DashboardHeaderProps) => {
  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };
  
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            className="lg:hidden"
            onClick={onToggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <svg className="w-6 h-6 text-secondary-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MTB Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                Última atualização: {format(lastUpdate, "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="hidden sm:flex"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="sm:hidden"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleFullscreen}
            className="hidden md:flex"
            title="Tela cheia"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
