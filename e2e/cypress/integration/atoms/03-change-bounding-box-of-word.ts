import { Revisions } from '@capture-models/editor';
import { BaseSelector, RevisionRequest } from '@capture-models/types';

it('Should allow single word bounding boxes to be changed', () => {
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
      selectorId: 'da7e26f8-9797-423e-a0cf-276df7b859ea',
    });

    const revisionRequest = store.getState().currentRevision as RevisionRequest;

    cy.log('revision request', revisionRequest);

    // Save revision to backend
    cy.apiRequest<RevisionRequest>({
      url: `/api/crowdsourcing/model/${fixture.body.id}/revision`,
      body: revisionRequest,
      method: 'post',
    });

    cy.apiRequest<RevisionRequest>({
      url: `/api/crowdsourcing/revision/${revisionRequest.revision.id}?show_revised=true`,
      method: 'get',
    }).then(res => {
      // Quick check on the revision.
      // This makes sure its not equal to the structure.
      expect(res.body.revision.id).not.to.equal('c8bb939a-7a76-4b15-9f77-81375519128c');

      // This is what we are after.
      // @ts-ignore
      const textProperties: BaseField[] = res.body.document.properties.paragraph[0].properties.lines[0].properties.text;
      const selector = textProperties[0].selector;

      // Validate the original
      expect(textProperties[0].id).to.equal('eb122262-fab3-43c8-9432-ac93dad3abf8');
      expect(textProperties[0].selector).to.exist;

      // Validate the new selector.
      expect(selector.id).to.equal('da7e26f8-9797-423e-a0cf-276df7b859ea');
      expect(selector.state.x).to.equal(10);
      expect(selector.state.y).to.equal(20);
      expect(selector.state.width).to.equal(30);
      expect(selector.state.height).to.equal(40);

      const revisedSelector = selector.revisedBy.find((r: BaseSelector) => r.revisionId === res.body.revision.id);

      expect(revisedSelector.id).not.to.equal('da7e26f8-9797-423e-a0cf-276df7b859ea');
      expect(revisedSelector.state.x).to.equal(1);
      expect(revisedSelector.state.y).to.equal(2);
      expect(revisedSelector.state.width).to.equal(3);
      expect(revisedSelector.state.height).to.equal(4);
      expect(revisedSelector.revises).to.equal('da7e26f8-9797-423e-a0cf-276df7b859ea');
    });
  });
});
