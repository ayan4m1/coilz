import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import { useThemeContext } from 'hooks/useThemeContext';

export default function Heading({ icon, title }) {
  const { value: theme } = useThemeContext();

  return (
    <Fragment>
      <Helmet title={title} />
      <h1 className={`mb-4 text-${theme === 'light' ? 'dark' : 'light'}`}>
        {Boolean(icon) && (
          <FontAwesomeIcon
            color={theme === 'light' ? 'black' : 'white'}
            icon={icon}
            size="2x"
          />
        )}{' '}
        {title}
      </h1>
    </Fragment>
  );
}

Heading.propTypes = {
  icon: PropTypes.object,
  title: PropTypes.string.isRequired
};
