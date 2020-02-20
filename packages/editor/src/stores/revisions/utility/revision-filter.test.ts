import single01 from '../../../../../../fixtures/03-revisions/01-single-field-with-revision.json';
import single02 from '../../../../../../fixtures/03-revisions/02-single-field-with-multiple-revisions.json';
import single03 from '../../../../../../fixtures/03-revisions/03-nested-revision.json';
import single04 from '../../../../../../fixtures/03-revisions/04-dual-transcription.json';
import single05 from '../../../../../../fixtures/03-revisions/05-allow-multiple-transcriptions.json';
import { CaptureModel } from '@capture-models/types';
import { revisionFilter } from './revision-filter';

describe('revisionFilter', () => {
  test('single-field-with-revision non-existent', () => {
    expect(revisionFilter(single01 as CaptureModel, 'NOPE')).toMatchInlineSnapshot(`null`);
  });
  test('single-field-with-revision', () => {
    expect(revisionFilter(single01 as CaptureModel, 'abc-123')).toMatchInlineSnapshot(`null`);
  });
  test('single-field-with-multiple-revisions', () => {
    expect(revisionFilter(single02 as CaptureModel, 'test-person-a')).toMatchInlineSnapshot(`null`);
    expect(revisionFilter(single02 as CaptureModel, 'test-person-b')).toMatchInlineSnapshot(`null`);
  });
  test('nested-revision', () => {
    expect(revisionFilter(single03 as CaptureModel, 'abc-123')).toMatchInlineSnapshot(`null`);
  });
  test('dual-transcription', () => {
    expect(revisionFilter(single04 as any, 'test-person-a')).toMatchInlineSnapshot(`null`);
    expect(revisionFilter(single04 as any, 'test-person-b')).toMatchInlineSnapshot(`null`);
  });
  test('allow-multiple-transcriptions', () => {
    expect(revisionFilter(single05 as any, 'test-person-a')).toMatchInlineSnapshot(`null`);
    expect(revisionFilter(single05 as any, 'test-person-b')).toMatchInlineSnapshot(`null`);
    expect(revisionFilter(single05 as any, 'test-person-c')).toMatchInlineSnapshot(`null`);
  });
});
