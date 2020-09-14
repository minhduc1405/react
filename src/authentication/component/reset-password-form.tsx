import {PasswordReset} from 'password-component';
import {PasswordService} from 'password-component';
import * as React from 'react';
import {HistoryProps, navigate} from 'react-onex';
import {alertError} from 'ui-alert';
import {storage} from 'uione';
import logo from '../../assets/images/logo.png';
import {applicationContext} from '../config/ApplicationContext';
import {BaseComponent, InternalState} from './BaseComponent';

interface ResetPasswordState extends InternalState {
  user: PasswordReset;
  confirmPassword: string;
}

export class ResetPasswordForm extends BaseComponent<HistoryProps, ResetPasswordState> {
  constructor(props) {
    super(props, storage.resource(), alertError, storage.loading());
    this.signin = this.signin.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.passwordService = applicationContext.passwordService;
    const user: PasswordReset = {
      username: '',
      passcode: '',
      password: ''
    };
    this.state = {
      user,
      message: '',
      confirmPassword: ''
    };
  }

  private passwordService: PasswordService;

  signin() {
    navigate(this.props.history, 'signin');
  }

  async resetPassword(event: any) {
    event.preventDefault();
    let valid = true;
    const r = storage.resource();
    const user = this.state.user;
    if (!user.username || user.username === '') {
      valid = false;
      const msg = r.format(r.value('error_required'), r.value('username'));
      this.showError(msg);
    } else if (!user.passcode || user.passcode === '') {
      valid = false;
      const msg = r.format(r.value('error_required'), r.value('passcode'));
      this.showError(msg);
    } else if (!user.password || user.password === '') {
      valid = false;
      const msg = r.format(r.value('error_required'), r.value('new_password'));
      this.showError(msg);
    } else if (user.password !== this.state.confirmPassword) {
      valid = false;
      const msg = r.value('error_confirmed_password');
      this.showError(msg);
    }
    if (!valid) {
      return;
    }
    try {
      const success = await this.passwordService.resetPassword(user);
      if (success) {
        const msg = r.value('success_reset_password');
        this.showMessage(msg);
      } else {
        const msg = r.value('fail_reset_password');
        this.showError(msg);
      }
    } catch (err) {
      this.handleError(err);
    }
  }

  render() {
    const resource = storage.getResource();
    const { message, user }  = this.state;
    return (
      <div className='view-container central-full'>
        <form id='resetPasswordForm' name='resetPasswordForm' noValidate={true} autoComplete='off' ref={this.ref}>
          <div>
            <img className='logo' src={logo}/>
            <h2>{resource.reset_password}</h2>
            <div className={'message ' + this.alertClass}>
              {message}
              <span onClick={this.hideMessage} hidden={!message || message === ''}/>
            </div>
            <label>
              {resource.username}
              <input type='text'
                id='username' name='username'
                value={user.username}
                placeholder={resource.placeholder_username}
                onChange={this.updateState}
                maxLength={255} required={true}/>
            </label>
            <label>
              {resource.passcode}
              <input type='text'
                id='passcode' name='passcode'
                value={user.passcode}
                placeholder={resource.placeholder_passcode}
                onChange={this.updateState}
                maxLength={255} required={true}/>
            </label>
            <label>
              {resource.new_password}
              <input type='password'
                id='password' name='password'
                value={user.password}
                placeholder={resource.placeholder_new_password}
                onChange={this.updateState}
                maxLength={255} required={true}/>
            </label>
            <label>
              {resource.confirm_password}
              <input type='password'
                id='confirmPassword' name='confirmPassword'
                value={this.state.confirmPassword}
                placeholder={resource.placeholder_confirm_password}
                onChange={this.updateState}
                maxLength={255} required={true}/>
            </label>
            <button type='submit' id='btnResetPassword' name='btnResetPassword' onClick={this.resetPassword}>
              {resource.button_reset_password}
            </button>
            <a id='btnSignin' onClick={this.signin}>
              {resource.button_signin}
            </a>
          </div>
        </form>
      </div>
    );
  }
}
