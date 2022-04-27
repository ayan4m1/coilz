import { Fragment } from 'react';
import Helmet from 'react-helmet';

export default function Home() {
  return (
    <Fragment>
      <Helmet title="Home" />
      <h1>Welcome to Coilz</h1>
    </Fragment>
  );
}
