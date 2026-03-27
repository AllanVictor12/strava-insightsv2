import type { Theme } from '@nivo/core';

export const darkTheme: Theme = {
  background: 'transparent',
  text: {
    fontSize: 12,
    fill: 'hsl(215, 20%, 65%)',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  axis: {
    domain: {
      line: {
        stroke: 'hsl(222, 47%, 18%)',
        strokeWidth: 1,
      },
    },
    legend: {
      text: {
        fontSize: 12,
        fill: 'hsl(215, 20%, 65%)',
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    },
    ticks: {
      line: {
        stroke: 'hsl(222, 47%, 18%)',
        strokeWidth: 1,
      },
      text: {
        fontSize: 11,
        fill: 'hsl(215, 20%, 65%)',
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    },
  },
  grid: {
    line: {
      stroke: 'hsl(222, 47%, 15%)',
      strokeWidth: 1,
    },
  },
  legends: {
    title: {
      text: {
        fontSize: 11,
        fill: 'hsl(215, 20%, 65%)',
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    },
    text: {
      fontSize: 11,
      fill: 'hsl(215, 20%, 65%)',
      outlineWidth: 0,
      outlineColor: 'transparent',
    },
    ticks: {
      line: {},
      text: {
        fontSize: 10,
        fill: 'hsl(215, 20%, 65%)',
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    },
  },
  annotations: {
    text: {
      fontSize: 13,
      fill: 'hsl(215, 20%, 65%)',
      outlineWidth: 2,
      outlineColor: 'hsl(222, 47%, 6%)',
      outlineOpacity: 1,
    },
    link: {
      stroke: 'hsl(215, 20%, 65%)',
      strokeWidth: 1,
      outlineWidth: 2,
      outlineColor: 'hsl(222, 47%, 6%)',
      outlineOpacity: 1,
    },
    outline: {
      stroke: 'hsl(215, 20%, 65%)',
      strokeWidth: 2,
      outlineWidth: 2,
      outlineColor: 'hsl(222, 47%, 6%)',
      outlineOpacity: 1,
    },
    symbol: {
      fill: 'hsl(215, 20%, 65%)',
      outlineWidth: 2,
      outlineColor: 'hsl(222, 47%, 6%)',
      outlineOpacity: 1,
    },
  },
  tooltip: {
    wrapper: {},
    container: {
      background: 'hsl(222, 47%, 10%)',
      color: 'hsl(210, 40%, 98%)',
      fontSize: 12,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      padding: '8px 12px',
      border: '1px solid hsl(222, 47%, 18%)',
    },
    basic: {},
    chip: {},
    table: {},
    tableCell: {},
    tableCellValue: {},
  },
};

export const chartColors = {
  primary: 'hsl(198, 93%, 59%)',
  strava: 'hsl(24, 100%, 50%)',
  success: 'hsl(142, 71%, 45%)',
  purple: 'hsl(262, 83%, 58%)',
  warning: 'hsl(47, 95%, 53%)',
};

export const CHART_PALETTE = [
  chartColors.primary,
  chartColors.strava,
  chartColors.success,
  chartColors.purple,
  chartColors.warning,
];
