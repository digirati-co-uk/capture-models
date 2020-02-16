import { debug, State } from 'easy-peasy';
import { RevisionsModel } from '../revisions-model';

export function getRevisionFieldFromPath<T extends any = any>(
  state: State<RevisionsModel>,
  path: Array<[string, string]>,
  customRevisionId?: string | null
): T | null {
  const revisionId = customRevisionId ? customRevisionId : state.currentRevisionId;

  if (!revisionId || !state.revisions[revisionId]) {
    // Error?
    return null;
  }

  let current = debug(state.revisions[revisionId].document);

  if (!current) {
    // Error?
    return null;
  }

  console.log('path =>', path);

  for (const [prop, id] of path) {
    if (current.type === 'entity') {
      const property = current.properties[prop];
      console.log('prop', prop, property, current.properties);

      current = (property as []).find((field: any) => field.id === id) as any;
    }
  }

  console.log('done...');
  console.log();
  return (current as any) as T;
}
