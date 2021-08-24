import { Revisions } from '@capture-models/editor';
import { BaseField, RevisionRequest } from '@capture-models/types';

it('should delete entities', () => {

  cy.loadFixture('97-bugs/03-delete-entity').then(fixture => {


    const store = Revisions.createRevisionStore({
      captureModel: fixture.body,
    });
    const actions = store.getActions();

    // 2. Create our revision.
    actions.setRevisionMode({ editMode: true });
    actions.createRevision({
      revisionId: 'e342fd09-8fb2-4456-92d9-c990e195526a',
      cloneMode: 'EDIT_ALL_VALUES',
    });

    actions.removeInstance({
      path: [['person', '22a1fbf0-d952-4146-8449-4aa3fa942aa2']],
    });

    console.log(store.getState());


  });

});
