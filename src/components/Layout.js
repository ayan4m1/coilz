import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import Header from 'components/Header';
import useDarkMode from 'hooks/useDarkMode';

export default function Layout({ children }) {
  const { value: darkMode } = useDarkMode();

  return (
    <Fragment>
      <Helmet titleTemplate="Coilz - %s" />
      <Header />
      <Container bg={darkMode ? 'light' : 'dark'}>{children}</Container>
    </Fragment>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
