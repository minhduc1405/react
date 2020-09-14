import * as React from 'react';
import {HistoryProps} from 'react-onex';
import {alertError} from 'ui-alert';
import {storage} from 'uione';
import {BaseComponent, InternalState} from './BaseComponent';

export class ConnectOauth2Form extends BaseComponent<HistoryProps, InternalState> {
  constructor(props) {
    super(props, storage.resource(), alertError, storage.loading());
  }

  componentDidMount(): void {
    // @ts-ignore
    const urlSearchParams = new URLSearchParams(this.props.location.search);
    let code = urlSearchParams.get('code');
    if (urlSearchParams.has('oauth_token') && urlSearchParams.has('oauth_verifier')) {
      code = urlSearchParams.get('oauth_token') + ':' + urlSearchParams.get('oauth_verifier');
    }
    localStorage.setItem('code', code);
    window.close();
  }

  render() {
    return (
      <div>{}</div>
    );
  }
}
