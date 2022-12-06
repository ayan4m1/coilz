import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Fragment } from 'react';

import Heading from 'components/Heading';

export default function Settings() {
  return (
    <Fragment>
      <Heading icon={faCog} title="Settings" />
      <p>Coming Soon &trade;</p>
    </Fragment>
  );
}
