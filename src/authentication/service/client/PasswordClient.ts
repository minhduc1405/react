import {PasswordChange} from 'password-component';
import {PasswordReset} from 'password-component';
import {PasswordService} from 'password-component';
import {HttpRequest} from 'web-clients';
import config from '../../../config';

export class PasswordClient implements PasswordService {
  constructor(protected http: HttpRequest) {
  }
  serviceUrl = config.passwordUrl + '/' + 'password';
  forgotPassword(email: string): Promise<boolean> {
    const url = this.serviceUrl + '/forgot';
    return this.http.post<boolean>(url, {'email': email});
  }
  resetPassword(pass: PasswordReset): Promise<boolean|number> {
    const url = this.serviceUrl + '/reset';
    return this.http.post<boolean>(url, pass);
  }
  changePassword(pass: PasswordChange): Promise<boolean|number> {
    const url = this.serviceUrl + '/change';
    return this.http.post<number>(url, pass);
  }
}
