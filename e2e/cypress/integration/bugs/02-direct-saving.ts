import { RevisionRequest } from '@capture-models/types';

const deleteRequest = require('../../../../fixtures/97-bugs/03-delete-entity-req');

it('should delete entities', () => {
  cy.loadFixture('97-bugs/03-delete-entity').then((original) => {
    // 2. Load the
    cy.apiRequest<RevisionRequest>({
      url: `/api/crowdsourcing/model/${original.body.id}`,
      method: 'PUT',
      body: deleteRequest,
    }).then((res2) => {
      // 3. Make assertions.
      expect(res2.body.document.properties['field-multiple-selector'].length).to.eq(3);
      expect(res2.body.document.properties['entity-multiple-selector'].length).to.eq(2);
      expect(res2.body.document.properties['entity-multiple'].length).to.eq(2);
      expect(res2.body.document.properties['field-multiple'].length).to.eq(2);
    });
  });
});
