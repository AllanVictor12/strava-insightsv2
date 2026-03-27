import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  StravaActivity,
  FilterState,
  DashboardStats,
  PersonalRecord
} from '@/types/activity';
import {
  startOfDay,
  endOfDay,
  subDays,
  subWeeks,
  subMonths,
  startOfYear,
  endOfYear,
  subYears,
  isWithinInterval,
  format
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

// URL da API - em produção usa caminho relativo, em dev usa localhost
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

const fetchActivities = async (): Promise<StravaActivity[]> => {
  const response = await fetch(`${API_URL}/activities`);
  if (!response.ok) {
    throw new Error('Erro ao buscar atividades');
  }
  return response.json();
};

export const useActivities = (filters: FilterState) => {
  const { data: allActivities = [], isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });

  const filteredActivities = useMemo(() => {
    if (allActivities.length === 0) return [];

    const now = new Date();
    let dateStart: Date;
    let dateEnd: Date = endOfDay(now);

    switch (filters.dateFilter) {
      case 'today':
        dateStart = startOfDay(now);
        break;
      case 'yesterday':
        dateStart = startOfDay(subDays(now, 1));
        dateEnd = endOfDay(subDays(now, 1));
        break;
      case 'last7days':
        dateStart = startOfDay(subDays(now, 7));
        break;
      case 'last4weeks':
        dateStart = startOfDay(subWeeks(now, 4));
        break;
      case 'lastMonth':
        dateStart = startOfDay(subMonths(now, 1));
        break;
      case 'last3months':
        dateStart = startOfDay(subMonths(now, 3));
        break;
      case 'last6months':
        dateStart = startOfDay(subMonths(now, 6));
        break;
      case 'thisYear':
        dateStart = startOfYear(now);
        break;
      case 'lastYear':
        dateStart = startOfYear(subYears(now, 1));
        dateEnd = endOfYear(subYears(now, 1));
        break;
      case 'allTime':
        dateStart = new Date(2000, 0, 1);
        break;
      case 'custom':
        dateStart = filters.customDateStart || startOfYear(now);
        dateEnd = filters.customDateEnd || endOfDay(now);
        break;
      default:
        dateStart = startOfYear(now);
    }

    return allActivities.filter(activity => {
      const activityDate = new Date(activity.start_date_local);

      // Filtro de data
      if (!isWithinInterval(activityDate, { start: dateStart, end: dateEnd })) {
        return false;
      }

      // Filtro de tipo (agrupado)
      if (filters.activityType === 'MTB') {
        if (activity.sport_type !== 'MountainBikeRide' && activity.sport_type !== 'Ride') {
          return false;
        }
      } else if (filters.activityType === 'Caminhada') {
        if (activity.sport_type !== 'Walk' && activity.sport_type !== 'Run') {
          return false;
        }
      }

      // Filtro de distância (em km)
      const distanceKm = activity.distance / 1000;
      switch (filters.distanceFilter) {
        case 'short':
          if (distanceKm >= 20) return false;
          break;
        case 'medium':
          if (distanceKm < 20 || distanceKm >= 40) return false;
          break;
        case 'long':
          if (distanceKm < 40 || distanceKm >= 60) return false;
          break;
        case 'veryLong':
          if (distanceKm < 60) return false;
          break;
      }

      // Filtro de velocidade (em km/h)
      const speedKmh = activity.average_speed * 3.6;
      switch (filters.speedFilter) {
        case 'below15':
          if (speedKmh >= 15) return false;
          break;
        case '15to20':
          if (speedKmh < 15 || speedKmh >= 20) return false;
          break;
        case '20to25':
          if (speedKmh < 20 || speedKmh >= 25) return false;
          break;
        case 'above25':
          if (speedKmh < 25) return false;
          break;
      }

      // Filtro de elevação
      switch (filters.elevationFilter) {
        case 'flat':
          if (activity.total_elevation_gain >= 200) return false;
          break;
        case 'moderate':
          if (activity.total_elevation_gain < 200 || activity.total_elevation_gain >= 500) return false;
          break;
        case 'mountainous':
          if (activity.total_elevation_gain < 500 || activity.total_elevation_gain >= 1000) return false;
          break;
        case 'extreme':
          if (activity.total_elevation_gain < 1000) return false;
          break;
      }

      return true;
    });
  }, [filters, allActivities]);

  const stats: DashboardStats = useMemo(() => {
    if (filteredActivities.length === 0) {
      return {
        totalDistance: 0,
        totalTime: 0,
        totalElevation: 0,
        totalActivities: 0,
        averageSpeed: 0,
        maxSpeed: 0,
        averageDistancePerActivity: 0,
        averagePower: 0,
        averageElevationPerActivity: 0,
        totalKudos: 0
      };
    }

    const totalDistance = filteredActivities.reduce((sum, a) => sum + a.distance, 0);
    const totalTime = filteredActivities.reduce((sum, a) => sum + a.moving_time, 0);
    const totalElevation = filteredActivities.reduce((sum, a) => sum + a.total_elevation_gain, 0);
    const totalKudos = filteredActivities.reduce((sum, a) => sum + a.kudos_count, 0);

    const activitiesWithPower = filteredActivities.filter(a => a.average_watts);
    const avgPower = activitiesWithPower.length > 0
      ? activitiesWithPower.reduce((sum, a) => sum + (a.average_watts || 0), 0) / activitiesWithPower.length
      : 0;

    const avgSpeed = filteredActivities.reduce((sum, a) => sum + a.average_speed, 0) / filteredActivities.length;
    const maxSpeed = Math.max(...filteredActivities.map(a => a.max_speed));

    return {
      totalDistance,
      totalTime,
      totalElevation,
      totalActivities: filteredActivities.length,
      averageSpeed: avgSpeed * 3.6, // m/s para km/h
      maxSpeed: maxSpeed * 3.6,
      averageDistancePerActivity: totalDistance / filteredActivities.length,
      averagePower: avgPower,
      averageElevationPerActivity: totalElevation / filteredActivities.length,
      totalKudos
    };
  }, [filteredActivities]);

  const personalRecords: PersonalRecord[] = useMemo(() => {
    if (filteredActivities.length === 0) return [];

    const maxDistance = filteredActivities.reduce((max, a) =>
      a.distance > max.distance ? a : max, filteredActivities[0]);

    const maxSpeedActivity = filteredActivities.reduce((max, a) =>
      a.max_speed > max.max_speed ? a : max, filteredActivities[0]);

    const maxElevation = filteredActivities.reduce((max, a) =>
      a.total_elevation_gain > max.total_elevation_gain ? a : max, filteredActivities[0]);

    const longestTime = filteredActivities.reduce((max, a) =>
      a.moving_time > max.moving_time ? a : max, filteredActivities[0]);

    const maxKudos = filteredActivities.reduce((max, a) =>
      a.kudos_count > max.kudos_count ? a : max, filteredActivities[0]);

    return [
      {
        title: 'Maior Distância',
        value: `${(maxDistance.distance / 1000).toFixed(1)} km`,
        activityName: maxDistance.name,
        date: format(new Date(maxDistance.start_date_local), "dd 'de' MMM, yyyy", { locale: ptBR }),
        icon: 'route'
      },
      {
        title: 'Velocidade Máxima',
        value: `${(maxSpeedActivity.max_speed * 3.6).toFixed(1)} km/h`,
        activityName: maxSpeedActivity.name,
        date: format(new Date(maxSpeedActivity.start_date_local), "dd 'de' MMM, yyyy", { locale: ptBR }),
        icon: 'zap'
      },
      {
        title: 'Maior Elevação',
        value: `${maxElevation.total_elevation_gain.toFixed(0)} m`,
        activityName: maxElevation.name,
        date: format(new Date(maxElevation.start_date_local), "dd 'de' MMM, yyyy", { locale: ptBR }),
        icon: 'mountain'
      },
      {
        title: 'Pedal Mais Longo',
        value: `${Math.floor(longestTime.moving_time / 3600)}h ${Math.floor((longestTime.moving_time % 3600) / 60)}min`,
        activityName: longestTime.name,
        date: format(new Date(longestTime.start_date_local), "dd 'de' MMM, yyyy", { locale: ptBR }),
        icon: 'clock'
      },
      {
        title: 'Mais Kudos',
        value: `${maxKudos.kudos_count} kudos`,
        activityName: maxKudos.name,
        date: format(new Date(maxKudos.start_date_local), "dd 'de' MMM, yyyy", { locale: ptBR }),
        icon: 'heart'
      }
    ];
  }, [filteredActivities]);

  return {
    activities: filteredActivities,
    stats,
    personalRecords,
    isLoading,
    error
  };
};
