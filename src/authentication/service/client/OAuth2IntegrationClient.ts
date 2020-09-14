import {AuthResult} from 'authentication-component';
import {HttpRequest} from 'web-clients';
import config from '../../../config';
import {IntegrationConfiguration} from '../../model/IntegrationConfiguration';
import {OAuth2Info} from '../../model/OAuth2Info';
import {OAuth2IntegrationService} from '../OAuth2IntegrationService';

export class OAuth2IntegrationClient implements OAuth2IntegrationService {
  constructor(protected http: HttpRequest) {
  }
  private serviceUrl = config.authenticationUrl;

  getIntegrationConfigurations(): Promise<IntegrationConfiguration[]> {
    const url = this.serviceUrl  + '/integrationConfigurations';
    return this.http.get<IntegrationConfiguration[]>(url);
  }

  getIntegrationConfiguration(sourceType: string): Promise<IntegrationConfiguration> {
    const url = this.serviceUrl  + '/integrationConfigurations/' + sourceType;
    return this.http.get<IntegrationConfiguration>(url);
  }

  authenticate(auth: OAuth2Info): Promise<AuthResult> {
    const url = this.serviceUrl + '/oauth2/authenticate';
    return this.http.post<AuthResult>(url, auth);
  }
}
