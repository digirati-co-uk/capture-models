import { Revisions } from '@capture-models/editor';
import { BaseSelector, RevisionRequest } from '@capture-models/types';

it('Should allow single line bounding boxes to be changed', () => {
  cy.loadFixture('04-selectors/08-hocr-output').then(fixture => {
    // 1. Create store.
    const store = Revisions.createRevisionStore({
      captureModel: fixture.body,
    });
    const actions = store.getActions();

    // 2. Create our revision.
    actions.setRevisionMode({ editMode: true });
    actions.createRevision({
      revisionId: 'c8bb939a-7a76-4b15-9f77-81375519128c',
      cloneMode: 'EDIT_ALL_VALUES',
    });

    // Make our change.
    actions.updateSelector({
      state: { x: 1, y: 2, width: 3, height: 4 },
      selectorId: '0d0a0325-6d9a-407a-93c2-db0f55bb7209',
    });

    const revisionRequest = store.getState().currentRevision;

    // Save revision to backend
    cy.apiRequest<RevisionRequest>({
      url: `/api/crowdsourcing/model/${fixture.body.id}/revision`,
      body: revisionRequest,
      method: 'post',
    }).then(res => {
      // Quick check on the revision.
      // This makes sure its not equal to the structure.
      expect(res.body.revision.id).not.to.equal('c8bb939a-7a76-4b15-9f77-81375519128c');

      // This is what we are after.
      // @ts-ignore
      const lineProperties: BaseField[] = res.body.document.properties.paragraph[0].properties.lines;
      const selector = lineProperties[0].selector;

      // Validate the original
      expect(lineProperties[0].id).to.equal('64e82cb7-16f8-432e-b2b7-3828233a134c');
      expect(lineProperties[0].selector).to.exist;

      // Validate the new selector.
      expect(selector.id).to.equal('0d0a0325-6d9a-407a-93c2-db0f55bb7209');
      expect(selector.state.x).to.equal(100);
      expect(selector.state.y).to.equal(200);
      expect(selector.state.width).to.equal(300);
      expect(selector.state.height).to.equal(400);

      const revisedSelector = selector.revisedBy.find((r: BaseSelector) => r.revisionId === res.body.revision.id);

      expect(revisedSelector.id).not.to.equal('0d0a0325-6d9a-407a-93c2-db0f55bb7209');
      expect(revisedSelector.state.x).to.equal(1);
      expect(revisedSelector.state.y).to.equal(2);
      expect(revisedSelector.state.width).to.equal(3);
      expect(revisedSelector.state.height).to.equal(4);
      expect(revisedSelector.revises).to.equal('0d0a0325-6d9a-407a-93c2-db0f55bb7209');
    });
  });
});
