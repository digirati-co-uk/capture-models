
export function getRevisionFieldFromPath<T extends any = any, State extends any = any>(
  state: State,
  path: Array<[string, string]>,
  customRevisionId?: string | null
): T | null {
  const revisionId = customRevisionId ? customRevisionId : state.currentRevisionId;

  if (!revisionId || !state.revisions[revisionId]) {
    // Error?
    return null;
  }

  let current = (state.revisions[revisionId].document);

  if (!current) {
    // Error?
    return null;
  }

  for (const [prop, id] of path) {
    if (current.type === 'entity') {
      const property = current.properties[prop];

      current = (property as []).find((field: any) => field.id === id) as any;
    }
  }

  return (current as any) as T;
}
