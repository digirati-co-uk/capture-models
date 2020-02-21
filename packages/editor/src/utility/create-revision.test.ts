import { filterDocumentByRevision } from '@capture-models/editor';
import { CaptureModel } from '@capture-models/types';
import { captureModelToRevisionList } from '../stores/revisions/utility/capture-model-to-revision-list';
import { forkTemplate, splitDocumentByModelRoot } from './create-revision';

describe('create revision', () => {
  const captureModel: CaptureModel = require('../../../../fixtures/03-revisions/06-model-root.json');
  const [createFieldA] = captureModelToRevisionList(captureModel, true);

  describe('splitDocumentByModelRoot', () => {
    test('top level', () => {
      const { immutableDocuments, modelRootDocuments } = splitDocumentByModelRoot(captureModel.document);

      expect(immutableDocuments).toHaveLength(0);
      expect(modelRootDocuments).toHaveLength(1);
      expect(modelRootDocuments[0].parent).toBeUndefined();
      expect(modelRootDocuments[0].documents).toHaveLength(1);
      expect(modelRootDocuments[0].documents[0].id).toEqual('3353dc03-9f35-49e7-9b81-4090fa533c64');
    });

    test('single depth', () => {
      const { immutableDocuments, modelRootDocuments } = splitDocumentByModelRoot(captureModel.document, ['model-a']);

      expect(immutableDocuments).toHaveLength(1);
      expect(modelRootDocuments).toHaveLength(1);
      expect(immutableDocuments[0].documents).toHaveLength(1);
      expect(immutableDocuments[0].documents[0].id).toEqual('3353dc03-9f35-49e7-9b81-4090fa533c64');
    });
  });

  test('second depth', () => {
    const { immutableDocuments, modelRootDocuments } = splitDocumentByModelRoot(captureModel.document, [
      'model-a',
      'model-c',
    ]);

    expect(immutableDocuments).toHaveLength(2);
    expect(modelRootDocuments).toHaveLength(1);
  });

  test('third depth', () => {
    const { immutableDocuments, modelRootDocuments } = splitDocumentByModelRoot(captureModel.document, [
      'model-b',
      'model-c',
      'model-d',
    ]);

    expect(immutableDocuments).toHaveLength(3);
    expect(modelRootDocuments).toHaveLength(1);
  });

  test('second depth - with 2 items', () => {
    const { immutableDocuments, modelRootDocuments } = splitDocumentByModelRoot(captureModel.document, [
      'model-f',
      'model-g',
    ]);

    expect(immutableDocuments).toHaveLength(2);
    expect(immutableDocuments[0].documents).toHaveLength(1);
    expect(modelRootDocuments).toHaveLength(1);
    expect(modelRootDocuments[0].documents).toHaveLength(2);
  });

  test('second depth - with adjacent models', () => {
    const { immutableDocuments, modelRootDocuments } = splitDocumentByModelRoot(captureModel.document, [
      'model-h',
      'model-i',
    ]);

    expect(immutableDocuments).toHaveLength(2);
    expect(immutableDocuments[0].documents).toHaveLength(1);
    expect(immutableDocuments[1].documents).toHaveLength(2);
    expect(modelRootDocuments).toHaveLength(2);
    expect(modelRootDocuments[0].documents).toHaveLength(2);
    expect(modelRootDocuments[1].documents).toHaveLength(2);

    expect(modelRootDocuments[0].documents[0].id).toEqual('ecbd3446-6da3-4125-934f-1a3b766b8afe');
    expect(modelRootDocuments[0].documents[1].id).toEqual('7de07c37-6157-4d63-8097-d2d4a78b778f');
    expect(modelRootDocuments[1].documents[0].id).toEqual('ecbd3446-6da3-4125-934f-1a3b766b8afe');
    expect(modelRootDocuments[1].documents[1].id).toEqual('ecbd3446-6da3-4125-934f-1a3b766b8afe');
  });

  test('invalid depth', () => {
    expect(() => splitDocumentByModelRoot(captureModel.document, ['model-a', 'model-c', 'NOT EXIST'])).toThrow(
      'Invalid modelRoot provided'
    );
  });

  // describe('fork template', () => {
  //   test('Edit field A', () => {
  //     // expect(forkTemplate(createFieldA.document)).toBe({});
  //   });
  // });
});
