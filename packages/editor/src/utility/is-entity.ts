function _isEntity(input: any) {
  return input.type === 'entity';
}

function _isEntityList(input: any[]) {
  return input && input[0] && input[0].type === 'entity';
}

export const isEntity: import('./invalid-babel-types').IsEntity = _isEntity as any;
export const isEntityList: import('./invalid-babel-types').IsEntityList = _isEntityList as any;
