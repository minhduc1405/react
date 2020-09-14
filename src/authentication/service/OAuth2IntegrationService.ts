import {AuthResult} from 'authentication-component';
import {IntegrationConfiguration} from '../model/IntegrationConfiguration';
import {OAuth2Info} from '../model/OAuth2Info';

export interface OAuth2IntegrationService {
  getIntegrationConfigurations(): Promise<IntegrationConfiguration[]>;
  getIntegrationConfiguration(sourceType: string): Promise<IntegrationConfiguration>;
  authenticate(auth: OAuth2Info): Promise<AuthResult>;
}
