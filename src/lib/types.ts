export type Range = { lo: number | null; hi: number | null };

export type Profile = {
  id?: string;
  full_name?: string;
  patient_code?: string;
  dob?: string | null;
  blood_group?: string;
  height_cm?: number | null;
  weight_kg?: number | null;
  role?: string;
  specialty?: string;
  preferred_language?: string;
};

export type DataPoint = {
  test?: string;
  value?: string | number;
  unit?: string;
  normal_range?: string;
  flag?: string;
};

export type RecordRow = {
  id?: string;
  category?: string;
  data_points?: DataPoint[];
  report_date?: string;
  created_at?: string;
  source?: string;
  summary_display?: string;
  summary_en?: string;
};

type SeriesBase = { date: string; unit?: string; nr?: string; flag?: string };
export type DualPoint = SeriesBase & { dual: true; sys: number; dia: number; v?: undefined };
export type SinglePoint = SeriesBase & { dual?: false; v: number; sys?: undefined; dia?: undefined };
export type SeriesPoint = DualPoint | SinglePoint;
export type MetricPoint = { label: string; sys?: number; dia?: number; v?: number };
