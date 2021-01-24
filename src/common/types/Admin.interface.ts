import { Role } from '@common/enum/Role.enum';

export interface IAdmin {
  id: number;
  username: string;
  password: string;
  telNo: string;
  detail: IAdminDetail;
  salt: string;
}

export interface IAdminDetail {
  role: Role;
}

export interface IAdminNew {
  username: string;
  password: string;
  telNo: string;
  role: Role;
  salt?: string;
}

export interface IAdminLogin {
  username: string;
  password: string;
  rememberMe?: boolean;

}

export interface IAdminProfile {
  username: string;
  telNo: string;
  role: Role;
}
