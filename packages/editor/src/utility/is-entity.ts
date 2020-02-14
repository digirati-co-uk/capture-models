export function isEntity(input: any) {
  return input.type === 'entity';
}

export function isEntityList(input: any) {
  return input[0].type === 'entity';
}
