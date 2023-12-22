import { useState } from 'react';

export interface AlertDefaultProps {
  color?: string;
  msg: string;
  title?: string;
  type: 'error' | 'info' | 'warning' | 'success' | 'loading';
}
export const useAlert = (initial?: AlertDefaultProps) =>
  useState<AlertDefaultProps | undefined>(initial);
