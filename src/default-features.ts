import { Option } from './types/components/Editor';

export interface FeatureOptions {
  options: Option[];
}

export const featureOptionsDefault = (): FeatureOptions => ({ options: [ { title: 'JSON History', active: true } ] });