import { CaptureModel } from '@capture-models/types';
import { useCallback, useEffect, useState } from 'react';

export function useCaptureModelList() {
  const [fetching, _setFetching] = useState(false);
  const [needsRefresh, _setNeedsRefresh] = useState(true);
  const [error, _setError] = useState('');
  const [captureModelList, _setCaptureModelList] = useState<{ id: string; label: string }[]>([]);

  function create(model: CaptureModel) {
    fetch(`/api/crowdsourcing/model`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(model),
    })
      .then(r => r.json())
      .then(r => {
        // Push on list.
        _setCaptureModelList(list => [...list, r]);
        _setNeedsRefresh(true);
      })
      .catch(err => {
        _setError(err);
      });
  }

  function remove(id: string) {
    fetch(`/api/crowdsourcing/model/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        _setCaptureModelList(m => m.filter(model => model.id !== id));
        _setNeedsRefresh(true);
      })
      .catch(err => {
        _setError(err);
        _setNeedsRefresh(true);
      });
  }

  const refresh = useCallback(async () => {
    _setFetching(true);
    _setNeedsRefresh(false);

    const models = await fetch(`/api/crowdsourcing/model`, {})
      .then(r => r.json())
      .catch(err => {
        _setError(err);
        _setNeedsRefresh(true);
      });

    _setFetching(false);
    _setCaptureModelList(models);
  }, []);

  // Initial listing.
  useEffect(() => {
    if (needsRefresh) {
      refresh().catch(err => {
        _setError(err);
      });
    }
  }, [needsRefresh, refresh]);

  return [captureModelList, { refresh, error, fetching, create, needsRefresh, remove }] as const;
}
