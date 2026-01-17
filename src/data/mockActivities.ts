import { StravaActivity } from '@/types/activity';

// Gera dados realistas de MTB para demonstração
const generateMockActivities = (): StravaActivity[] => {
  const activities: StravaActivity[] = [];
  const activityTypes = ['MountainBikeRide', 'Ride', 'Walk', 'Run'];
  const mtbNames = [
    'Trilha da Serra', 'Pedal Matinal', 'Subida do Morro', 'Circuito Urbano',
    'Trilha do Parque', 'Desafio das Montanhas', 'Pedal de Fim de Semana',
    'Volta pela Cidade', 'Trilha Radical', 'Pedal Noturno', 'Subida Épica',
    'Descida Técnica', 'Trilha do Vale', 'Pedal Social', 'Treino de Base',
    'Fartlek MTB', 'Intervalado na Serra', 'Recovery Ride', 'Enduro Day',
    'Cross Country', 'All Mountain', 'Pedal com Amigos', 'Solo Adventure'
  ];
  
  const baseDate = new Date();
  
  for (let i = 0; i < 150; i++) {
    const daysAgo = Math.floor(Math.random() * 365);
    const date = new Date(baseDate);
    date.setDate(date.getDate() - daysAgo);
    
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const isMTB = type === 'MountainBikeRide';
    const isRide = type === 'Ride';
    const isWalk = type === 'Walk';
    
    let distance: number;
    let elevation: number;
    let avgSpeed: number;
    
    if (isMTB) {
      distance = 15000 + Math.random() * 50000; // 15-65km
      elevation = 200 + Math.random() * 1200; // 200-1400m
      avgSpeed = 15 + Math.random() * 12; // 15-27 km/h em m/s
    } else if (isRide) {
      distance = 20000 + Math.random() * 80000; // 20-100km
      elevation = 100 + Math.random() * 800;
      avgSpeed = 20 + Math.random() * 15;
    } else if (isWalk) {
      distance = 3000 + Math.random() * 10000; // 3-13km
      elevation = 50 + Math.random() * 300;
      avgSpeed = 4 + Math.random() * 2;
    } else {
      distance = 5000 + Math.random() * 15000; // 5-20km
      elevation = 50 + Math.random() * 400;
      avgSpeed = 8 + Math.random() * 6;
    }
    
    const movingTime = distance / (avgSpeed * 1000 / 3600);
    const elapsedTime = movingTime * (1 + Math.random() * 0.3);
    
    activities.push({
      id: 10000000 + i,
      name: mtbNames[Math.floor(Math.random() * mtbNames.length)] + ` #${i + 1}`,
      distance,
      moving_time: Math.round(movingTime),
      elapsed_time: Math.round(elapsedTime),
      total_elevation_gain: Math.round(elevation),
      type,
      sport_type: type,
      start_date_local: date.toISOString(),
      average_speed: avgSpeed / 3.6, // converter para m/s
      max_speed: (avgSpeed * 1.5) / 3.6,
      average_watts: isMTB || isRide ? 150 + Math.random() * 150 : undefined,
      kudos_count: Math.floor(Math.random() * 50)
    });
  }
  
  return activities.sort((a, b) => 
    new Date(b.start_date_local).getTime() - new Date(a.start_date_local).getTime()
  );
};

export const mockActivities = generateMockActivities();
