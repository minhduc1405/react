import {AuthenticationService} from 'authentication-component';
import {AuthenticationWebClient} from 'authentication-component';
import axios from 'axios';
import {HttpRequest} from 'axios-core';
import {PasswordService} from 'password-component';
import config from 'src/config';
import {httpOptionsService} from 'uione';
import {OAuth2IntegrationClient} from '../service/client/OAuth2IntegrationClient';
import {PasswordClient} from '../service/client/PasswordClient';
import {SignupClient} from '../service/client/SignupClient';
import {OAuth2IntegrationService} from '../service/OAuth2IntegrationService';
import {SignupService} from '../service/SignupService';

class ApplicationContext {
  private readonly httpRequest = new HttpRequest(axios, httpOptionsService);
  readonly signupService: SignupService = new SignupClient(this.httpRequest);
  readonly authenticationService: AuthenticationService = new AuthenticationWebClient(this.httpRequest, config.authenticationUrl + '/authentication/authenticate');
  readonly passwordService: PasswordService = new PasswordClient(this.httpRequest);
  readonly oauth2Service: OAuth2IntegrationService = new OAuth2IntegrationClient(this.httpRequest);
}

export const applicationContext = new ApplicationContext();
