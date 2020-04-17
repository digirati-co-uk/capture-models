import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { useCaptureModelList } from '../../hooks/use-capture-model-list';

export const DeleteModel: React.FC<{ id: string }> = ({ id }) => {
  const [deleting, setDeleting] = useState(false);
  const [, modelActions] = useCaptureModelList();
  const history = useHistory();

  return (
    <div>
      <h3>Are you sure you want to delete this whole model?</h3>
      <Button
        color="red"
        disabled={deleting}
        onClick={() => {
          setDeleting(true);
          modelActions.remove(id).then(() => {
            history.push(`/editor`);
          });
        }}
      >
        Delete
      </Button>
    </div>
  );
};
