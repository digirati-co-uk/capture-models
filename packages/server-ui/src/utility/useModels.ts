import { CaptureModel } from '@capture-models/types';
import { useCallback, useEffect, useState } from 'react';

export const useApiModels = () => {
  const [models, setModels] = useState<Array<{ label: string; id: string }>>([]);

  const refresh = useCallback(() => {
    fetch(`/api/crowdsourcing/model`)
      .then(r => r.json())
      .then(r => {
        setModels(r);
      });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return [models, refresh] as const;
};

export const useApiModel = (id?: string) => {
  const [model, setModel] = useState<CaptureModel>();

  const getCurrentModel = useCallback(() => {
    if (id) {
      fetch(`/api/crowdsourcing/model/${id}`)
        .then(r => r.json())
        .then(r => {
          setModel(r);
        });
    } else {
      setModel(undefined);
    }
  }, [id]);

  useEffect(() => {
    getCurrentModel();
  }, [getCurrentModel, id]);

  return [model, getCurrentModel] as const;
};

export const useRevisionList = () => {
  const [revisions, setRevisions] = useState<Array<{ id: string; label: string }>>([]);

  useEffect(() => {
    fetch(`/api/crowdsourcing/revision`)
      .then(r => r.json())
      .then(r => setRevisions(r));
  }, []);

  return revisions;
};
