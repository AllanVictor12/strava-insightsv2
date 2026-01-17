const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Configuração do PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || '10.0.1.10',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '367ddb59a52be5105246357b65278779',
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Buscar todas as atividades
app.get('/api/activities', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        distance,
        moving_time,
        elapsed_time,
        total_elevation_gain,
        type,
        sport_type,
        start_date_local,
        average_speed,
        max_speed,
        average_watts,
        kudos_count
      FROM strava_activities
      ORDER BY start_date_local DESC
    `);

    // Converter para o formato esperado pelo frontend
    const activities = result.rows.map(row => ({
      id: Number(row.id),
      name: row.name || 'Atividade sem nome',
      distance: parseFloat(row.distance) || 0,
      moving_time: row.moving_time || 0,
      elapsed_time: row.elapsed_time || 0,
      total_elevation_gain: parseFloat(row.total_elevation_gain) || 0,
      type: row.type || 'Ride',
      sport_type: row.sport_type || row.type || 'Ride',
      start_date_local: row.start_date_local ? new Date(row.start_date_local).toISOString() : new Date().toISOString(),
      average_speed: parseFloat(row.average_speed) || 0,
      max_speed: parseFloat(row.max_speed) || 0,
      average_watts: row.average_watts ? parseFloat(row.average_watts) : undefined,
      kudos_count: row.kudos_count || 0,
    }));

    res.json(activities);
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    res.status(500).json({ error: 'Erro ao buscar atividades', details: error.message });
  }
});

// Buscar estatísticas gerais
app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total_activities,
        COALESCE(SUM(distance), 0) as total_distance,
        COALESCE(SUM(moving_time), 0) as total_time,
        COALESCE(SUM(total_elevation_gain), 0) as total_elevation,
        COALESCE(AVG(average_speed), 0) as avg_speed,
        COALESCE(MAX(max_speed), 0) as max_speed,
        COALESCE(AVG(average_watts), 0) as avg_power,
        COALESCE(SUM(kudos_count), 0) as total_kudos
      FROM strava_activities
    `);

    const stats = result.rows[0];

    res.json({
      totalActivities: parseInt(stats.total_activities),
      totalDistance: parseFloat(stats.total_distance),
      totalTime: parseInt(stats.total_time),
      totalElevation: parseFloat(stats.total_elevation),
      averageSpeed: parseFloat(stats.avg_speed),
      maxSpeed: parseFloat(stats.max_speed),
      averagePower: parseFloat(stats.avg_power),
      totalKudos: parseInt(stats.total_kudos),
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas', details: error.message });
  }
});

// Testar conexão com banco
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as time, COUNT(*) as count FROM strava_activities');
    res.json({
      status: 'connected',
      serverTime: result.rows[0].time,
      activitiesCount: result.rows[0].count
    });
  } catch (error) {
    console.error('Erro ao conectar ao banco:', error);
    res.status(500).json({ error: 'Erro ao conectar ao banco', details: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 API rodando na porta ${port}`);
  console.log(`📊 Conectando ao PostgreSQL em ${process.env.DB_HOST || '10.0.1.10'}:${process.env.DB_PORT || 5432}`);
});
