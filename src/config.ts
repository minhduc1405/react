const localConfigUrl = {
  signupUrl: 'http://localhost:3002',
  authenticationUrl: 'http://localhost:3002',
  passwordServiceUrl: 'http://localhost:3002',
  passwordUrl: 'http://localhost:3002',

  backOfficeUrl: 'http://localhost:3002/',
};

const sitConfigUrl = {
  signupUrl: 'http://localhost:3002',
  authenticationUrl: 'http://localhost:3002',
  passwordServiceUrl: 'http://localhost:3002',
  passwordUrl: 'http://localhost:3002',

  backOfficeUrl: 'http://localhost:3002/',
};

const deployConfigUrl = {
  signupUrl: 'http://localhost:3002',
  authenticationUrl: 'http://localhost:3002',
  passwordServiceUrl: 'http://localhost:3002',
  passwordUrl: 'http://localhost:3002',

  backOfficeUrl: 'http://localhost:3002/',
};

const config = process.env.REACT_APP_ENV === 'DEPLOY' ? deployConfigUrl : (process.env.REACT_APP_ENV === 'SIT' ? sitConfigUrl : localConfigUrl);

export default config;
