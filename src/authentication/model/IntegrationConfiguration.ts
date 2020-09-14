export class IntegrationConfiguration {
  integrationConfigurationId: string;
  sourceType: string;
  oauth2Link: string;
  clientId: string;
  scope: string;
  redirectUri: string;
  accessTokenLink: string;
  clientSecret: string;
  // remove all below
  status: string;
  createdBy: string;
  createdDate: Date;
  modifiedBy: string;
  modifiedDate: Date;
  active: boolean;
  rowVersion: number;
}
