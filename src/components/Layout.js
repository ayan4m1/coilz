import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Container } from 'react-bootstrap';

import Header from 'components/Header';

export default function Layout({ children }) {
  return (
    <Fragment>
      <Header />
      <Container>{children}</Container>
    </Fragment>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
