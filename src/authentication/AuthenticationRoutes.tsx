import * as React from 'react';
import {Route, RouteComponentProps, Switch, withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {ChangePasswordForm} from './component/change-password-form';
import {ConnectForm} from './component/connect-form';
import {ConnectOauth2Form} from './component/connect-oauth2-form';
import {ForgotPasswordForm} from './component/forgot-password-form';
import {ResetPasswordForm} from './component/reset-password-form';
import {SigninForm} from './component/signin-form';
import {SignupForm} from './component/signup-form';

interface StateProps {
  anyProps?: any;
}

type AppProps = StateProps;
class StatelessApp extends React.Component<AppProps & RouteComponentProps<any>, {}> {
  render() {
    const currentUrl = this.props.match.url;
    return (
      <Switch>
        <Route path={currentUrl + '/connect/oauth2'} exact={true} component={ConnectOauth2Form} />
        <Route path={currentUrl + '/connect/:connectType'} exact={true} component={ConnectForm} />
        <Route path={currentUrl + '/signup'} exact={true} component={SignupForm} />
        <Route path={currentUrl + '/signin'} exact={true} component={SigninForm} />
        <Route path={currentUrl + '/change-password'} exact={true} component={ChangePasswordForm} />
        <Route path={currentUrl + '/forgot-password'} exact={true} component={ForgotPasswordForm} />
        <Route path={currentUrl + '/reset-password'} exact={true} component={ResetPasswordForm} />
        <Route path={currentUrl} exact={true} component={SigninForm} />
      </Switch>
    );
  }
}

const AuthenticationRoutes = compose(
  withRouter,
)(StatelessApp);
export default AuthenticationRoutes;
