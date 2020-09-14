import {AuthStatus} from 'authentication-component';
import * as React from 'react';
import {HistoryProps} from 'react-onex';
import {alertError} from 'ui-alert';
import {storage} from 'uione';
import logo from '../../assets/images/logo.png';
import {applicationContext} from '../config/ApplicationContext';
import {OAuth2Info} from '../model/OAuth2Info';
import {SigninType} from '../model/SigninType';
import {BaseComponent, InternalState} from './BaseComponent';

export interface ConnectState extends InternalState {
  connectType: string;
  connectTypePretty: string;
  componentRef: any;
}

export class ConnectForm extends BaseComponent<HistoryProps, ConnectState> {
  constructor(props) {
    super(props, storage.resource(), alertError, storage.loading());
    this.state = {
      connectType: '',
      connectTypePretty: '',
      message: '',
      componentRef: React.createRef()
    };
    this.connect = this.connect.bind(this);
  }
  private readonly oAuth2IntegrationService = applicationContext.oauth2Service;
  protected navigateToHome() {
    const redirect = window.location.search;
    if (redirect) {
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(url.search);
      this.props.history.push(searchParams.get('redirect'));
    } else {
      this.props.history.push('/welcome');
    }
  }
  // TODO: remove when BaseComponent add componentDidMount() and loadData()
  componentDidMount(): void {
    this.loadData();
  }

  loadData() {
    // @ts-ignore
    let connectType = this.props.match.params['connectType'].toLowerCase();
    if (connectType !== 'signin' && connectType !== 'signup') {
      connectType = 'signup';
    }

    const connectTypePretty = connectType === 'signup' ? 'Sign up' :  'Sign in';
    this.setState({connectType, connectTypePretty});
  }

    protected content() {
      this.props.history.push('/content/drive');
    }

  async connect(signInType?: string) {
    this.hideMessage();
    const connectType = this.state.connectType;
    if (!signInType || signInType.length === 0) {
      return this.props.history.push('/auth/' + connectType);
    }
    try {
      const r = storage.resource();
      const integrationConfiguration = await this.oAuth2IntegrationService.getIntegrationConfiguration(signInType);
      if (!integrationConfiguration) {
        const msg = r.format(r.value('msg_set_integration_information'), signInType);
        return this.showError(msg);
      }

      let url;
      let redirectUrl = storage.getRedirectUrl();
      if (signInType === SigninType.linkedIn) {
        url = 'https://www.linkedin.com/uas/oauth2/authorization?client_id=' + integrationConfiguration.clientId + '&response_type=code&redirect_uri='
          + redirectUrl + '&state=Rkelw7xZWQlV7f8d&scope=r_basicprofile%20r_emailaddress';
      } else if (signInType === SigninType.google) {
        url = 'https://accounts.google.com/o/oauth2/auth?client_id=' + integrationConfiguration.clientId + '&response_type=code&redirect_uri='
          + redirectUrl + '&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&include_granted_scopes=true';
      } else if (signInType === SigninType.facebook) {
        url = 'https://www.facebook.com/v2.5/dialog/oauth?client_id=' + integrationConfiguration.clientId + '&redirect_uri='
          + redirectUrl + '&scope=public_profile%2cemail%2cuser_birthday';
      } else if (signInType === SigninType.twitter) {
        url = 'https://api.twitter.com/oauth/authorize?oauth_token=' + integrationConfiguration.clientId;
      } else if (signInType === SigninType.amazon) {
        url = 'https://www.amazon.com/ap/oa?client_id=' + integrationConfiguration.clientId + '&scope=profile&response_type=code&redirect_uri=' + redirectUrl;
      } else if (signInType === SigninType.microsoft) {
        const u = 'http://localhost:3001/auth/connect/oauth2';
        redirectUrl = encodeURIComponent(u);
        url = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=' + integrationConfiguration.clientId + '&response_type=code&redirect_uri='
            + redirectUrl + '&response_mode=query&scope=https%3A%2F%2Fgraph.microsoft.com%2FFiles.ReadWrite.All%20onedrive.readwrite%20onedrive.appfolder%20offline_access&state=12345&grant_type=authorization_Code';
      } else if (signInType === SigninType.dropbox) {
        url = 'https://www.dropbox.com/oauth2/authorize?client_id=' + integrationConfiguration.clientId + '&response_type=code&redirect_uri=' + redirectUrl;
      }

      const oAuth2Info: OAuth2Info = {
        sourceType: SigninType[signInType],
        redirectUri: redirectUrl,
        code: null
      };

      const left = screen.width / 2 - 300;
      const top = screen.height / 2 - 350;
      const win = window.open(url, '', 'top=' + top + ',left=' + left + ', width=600, height=700');

      const _this = this;
      const interval = window.setInterval(async function() {
        try {
          if (win == null || win.closed) {
            window.clearInterval(interval);
            let code = localStorage.getItem('code');
            if (code && code !== '') {
              if (oAuth2Info.sourceType === SigninType.google) {
                code = encodeURIComponent(code);
              }
              oAuth2Info.code = code;
              const result = await _this.oAuth2IntegrationService.authenticate(oAuth2Info);
              const status = result.status;
              if (status === AuthStatus.Success || status === AuthStatus.SuccessAndReactivated) {
                if (status === AuthStatus.Success) {
                  storage.setUser(result.user);
                  _this.content();
                  // _this.navigateToHome();
                } else {
                  const message3 = r.value('msg_account_reactivated');
                  storage.alert().alertInfo(message3, null, () => {
                    storage.setUser(result.user);
                    _this.navigateToHome();
                  });
                }
              } else {
                storage.setUser(null);
                let msg: string;
                switch (status) {
                  case AuthStatus.Fail:
                    msg = r.value('fail_authentication');
                    break;
                  case AuthStatus.WrongPassword:
                    msg = r.value('fail_wrong_password');
                    break;
                  case AuthStatus.PasswordExpired:
                    msg = r.value('fail_expired_password');
                    break;
                  case AuthStatus.Suspended:
                    msg = r.value('fail_suspended_account');
                    break;
                  case AuthStatus.Locked:
                    msg = r.value('fail_locked_account');
                    break;
                  case AuthStatus.Disabled:
                    msg = r.value('fail_disabled_account');
                    break;
                  default:
                    msg = r.value('fail_authentication');
                    break;
                }
                this.showDanger(msg);
              }
            } else {
              // $scope.hideLoading();
            }
          }
        } catch (e) {
          // $scope.hideLoading();
        }
      }, 0);
    } catch (err) {
      this.handleError(err);
    }



  }

