export const darkTheme = {
  background: 'transparent',
  text: {
    fontSize: 12,
    fill: 'hsl(0, 0%, 65%)',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  axis: {
    domain: {
      line: {
        stroke: 'hsl(0, 0%, 15%)',
        strokeWidth: 1,
      },
    },
    legend: {
      text: {
        fontSize: 12,
        fill: 'hsl(0, 0%, 65%)',
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    },
    ticks: {
      line: {
        stroke: 'hsl(0, 0%, 15%)',
        strokeWidth: 1,
      },
      text: {
        fontSize: 11,
        fill: 'hsl(0, 0%, 65%)',
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    },
  },
  grid: {
    line: {
      stroke: 'hsl(0, 0%, 12%)',
      strokeWidth: 1,
    },
  },
  legends: {
    title: {
      text: {
        fontSize: 11,
        fill: 'hsl(0, 0%, 65%)',
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    },
    text: {
      fontSize: 11,
      fill: 'hsl(0, 0%, 65%)',
      outlineWidth: 0,
      outlineColor: 'transparent',
    },
    ticks: {
      line: {},
      text: {
        fontSize: 10,
        fill: 'hsl(0, 0%, 65%)',
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    },
  },
  annotations: {
    text: {
      fontSize: 13,
      fill: 'hsl(0, 0%, 65%)',
      outlineWidth: 2,
      outlineColor: 'hsl(0, 0%, 0%)',
      outlineOpacity: 1,
    },
    link: {
      stroke: 'hsl(0, 0%, 65%)',
      strokeWidth: 1,
      outlineWidth: 2,
      outlineColor: 'hsl(0, 0%, 0%)',
      outlineOpacity: 1,
    },
    outline: {
      stroke: 'hsl(0, 0%, 65%)',
      strokeWidth: 2,
      outlineWidth: 2,
      outlineColor: 'hsl(0, 0%, 0%)',
      outlineOpacity: 1,
    },
    symbol: {
      fill: 'hsl(0, 0%, 65%)',
      outlineWidth: 2,
      outlineColor: 'hsl(0, 0%, 0%)',
      outlineOpacity: 1,
    },
  },
  tooltip: {
    wrapper: {},
    container: {
      background: 'hsl(0, 0%, 7%)',
      color: 'hsl(0, 0%, 95%)',
      fontSize: 12,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      padding: '8px 12px',
      border: '1px solid hsl(0, 0%, 15%)',
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
