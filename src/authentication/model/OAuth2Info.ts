import {SigninType} from './SigninType';

export interface OAuth2Info {
  sourceType: SigninType;

  code: string;
  redirectUri: string;
  invitationMail?: string;
  isLink?: boolean;
}
