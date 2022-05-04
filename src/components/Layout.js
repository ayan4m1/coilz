import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Container } from 'react-bootstrap';
import Helmet from 'react-helmet';

import Header from 'components/Header';

export default function Layout({ children }) {
  return (
    <Fragment>
      <Helmet titleTemplate="Coilz - %s" />
      <Header />
      <Container>{children}</Container>
    </Fragment>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
