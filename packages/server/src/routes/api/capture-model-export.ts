import { BaseField } from '@capture-models/types';
import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const captureModelExport: RouteMiddleware<{ id: string }> = async context => {
  if (!userCan('models.view_published', context.state)) {
    context.status = 404;
    return;
  }

  const model = await context.db.api.getCaptureModel(context.params.id);

  function processLevel(doc) {
    const rootDoc = {};
    const props = Object.keys(doc.properties);
    for (const prop of props) {
      const values = [];
      const revises = [];
      for (const field of doc.properties[prop] as BaseField[]) {
        if (field.type !== 'model' && field.revises) {
          revises.push(field.revises);
        }
      }
      for (const field of doc.properties[prop] as BaseField[]) {
        if (field.revision) {
          const rev = model.revisions.find(r => r.id === field.revision);
          if (rev && !rev.approved) {
            continue;
          }
        }

        if (revises.indexOf(field.id) !== -1) {
          continue;
        }

        if (field.type === 'entity') {
          values.push(processLevel(field as any));
          continue;
        }

        if (field.value) {
          values.push(field.value);
        }
      }

      rootDoc[prop] = values;

      if (values.length === 1) {
        rootDoc[prop] = values[0];
      } else if (values.length > 0) {
        rootDoc[prop] = values;
      }
    }
    return rootDoc;
  }

  context.response.body = processLevel(model.document);
};
