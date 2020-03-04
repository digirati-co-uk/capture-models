import { CaptureModel } from '@capture-models/types';
import { useCallback, useEffect, useState } from 'react';

export function useCaptureModelApi(id: string) {
  const [captureModel, _updateCaptureModel] = useState<CaptureModel | undefined>();
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(modelId => {
    setFetching(true);
    fetch(`/api/model/${modelId}`)
      .then(r => r.json())
      .then(model => {
        _updateCaptureModel(model);
      })
      .then(() => {
        setFetching(false);
        setError('');
      })
      .catch(err => {
        setError(err);
        setFetching(false);
      });
  }, []);

  async function update(model: CaptureModel) {
    const newModel = await fetch(`/api/model/${model.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(model),
    }).then(r => r.json());

    // update model.
    _updateCaptureModel(newModel);
  }

  async function remove(model: CaptureModel) {
    // remove model.
    _updateCaptureModel(undefined);

    await fetch(`/api/model/${model.id}`, {
      method: 'DELETE',
    }).catch(err => {
      // Add error.
      setError(err);
      // Add model back if delete failed.
      _updateCaptureModel(model);
    });
  }

  // Fetch initial model.
  useEffect(() => {
    refresh(id);
  }, [id, refresh]);

  return [captureModel, { error, fetching, update, remove }] as const;
}
