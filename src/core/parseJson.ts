import { JsonValue } from './jsonToTable';

export interface ParseResult {
  data?: JsonValue;
  error: string;
}

export function parseJson(value: string): ParseResult {
  if (value.trim() === '') {
    return { error: '' };
  }

  try {
    return { data: JSON.parse(value) as JsonValue, error: '' };
  } catch {
    return { error: 'invalid json' };
  }
}
