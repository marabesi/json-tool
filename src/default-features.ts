import { LayoutOption, Option } from './types/components/Editor';

export interface FeatureOptions {
  options: Option[];
}

export const featureOptionsDefault = (): FeatureOptions => ({ options: [ { title: 'JSON History', active: true } ] });

export const defaultLayout = (): LayoutOption => 'horizontal';