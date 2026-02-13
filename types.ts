import React from 'react';

export interface FeatureItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export enum ComparisonMode {
  SDR = 'SDR',
  HDR = 'HDR'
}