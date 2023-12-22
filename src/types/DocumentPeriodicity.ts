import moment, { Moment } from 'moment';
import { getPeriodBetweenDates } from '../services/ObjectsUtils';

export enum PeriodicidadeDocumento {
  DIA = 'DIA',
  SEMANA = 'SEMANA',
  MES = 'MES',
  TRIMESTRE = 'TRIMESTRE',
  SEMESTRE = 'SEMESTRE',
  ANO = 'ANO',
}
const strategiesPeriod = {
  [PeriodicidadeDocumento.DIA]: {
    getPeriod: (init: Moment, end?: Moment, maxArray?: number, repeat?: number) =>
      getPeriodBetweenDates('day', init, end, maxArray, repeat),
  },
  [PeriodicidadeDocumento.SEMANA]: {
    getPeriod: (init: Moment, end?: Moment, maxArray?: number, repeat?: number) =>
      getPeriodBetweenDates('week', init, end, maxArray, repeat),
  },
  [PeriodicidadeDocumento.MES]: {
    getPeriod: (init: Moment, end?: Moment, maxArray?: number, repeat?: number) =>
      getPeriodBetweenDates('month', init, end, maxArray, repeat),
  },
  [PeriodicidadeDocumento.TRIMESTRE]: {
    getPeriod: (init: Moment, end?: Moment, maxArray?: number, repeat?: number) =>
      getPeriodBetweenDates('month', init, end, maxArray, repeat, 3),
  },
  [PeriodicidadeDocumento.SEMESTRE]: {
    getPeriod: (init: Moment, end?: Moment, maxArray?: number, repeat?: number) =>
      getPeriodBetweenDates('month', init, end, maxArray, repeat, 6),
  },
  [PeriodicidadeDocumento.ANO]: {
    getPeriod: (init: Moment, end?: Moment, maxArray?: number, repeat?: number) =>
      getPeriodBetweenDates('year', init, end, maxArray, repeat),
  },
};
export const getInterval = (
  typePerido: PeriodicidadeDocumento,
  init: Moment,
  end?: Moment,
  maxArray?: number,
  repeat = 1
) => {
  const stra = strategiesPeriod[typePerido];
  if (!stra) throw new Error(`Invalid operation type: ${typePerido}`);
  return stra.getPeriod(init, end, maxArray, repeat);
};
const strDisplayPeriod = {
  [PeriodicidadeDocumento.DIA]: {
    getDisplayPeriodicade: (m: Moment): string => m.format('L'),
  },
  [PeriodicidadeDocumento.SEMANA]: {
    getDisplayPeriodicade: (m: Moment): string =>
      `${m.startOf('w').format('L')} - ${m.endOf('w').format('L')}`,
  },
  [PeriodicidadeDocumento.MES]: {
    getDisplayPeriodicade: (m: Moment): string => m.format('MMMM / YYYY'),
  },
  [PeriodicidadeDocumento.TRIMESTRE]: {
    getDisplayPeriodicade: (m: Moment): string => `${m.quarter()}º / ${m.year()}`,
  },
  [PeriodicidadeDocumento.SEMESTRE]: {
    getDisplayPeriodicade: (m: Moment): string => `${m.month() / 6 < 1 ? 1 : 2}º / ${m.year()}`,
  },
  [PeriodicidadeDocumento.ANO]: {
    getDisplayPeriodicade: (m: Moment): string => m.format('YYYY'),
  },
};
export const getDisplayPeriodicade = (data: string, typePerido: PeriodicidadeDocumento): string => {
  const stra = strDisplayPeriod[typePerido];
  if (!stra) throw new Error(`Invalid operation type: ${typePerido}`);
  return stra.getDisplayPeriodicade(moment(data));
};
