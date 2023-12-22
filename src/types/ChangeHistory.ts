import { UserSimpleDTO } from './User';

type ChangeType = {
  type: 'INSERT' | 'UPDATE';
  description: string;
};
type ChangeValue = {
  attribute: string;
  previousValue: string;
  newValue: string;
};
export type ChangeHistory = {
  date: string;
  changedBy: UserSimpleDTO;
  changeType: ChangeType;
  changes: ChangeValue[];
};
