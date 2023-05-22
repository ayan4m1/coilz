import PropTypes from 'prop-types';
import { ProgressBar } from 'react-bootstrap';

export default function MixProgressBar({ results }) {
  if (!results) {
    return null;
  }

  const progressBars = [];

  const vg = results.find((result) => result.name === 'VG');
  const pg = results.find((result) => result.name === 'PG');
  const nic = results.find((result) => result.name.endsWith('Nicotine Base'));
  const flavorPct = results
    .filter(
      (result) =>
        result.name !== 'VG' &&
        result.name !== 'PG' &&
        result.name !== 'Total' &&
        !result.name.endsWith('Nicotine Base')
    )
    .reduce((total, result) => total + result.pct, 0);

  if (vg) {
    progressBars.push(
      <ProgressBar key="VG" label="VG" now={vg.pct} variant="success" />
    );
  }

  if (pg) {
    progressBars.push(
      <ProgressBar key="PG" label="PG" now={pg.pct} variant="warning" />
    );
  }

  if (nic) {
    progressBars.push(
      <ProgressBar key="Nic" label="Nic" now={nic.pct} variant="danger" />
    );
  }

  if (flavorPct > 0) {
    progressBars.push(
      <ProgressBar
        key="Flavor"
        label="Flavor"
        now={flavorPct}
        variant="primary"
      />
    );
  }

  return <ProgressBar>{progressBars}</ProgressBar>;
}

MixProgressBar.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object)
};
