import { Revisions } from '@capture-models/editor';
import { BaseField, RevisionRequest } from '@capture-models/types';

it('Should allow single word changes to be made and saved', () => {
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
    actions.updateFieldValue({
      path: [
        ['paragraph', '159621fb-4f93-4cd7-a394-5a1141fc1091'],
        ['lines', '64e82cb7-16f8-432e-b2b7-3828233a134c'],
        ['text', 'eb122262-fab3-43c8-9432-ac93dad3abf8'],
      ],
      value: 'Testing a new value',
    });

    const revisionRequest = store.getState().currentRevision as RevisionRequest;

    cy.log('revisionRequest', revisionRequest);

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

      const textProperties: BaseField[] =
        // @ts-ignore
        res.body.document.properties.paragraph[0].properties.lines[0].properties.text;

      const originalText = textProperties.find(r => r.revision !== res.body.revision.id) as BaseField;
      const newText = textProperties.find(r => r.revision === res.body.revision.id) as BaseField;

      // Validate the original
      expect(originalText.id).to.equal('eb122262-fab3-43c8-9432-ac93dad3abf8');

      // Validate the revised field.
      expect(newText.revises).to.equal('eb122262-fab3-43c8-9432-ac93dad3abf8');
      expect(newText.revision).to.equal(res.body.revision.id);
      expect(newText.id).not.to.equal('eb122262-fab3-43c8-9432-ac93dad3abf8');
      expect(newText.value).to.equal('Testing a new value');
    });
  });
});
