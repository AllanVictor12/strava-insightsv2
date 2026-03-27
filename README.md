# Strava Insights - MTB Dashboard

Dashboard pessoal para visualizar e analisar atividades do Strava, com foco em Mountain Bike.

**Live**: [mtb.alanvictor.cloud](https://mtb.alanvictor.cloud)

## Features

- Conexao com a API do Strava (OAuth2)
- KPIs: distancia total, tempo, elevacao, velocidade media/maxima, potencia, kudos
- Recordes pessoais (maior distancia, maior velocidade, maior elevacao, etc.)
- Graficos interativos com Nivo:
  - Evolucao da velocidade media mensal (pedal)
  - Distancia mensal
  - Top 10 maiores pedais
  - Top 10 mais rapidos
  - Distribuicao por tipo de atividade
  - Distancia vs Velocidade (scatter com elevacao)
  - Heatmap de atividades por dia
- Filtros por tipo de atividade (MTB, Caminhada) e periodo
- Tema dark otimizado
- Responsivo (mobile-first)

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Nivo (bar, line, pie, scatter, calendar)
- **Backend**: Express + PostgreSQL (cache de atividades)
- **Deploy**: Docker (Alpine) + Nginx + Traefik (Docker Swarm)

## Desenvolvimento Local

```sh
# Instalar dependencias
npm install

# Rodar em dev
npm run dev
```

Variaveis de ambiente necessarias:

```env
VITE_STRAVA_CLIENT_ID=
VITE_STRAVA_CLIENT_SECRET=
VITE_STRAVA_REDIRECT_URI=
DB_HOST=localhost
DB_PORT=5432
DB_NAME=strava
DB_USER=strava
DB_PASSWORD=
```

## Deploy (Docker Swarm)

```sh
docker build -t strava-insights .
docker stack deploy -c docker-compose.yml strava
```

## Autor

**Alan Victor** - [github.com/AllanVictor12](https://github.com/AllanVictor12)
