import { Revisions } from '@capture-models/editor';
import { RevisionRequest } from '@capture-models/types';

it('Should allow new lines to be added and saved', () => {
  cy.loadFixture('04-selectors/08-hocr-output').then( fixture => {
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
    // b. Create new entity instance.
    actions.createNewEntityInstance({
      path: [['paragraph', '159621fb-4f93-4cd7-a394-5a1141fc1091']],
      property: 'lines',
    });
    // b. Update its value.
    // @ts-ignore
    const newLine = store.getState().currentRevision.document.properties.paragraph[0].properties.lines[1];
    // @ts-ignore
    const newField = newLine.properties.text[0];

    cy.log('new field', JSON.stringify(newField, null, 2));
    cy.log('new line', JSON.stringify(newLine, null, 2));

    // c. Update the value in the new item
    actions.updateFieldValue({
      path: [
        ['paragraph', '159621fb-4f93-4cd7-a394-5a1141fc1091'],
        ['lines', newLine.id],
        ['text', newField.id],
      ],
      value: 'Testing a new value, inside new entity',
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

      // @ts-ignore
      const allLines: any = res.body.document.properties.paragraph[0].properties.lines;

      expect(allLines).to.have.lengthOf(2);

      // // This is what we are after.
      const originalLine: any = allLines.find((r: any) => !r.revision);
      const savedLine: any = allLines.find((r: any) => r.revision === res.body.revision.id);

      // // Validate the original
      expect(originalLine).to.exist;
      expect(originalLine.id).to.equal('64e82cb7-16f8-432e-b2b7-3828233a134c');
      expect(originalLine.properties.text[0].id).to.equal('eb122262-fab3-43c8-9432-ac93dad3abf8');
      expect(originalLine.properties.text[0].value).to.equal('');

      expect(savedLine).to.exist;
      expect(savedLine.id).to.equal(newLine.id);
      expect(savedLine.properties.text[0].id).to.equal(newField.id);
      expect(savedLine.properties.text[0].value).to.equal('Testing a new value, inside new entity');
    });
  });
});
