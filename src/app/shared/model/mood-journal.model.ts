export type User = {
  id?: number;
  username: string;
  image?: string;
};

export type EmotionDTO = {
  id?: number;
  name: string;
  icon?: string;
  score: number;
};

export type ActivityDTO = {
  id?: number;
  userId?: number;
  name: string;
  icon?: string;
};

export type MoodDTO = {
  id?: number;
  userId: number;
  date: string;
  emotionId: number;
  note: string;
  activities: number[];
};

export type Mood = MoodDTO & {
  activities: ActivityDTO[];
  emotion: EmotionDTO;
  time: string;
};

export const DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    customDateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const DATE_FORMATS2 = {
  display: {
    dateInput: 'MMMM YYYY',
    customDateInput: 'MM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const DATE_FORMATS3 = {
  display: {
    dateInput: 'D MMMM YYYY  hh:mm A',
    customDateInput: 'MM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const date_db_format = 'yyyy-MM-DD HH:mm:ss';
export const date_db_short_format = 'yyyy-MM-DD';
export const date_key_format = 'DD MMMM yyyy';
export const date_display_shortdate_format = 'D MMMM';
export const date_time_format = 'HH:mm';

export const EMOTIONS = {
  1: { name: 'awful', color: 'red', display: 'Awful' },
  2: { name: 'bad', color: '#f2b226', display: 'Bad' },
  3: { name: 'meh', color: '#4894db', display: 'Meh' },
  4: { name: 'good', color: '#61be04', display: 'Good' },
  5: { name: 'rad', color: '#119674', display: 'Rad' },
};
