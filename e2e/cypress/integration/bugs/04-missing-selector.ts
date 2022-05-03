import { CaptureModel, RevisionRequest } from '@capture-models/types';

const missingReq = require('../../../../fixtures/97-bugs/04-missing-selector-req.json');

it('Bug with missing selector', () => {
  cy.loadFixture('97-bugs/04-missing-selector').then(original => {
    // 1. Check the fixture loaded correctly.
    cy.apiRequest<CaptureModel>({
      url: `/api/crowdsourcing/model/${missingReq.captureModelId}`,
      method: 'GET',
    }).then(res => {
      expect(res.body.document.properties.place[0].selector!.id).to.eq('c5e8c546-d529-484c-b59c-913b3259bb74');
      expect(res.body.document.properties.place[0].selector!.revisedBy).to.have.length(1);
    });

    // 2. Load the
    cy.apiRequest<RevisionRequest>({
      url: `/api/crowdsourcing/revision/${missingReq.revision.id}`,
      method: 'PUT',
      body: missingReq,
    }).then(res2 => {
      // 3. Make assertions.
      expect(res2.body.document.properties.place[0].selector!.id).to.eq('c5e8c546-d529-484c-b59c-913b3259bb74');
      expect(res2.body.document.properties.place[0].selector!.revisedBy).to.have.length(2);
      expect(res2.body.document.properties.place[0].selector!.revisedBy![0]!.id).to.eq(
        '9a046095-8ee7-4353-bc4d-54e000eda9f4'
      );
      expect(res2.body.document.properties.place[0].selector!.revisedBy![0]!.revises).to.eq(
        'c5e8c546-d529-484c-b59c-913b3259bb74'
      );
    });
  });
});
