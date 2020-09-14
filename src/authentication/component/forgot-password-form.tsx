import {PasswordService} from 'password-component';
import * as React from 'react';
import {HistoryProps, navigate} from 'react-onex';
import {alertError} from 'ui-alert';
import {storage} from 'uione';
import logo from '../../assets/images/logo.png';
import {applicationContext} from '../config/ApplicationContext';
import {BaseComponent, InternalState} from './BaseComponent';

interface ContactInternalState extends InternalState {
  contact: string;
}

export class ForgotPasswordForm extends BaseComponent<HistoryProps, ContactInternalState> {
  constructor(props) {
    super(props, storage.resource(), alertError, storage.loading());
    this.signin = this.signin.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.passwordService = applicationContext.passwordService;
    this.state = {
      message: '',
      contact: ''
    };
  }

  private passwordService: PasswordService;

  signin() {
    navigate(this.props.history, 'signin');
  }

  resetPassword() {
    navigate(this.props.history, 'reset-password');
  }

  async forgotPassword(event) {
    event.preventDefault();
    const r = storage.resource();
    if (!this.state.contact || this.state.contact === '') {
      const msg = r.format(r.value('error_required'), r.value('email'));
      this.showError(msg);
      return;
    }
    try {
      const success = await this.passwordService.forgotPassword(this.state.contact);
      if (success) {
        const msg = r.value('success_forgot_password');
        this.showMessage(msg);
      } else {
        const msg = r.value('fail_forgot_password');
        this.showError(msg);
      }
    } catch (err) {
      this.handleError(err);
    }
  }

  render() {
    const resource = storage.getResource();
    const message = this.state.message;
    return (
      <div className='view-container central-full'>
        <form id='forgotPasswordForm' name='forgotPasswordForm' noValidate={true} autoComplete='off' ref={this.ref}>
          <div>
            <img className='logo' src={logo} />
            <h2>{resource.forgot_password}</h2>
            <div className={'message ' + this.alertClass}>
              {message}
              <span onClick={this.hideMessage} hidden={!message || message === ''}/>
            </div>
            <label>
              {resource.email}
              <input type='text'
                id='contact' name='contact'
                value = {this.state.contact}
                placeholder={resource.placeholder_user_email}
                onChange={this.updateState}
                maxLength={255} required={true}
              />
            </label>
            <button type='submit' id='btnForgotPassword' name='btnForgotPassword'
                onClick={this.forgotPassword}>{resource.button_forgot_password}</button>
            <a id='btnSignin' onClick={this.signin}>{resource.button_signin}</a>
            <a id='btnResetPassword' onClick={this.resetPassword}>{resource.button_reset_password}</a>
          </div>
        </form>
      </div>
    );
  }
}
