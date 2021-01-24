import { Pagination } from '@common/util/Page';
import { Role } from '@common/enum/Role.enum';

export interface IOperator {
  id: number;
  username: string;
  password: string;
  telNo: string;
  name: string;
  role: Role;
  salt: string;
  active?: boolean;
  site: string;
}

export interface IOperatorNew {
  username: string;
  password: string;
  telNo: string;
  name: string;
  role: Role;
  salt?: string;
  site?: string;
}

export interface IOperatorUpdate {
  OperatorId: number;
  telNo: string;
  name: string;
  newPassword: string;
  active: boolean;
}

export interface IOperatorProfile {
  id: number;
  username: string;
  telNo: string;
  name: string;
  role: Role;
  active: boolean;
  site?: string;
}

export interface IOperatorAccountFilter {
  pagination: Pagination;
  text?: string; // name username tel_no
  role?: Role;
}

export interface IOperatorAccountSearchBySite {
  pagination: Pagination;
  text?: string; // name username tel_no
}
