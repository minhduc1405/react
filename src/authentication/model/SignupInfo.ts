export enum Gender {
  Male = 'M',
  Female = 'F',
  Unknown = 'U',
}

export interface SignupInfo {
  username: string;
  password: string;
  contact?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  gender?: Gender;
  dateOfBirth?: Date;
}
