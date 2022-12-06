import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

export default function Heading({ icon, title }) {
  return (
    <Fragment>
      <Helmet title={title} />
      <h1>
        {Boolean(icon) && <FontAwesomeIcon icon={icon} size="2x" />} {title}
      </h1>
    </Fragment>
  );
}

Heading.propTypes = {
  icon: PropTypes.object,
  title: PropTypes.string.isRequired
};
