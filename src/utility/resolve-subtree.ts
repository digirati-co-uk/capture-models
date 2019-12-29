import { CaptureModel } from '../types/capture-model';

export function resolveSubtree(subtreePath: string[], document: CaptureModel['document']) {
  return subtreePath.reduce((acc, next) => {
    const propValue = acc.properties[next];
    const singleModel = propValue[0];
    if (!propValue.length || !singleModel || singleModel.type !== 'entity') {
      throw Error(`Invalid prop: ${next} in list ${subtreePath.join(',')}`);
    }
    return singleModel;
  }, document as CaptureModel['document']);
}
