import { CaptureModel } from '@capture-models/types';
import { useEffect, useState } from 'react';

export const useApiModels = () => {
  const [models, setModels] = useState<Array<{ label: string; id: string }>>([]);

  useEffect(() => {
    fetch(`/api/model`)
      .then(r => r.json())
      .then(r => {
        setModels(r);
      });
  }, []);

  return models;
};

export const useApiModel = (id?: string) => {
  const [model, setModel] = useState<CaptureModel>();

  useEffect(() => {
    if (id) {
      fetch(`/api/model/${id}`)
        .then(r => r.json())
        .then(r => {
          setModel(r);
        });
    } else {
      setModel(undefined);
    }
  }, [id]);

  return model;
};

export const useRevisionList = () => {
  const [revisions, setRevisions] = useState<Array<{ id: string; label: string }>>([]);

  useEffect(() => {
    fetch(`/api/revision`)
      .then(r => r.json())
      .then(r => setRevisions(r));
  }, []);

  return revisions;
};
