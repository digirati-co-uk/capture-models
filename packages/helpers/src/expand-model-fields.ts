import { ModelFields, NestedModelFields } from '@capture-models/types';

export function expandModelFields(fields: ModelFields): string[][] {
  const reducer = (prefix: string[]) => (acc: string[][], next: string | NestedModelFields): string[][] => {
    if (typeof next === 'string') {
      acc.push([...prefix, next]);
      return acc;
    }
    const [name, nextFields] = next;

    if (typeof nextFields === 'undefined') {
      throw new Error(`Invalid model fields at level ${name} (${JSON.stringify(fields, null, 2)})`);
    }

    return nextFields.reduce(reducer([...prefix, name]), acc);
  };

  return fields.reduce(reducer([]), []);
}
