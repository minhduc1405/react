import {HttpRequest} from 'web-clients';
import config from '../../../config';
import {SignupInfo} from '../../model/SignupInfo';
import {SignupResult} from '../../model/SignupResult';
import {SignupService} from '../SignupService';

export class SignupClient implements SignupService {
  constructor(protected http: HttpRequest) {
  }

  signup(signupInfo: SignupInfo): Promise<SignupResult> {
    const url = config.signupUrl + '/signup/signup';
    return this.http.post<SignupResult>(url, signupInfo);
  }
}
