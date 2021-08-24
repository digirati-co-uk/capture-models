import { Revisions } from '@capture-models/editor';
import { RevisionRequest } from '@capture-models/types';

it('Should allow single word changes to be made and saved', () => {
  cy.loadFixture('03-revisions/07-single-field-with-values').then(fixture => {
    // 1. Create store.
    const store = Revisions.createRevisionStore({
      captureModel: fixture.body,
    });
    const actions = store.getActions();

    // 2. Create our revision.
    actions.setRevisionMode({ editMode: true });
    actions.createRevision({
      revisionId: '2badfa7f-369c-488c-bdde-df236b70eb36',
      cloneMode: 'EDIT_ALL_VALUES',
    });

    cy.log('current revision', store.getState().currentRevision);

    expect(store.getState().currentRevisionId).not.to.equal('2badfa7f-369c-488c-bdde-df236b70eb36');

    // Make our change.
    actions.removeInstance({
      path: [['name', 'c9470cec-05f4-4987-80ca-04eb7d835055']],
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
      // Assertions.

      expect(res.body.revision.deletedFields).to.exist;

      // Now we want to edit it again.
      cy.apiRequest({
        url: `/api/crowdsourcing/model/${fixture.body.id}`,
        method: 'get',
      }).then(modelRes => {
        const newModel = modelRes.body;

        cy.log('new model', newModel);

        // Let's create a second store with our new model.
        const secondStore = Revisions.createRevisionStore({
          captureModel: newModel as any,
        });
        const secondActions = secondStore.getActions();

        secondActions.setRevisionMode({ editMode: true });
        secondActions.createRevision({
          revisionId: res.body.revision.id,
          cloneMode: 'EDIT_ALL_VALUES',
        });

        cy.log('revision id', res.body.revision.id);
        cy.log('current revision', secondStore.getState());

        expect(secondStore.getState().currentRevision?.document.properties.name).to.have.lengthOf(1);
        const singleField: any = secondStore.getState().currentRevision?.document.properties.name[0];
        expect(singleField.value).to.equal('FIRST VALUE');
      });
    });
  });
});
