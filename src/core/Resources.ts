import AccessResourcesEN from '../access/config/AccessResourceEN';
import AccessResourcesVI from '../access/config/AccessResourceVI';
import AuthenticationResourceEN from '../authentication/config/AuthenticationResourceEN';
import AuthenticationResourceVI from '../authentication/config/AuthenticationResourceVI';
import CommonResourcesEN from './ResourcesEN';
import CommonResourcesVI from './ResourcesVI';

const ResourcesEN = {
  ...CommonResourcesEN,
  ...AuthenticationResourceEN,
  ...AccessResourcesEN,
};
const ResourcesTH = {
  ...CommonResourcesVI,
  ...AuthenticationResourceVI,
  ...AccessResourcesVI,
};

const Resources = {
  ['en']: ResourcesEN,
  ['th']: ResourcesTH
};

export default Resources;
