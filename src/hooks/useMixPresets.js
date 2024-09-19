import { v4 } from 'uuid';
import { useMemo, useCallback, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import { defaultPreset } from 'utils';

export default function useMixPresets() {
  const [presets, setPresets] = useLocalStorageState('mixPresets', {
    defaultValue: [{ ...defaultPreset }]
  });
  const [presetId, setPresetId] = useLocalStorageState('mixPresetId', {
    defaultValue: presets[0]?.id ?? defaultPreset.id
  });
  const currentPreset = useMemo(
    () => presets?.find?.((preset) => preset?.id === presetId),
    [presets, presetId]
  );

  const addPreset = useCallback(
    (preset) => setPresets((prsts) => [...prsts, preset]),
    [setPresets]
  );
  const removePreset = useCallback(
    (id) => setPresets((prsts) => prsts.filter((preset) => preset.id !== id)),
    [setPresets]
  );
  const updatePreset = useCallback(
    (preset) =>
      setPresets((prsts) => {
        const newPresets = [...prsts];

        newPresets.splice(
          newPresets.findIndex((prst) => prst.id === preset.id),
          1,
          preset
        );

        return newPresets;
      }),
    [setPresets]
  );
  const duplicateCurrentPreset = useCallback(() => {
    const name = prompt('Enter a name for the new preset', currentPreset?.name);

    if (!name?.trim?.()) {
      return;
    }

    const id = v4();

    addPreset({
      ...presets[0],
      id,
      name
    });
    setPresetId(id);
  }, [addPreset, presets, setPresetId, currentPreset]);
  const removeCurrentPreset = useCallback(() => {
    if (!confirm('Are you sure you want to remove this preset?')) {
      return;
    }

    removePreset(presetId);
    if (currentPreset?.id === presetId) {
      setPresetId(presets[0].id);
    }
  }, [removePreset, presetId, currentPreset, setPresetId, presets]);
  const renameCurrentPreset = useCallback(() => {
    const name = prompt('Enter the new preset name', currentPreset?.name);

    if (!name?.trim?.()) {
      return;
    }

    updatePreset({
      ...currentPreset,
      name
    });
  }, [updatePreset, currentPreset]);
  const setCurrentPreset = useCallback(
    (event) => setPresetId(event.target.value),
    [setPresetId]
  );

  useEffect(() => {
    if (!Array.isArray(presets) || !presets.length) {
      setPresets([{ ...defaultPreset }]);
    }
  }, [presets, setPresets]);

  return {
    currentPreset,
    presets,
    updatePreset,
    duplicateCurrentPreset,
    removeCurrentPreset,
    renameCurrentPreset,
    setCurrentPreset
  };
}
