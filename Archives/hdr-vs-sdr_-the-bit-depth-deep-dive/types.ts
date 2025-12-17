export enum ColorMode {
  SDR = 'SDR',
  HDR = 'HDR'
}

export interface DataPoint {
  value: number;
  frequency: number;
}

export interface GradientStop {
  offset: number;
  color: string;
}