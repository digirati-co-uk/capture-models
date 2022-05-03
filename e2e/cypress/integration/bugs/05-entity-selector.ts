import { CaptureModel, RevisionRequest } from '@capture-models/types';

const missingReq = require('../../../../fixtures/97-bugs/05-entity-selector-req.json');

it('should correctly store entity selectors', () => {
  cy.loadFixture('97-bugs/05-entity-selector').then(original => {
    // 2. Load the
    cy.apiRequest<RevisionRequest>({
      url: `/api/crowdsourcing/revision/${missingReq.revision.id}`,
      method: 'PUT',
      body: missingReq,
    }).then(res => {
      expect(res.body.document.properties.boxes[0].revision).to.eq(missingReq.revision.id);
      expect(res.body.document.properties.boxes[0].selector!.id).to.eq('845314e2-2bfa-4c9b-a3f7-44c78e201bdb');
      expect(res.body.document.properties.boxes[0].selector!.state.x).to.eq(1050);
      expect(res.body.document.properties.boxes[0].selector!.state.y).to.eq(800);
      expect(res.body.document.properties.boxes[0].selector!.state.width).to.eq(3470);
      expect(res.body.document.properties.boxes[0].selector!.state.height).to.eq(2370);
    });

    cy.apiRequest<CaptureModel>({
      url: `/api/crowdsourcing/model/${missingReq.captureModelId}?published=true`,
      method: 'GET',
    }).then(res => {
      expect(res.body.document.properties.boxes[0].selector!.id).to.eq('845314e2-2bfa-4c9b-a3f7-44c78e201bdb');
      expect(res.body.document.properties.boxes[0].selector!.state.x).to.eq(1050);
      expect(res.body.document.properties.boxes[0].selector!.state.y).to.eq(800);
      expect(res.body.document.properties.boxes[0].selector!.state.width).to.eq(3470);
      expect(res.body.document.properties.boxes[0].selector!.state.height).to.eq(2370);
    });
  });
});
