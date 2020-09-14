import {handleCookie, initFromCookie, store, validate} from 'authentication-component';
import {AuthStatus} from 'authentication-component';
import {AuthInfo} from 'authentication-component';
import {AuthResult} from 'authentication-component';
import {AuthenticationService} from 'authentication-component';
import {CookieService, DefaultCookieService} from 'cookie-core';
import {Base64} from 'js-base64';
import * as React from 'react';
import {HistoryProps, navigate} from 'react-onex';
import {alertError, alertInfo} from 'ui-alert';
import {initForm, initMaterial, storage} from 'uione';
import {ResourceService} from 'uione';
import {applicationContext} from '../config/ApplicationContext';
import {BaseComponent, InternalState} from './BaseComponent';
import './signin.css';

interface SigninState extends InternalState {
  user: AuthInfo;
  remember: boolean;
  cookieService: CookieService;
}

export class SigninForm extends BaseComponent<HistoryProps, SigninState> {
  constructor(props) {
    super(props, storage.resource(), alertError, storage.loading());
    this.signin = this.signin.bind(this);
    this.signup = this.signup.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.authenticationService = applicationContext.authenticationService;
    const cookieService = new DefaultCookieService(document);
    let remember = false;
    const user = {
      username: '',
      passcode: '',
      password: ''
    };
    remember = initFromCookie('data', user, cookieService, Base64);
    this.state = {
      user,
      remember,
      cookieService,
      message: ''
    };
  }
  private authenticationService: AuthenticationService;
  componentDidMount() {
    this.form = initForm(this.ref.current, initMaterial);
  }
  forgotPassword() {
    navigate(this.props.history, '/auth/forgot-password');
  }

  signup() {
    navigate(this.props.history, '/auth/signup');
  }

  protected updateRemember = (e: any) => {
    e.preventDefault();
    const objSet = {};
    objSet['remember'] = !this.state.remember;
    this.setState(objSet);
  }
  succeed(result: AuthResult) {
    store(result.user, storage, storage);
    this.navigateToHome();
  }
  protected navigateToHome() {
    const redirect = window.location.search;
    if (redirect) {
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(url.search);
      this.props.history.push(searchParams.get('redirect'));
    } else {
      this.props.history.push(storage.home);
    }
  }
  async signin(event: any) {
    event.preventDefault();
    const r = storage.resource();
    const user = this.state.user;
    if (!validate(user, r, this.showError)) {
      return;
    } else {
      this.hideMessage();
    }
    const cookieService = this.state.cookieService;
    const remember = this.state.remember;
    try {
      if (this.loading) {
        this.loading.showLoading();
      }
      const result = await this.authenticationService.authenticate(user);
      const status = result.status;
      if (status === AuthStatus.TwoFactorRequired) {
        user.step = 1;
        const objSet = {};
        objSet[this.name()] = user;
        this.setState(objSet);
        // this.setState({isTwoFactor: true});
      } else if (status === AuthStatus.Success || status === AuthStatus.SuccessAndReactivated) {
        handleCookie('data', user, remember, cookieService, 60 * 24 * 3, Base64);
        const expiredDays = dayDiff(result.user.passwordExpiredTime, new Date());
        if (expiredDays > 0) {
          const msg = r.format(r.value('msg_password_expired_soon'), expiredDays);
          storage.toast().showToast(msg);
        }
// tslint:disable-next-line: triple-equals
        if (status == AuthStatus.Success) {
          this.succeed(result);
        } else {
          alertInfo(r.value('msg_account_reactivated'), r.value('info'), () => {
            this.succeed(result);
          });
        }
      } else {
        store(null, storage, storage);
        const msg = getMessage(status, r);
        this.showError(msg);
      }
    } catch (err) {
      this.handleError(err);
    } finally {
      if (this.loading) {
        this.loading.hideLoading();
      }
    }
  }

  render() {
    const resource = storage.getResource();
    const user = this.state.user;
    const isTwoFactor = (user.step === 1);
    return (
      <div className='view-container central-full sign-in-view-container'>
        <form id='signinForm' name='signinForm' noValidate={true} autoComplete='off' ref={this.ref}>
          <div>
            {/* <img className='logo' src={logo} /> */}
            <h2>{resource.signin}</h2>
            <div className={'message ' + this.alertClass}>
              {this.state.message}
              <span onClick={this.hideMessage} hidden={!this.state.message || this.state.message === ''}/>
            </div>
            <label>
              {resource.username}
              <input type='text'
                id='username' name='username'
                value={user.username}
                placeholder={resource.placeholder_username}
                onChange={this.updateState}
                maxLength={255} required={true} />
            </label>
            <label hidden={isTwoFactor}>
              {resource.password}
              <input type='password'
                id='password' name='password'
                value={user.password}
                placeholder={resource.placeholder_password}
                onChange={this.updateState}
                maxLength={255} required={!isTwoFactor} />
            </label>
            <label hidden={!isTwoFactor}>
              {resource.passcode}
              <input type='password'
               id='passcode' name='passcode'
               value={user.passcode}
               placeholder={resource.placeholder_passcode}
               onChange={this.updateState}
               maxLength={255} required={isTwoFactor} />
            </label>
            <label className='col s12 checkbox-container'>
              <input type='checkbox'
                id='remember' name='remember'
                checked={this.state.remember ? true : false}
                onChange={this.updateRemember} />
              {resource.signin_remember_me}
            </label>
            <button type='submit' id='btnSignin' name='btnSignin'
              onClick={this.signin}>{resource.button_signin}</button>
            <a id='btnForgotPassword' onClick={this.forgotPassword}>{resource.forgot_password}</a>
            <a id='btnSignup' onClick={this.signup}>{resource.signup}</a>
          </div>
        </form>
      </div>
    );
  }
}

export function getMessage(status: AuthStatus, r: ResourceService): string {
  switch (status) {
    case AuthStatus.Fail:
      return r.value('fail_authentication');
    case AuthStatus.WrongPassword:
      return r.value('fail_wrong_password');
    case AuthStatus.AccessTimeLocked:
      return r.value('fail_access_time_locked');
    case AuthStatus.PasswordExpired:
      return r.value('fail_expired_password');
    case AuthStatus.Suspended:
      return r.value('fail_suspended_account');
    case AuthStatus.Locked:
      return r.value('fail_locked_account');
    case AuthStatus.Disabled:
      return r.value('fail_disabled_account');
    default:
      return r.value('fail_authentication');
  }
}

export function dayDiff(start: Date, end: Date): number {
  if (!start || !end) {
    return null;
  }
  return Math.floor(Math.abs((start.getTime() - end.getTime()) / 86400000));
}