  render() {
    const resource = storage.getResource();
    const connectTypePretty = this.state.connectTypePretty;
    return (
      <div className='view-container central-full' ref={this.state.componentRef}>
        <form id='connectForm' name='connectForm' noValidate={true} autoComplete='off'>
          <div>
            <img className='logo' src={logo}/>
            <h2>{connectTypePretty}</h2>
            <div className={'message ' + this.alertClass}>
              {this.state.message}
              <span onClick={this.hideMessage} hidden={!this.state.message || this.state.message === ''}/>
            </div>
            <button type='button' onClick={() => this.connect('linkedIn')}>
              <i className='fa fa-linkedin pull-left'/>
              {resource.connect_linkedin}</button>
            <button type='button' onClick={() => this.connect('google')}>
              <i className='fa fa-google pull-left'/>
              {resource.connect_google}
            </button>
            <button type='button' onClick={() => this.connect('facebook')}>
              <i className='fa fa-facebook pull-left'/>
              {resource.connect_facebook}
            </button>
            <button type='button' onClick={() => this.connect('twitter')}>
              <i className='fa fa-twitter pull-left'/>
              {resource.connect_twitter}
            </button>
            <button type='button' onClick={() => this.connect('amazon')}>
              <i className='fa fa-amazon pull-left'/>
              {resource.connect_amazon}
            </button>
            <button type='button' onClick={() => this.connect('microsoft')}>
              <i className='fa fa-windows pull-left'/>
              {resource.connect_microsoft}
            </button>
            <button type='button' onClick={() => this.connect('dropbox')}>
              <i className='fa fa-dropbox pull-left'/>
              {resource.connect_dropbox}
            </button>
            <button type='submit' onClick={() => this.connect()}>
              <i className='fa fa-envelope-o pull-left'/>
              {resource.connect_username}
            </button>
            <button type='button' className='btn-cancel' id='btnCancel' name='btnCancel' onClick={this.back}>
              {resource.button_back}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
