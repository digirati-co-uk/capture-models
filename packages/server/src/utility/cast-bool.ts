export function castBool(str?: string | null, defaultValue?: boolean) {
  if (!str) {
    return !!defaultValue;
  }

  return !(str.toLowerCase() === 'false' || str === '0');
}
