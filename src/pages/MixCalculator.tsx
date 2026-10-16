import { faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import {
  type ChangeEvent,
  useCallback,
  useState,
  Fragment,
  useEffect
} from 'react';
import { Col, Row } from 'react-bootstrap';

import Card from '../components/Card';
import Heading from '../components/Heading';
import FlavorTable from '../components/FlavorTable';
import MixResults from '../components/MixResults';
import MixOptions, { type PresetUpdateEvent } from '../components/MixOptions';
import useMixPresets from '../hooks/useMixPresets';
import type { Flavor, MixIngredient, MixPreset } from '../types';
import { defaultPreset, densities } from '../utils';

export default function MixCalculator() {
  const {
    currentPreset,
    presets,
    updatePreset,
    duplicateCurrentPreset,
    renameCurrentPreset,
    removeCurrentPreset,
    setCurrentPreset
  } = useMixPresets();
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [results, setResults] = useState<MixIngredient[] | null>(null);
  const {
    errors,
    values,
    handleSubmit,
    handleChange,
    setFieldError,
    resetForm
  } = useFormik<MixPreset>({
    initialValues: currentPreset ?? defaultPreset,
    onSubmit: ({
      useNic,
      nicBaseStrength,
      nicBaseVg,
      nicBatchStrength,
      maxVg,
      batchVg,
      batchMl
    }) => {
      setResults(null);

      const items: MixIngredient[] = [];
      const flavorItems: MixIngredient[] = [];

      let totalPgPct = 0,
        totalVgPct = 0,
        totalMass = 0;

      for (const flavor of flavors) {
        const flavorMl = flavor.pct * batchMl;
        const flavorGrams = flavorMl * densities.pg;

        totalPgPct += flavor.pct;
        totalMass += flavorGrams;

        flavorItems.push({
          name: `${flavor.vendor} ${flavor.flavor}`,
          pct: flavor.pct * 1e2,
          volume: flavorMl,
          mass: flavorGrams
        });
      }

      if (useNic) {
        const nicMg = nicBatchStrength * batchMl;
        const nicMl = nicMg / nicBaseStrength;
        const nicFactor = nicMl / batchMl;

        if (nicMl > batchMl) {
          setFieldError(
            'batchVg',
            'The desired nicotine strength is too high.'
          );
          return;
        }

        const nicBaseVgPct = nicBaseVg / 1e2;
        const nicBasePgPct = 1 - nicBaseVgPct;
        const nicDensity =
          nicBaseVgPct * densities.vgNic + nicBasePgPct * densities.pgNic;
        const nicGrams = nicMl * nicDensity;

        totalVgPct += nicBaseVgPct * nicFactor;
        totalPgPct += nicBasePgPct * nicFactor;
        totalMass += nicGrams;

        let baseDescription = '';

        if (nicBaseVgPct === 0) {
          baseDescription = 'PG';
        } else if (nicBasePgPct === 0) {
          baseDescription = 'VG';
        } else {
          baseDescription = `${Math.round(nicBaseVgPct * 1e2)}/${Math.round(
            nicBasePgPct * 1e2
          )}`;
        }

        items.push({
          name: `${nicBaseStrength}mg/mL ${baseDescription} Nicotine Base`,
          pct: (nicMl / batchMl) * 1e2,
          volume: nicMl,
          mass: nicGrams
        });
      }

      const batchVgPct = maxVg
        ? 1 - totalPgPct - totalVgPct
        : batchVg / 1e2 - totalVgPct;
      const batchPgPct = maxVg ? 0 : 1 - batchVg / 1e2 - totalPgPct;

      if (totalVgPct > batchVgPct) {
        setFieldError(
          'batchVg',
          'The selected VG/PG ratio cannot be achieved for this mix.'
        );
        return;
      }

      if (batchVgPct > 0) {
        const vgMl = batchVgPct * batchMl;
        const vgGrams = vgMl * densities.vg;

        totalMass += vgGrams;

        items.push({
          name: 'VG',
          pct: batchVgPct * 1e2,
          volume: vgMl,
          mass: vgGrams
        });
      }
      if (batchPgPct > 0) {
        const pgMl = batchPgPct * batchMl;
        const pgGrams = pgMl * densities.pg;

        totalMass += pgGrams;

        items.push({
          name: 'PG',
          pct: batchPgPct * 1e2,
          volume: pgMl,
          mass: pgGrams
        });
      }

      const result = [
        ...items,
        ...flavorItems,
        {
          name: 'Total',
          pct: 100,
          volume: batchMl,
          mass: totalMass
        }
      ];

      setResults(result);
    }
  });
  const handleFlavorAdd = useCallback(
    (flavor: Flavor) => setFlavors((flvs) => [...flvs, flavor]),
    [setFlavors]
  );
  const handleFlavorRemove = useCallback(
    (id: string) => setFlavors((flvs) => flvs.filter((flv) => flv.id !== id)),
    [setFlavors]
  );
  const handlePresetUpdate = useCallback(
    (event: PresetUpdateEvent) => {
      if (!currentPreset || !(event.target instanceof HTMLInputElement)) {
        return handleChange(event as ChangeEvent<HTMLInputElement>);
      }

      const { value, checked } = event.target;
      const name = event.target.getAttribute('name');
      const type = event.target.getAttribute('type');

      if (name && type === 'checkbox') {
        updatePreset({
          ...currentPreset,
          [name]: checked
        });
      } else if (name && type === 'number') {
        updatePreset({
          ...currentPreset,
          [name]: parseFloat(value)
        });
      } else if (name) {
        updatePreset({
          ...currentPreset,
          [name]: value
        });
      }

      return handleChange(event);
    },
    [updatePreset, handleChange, currentPreset]
  );

  useEffect(() => {
    if (currentPreset) {
      resetForm({ values: currentPreset });
    }
  }, [currentPreset, resetForm]);

  return (
    <Fragment>
      <Heading icon={faMagicWandSparkles} title="Mix Calculator" />
      <Row className="mb-2">
        <Col>
          <Card className="hide-print">
            <Row>
              <Col sm={6} xs={12}>
                <MixOptions
                  currentPreset={currentPreset}
                  errors={errors}
                  onChange={handleChange}
                  onPresetAdd={duplicateCurrentPreset}
                  onPresetRemove={removeCurrentPreset}
                  onPresetRename={renameCurrentPreset}
                  onPresetSelect={setCurrentPreset}
                  onPresetUpdate={handlePresetUpdate}
                  onSubmit={handleSubmit}
                  presets={presets}
                  values={values}
                />
              </Col>
              <Col sm={6} xs={12}>
                <FlavorTable
                  flavors={flavors}
                  onAddFlavor={handleFlavorAdd}
                  onRemoveFlavor={handleFlavorRemove}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <MixResults results={results} />
    </Fragment>
  );
}
