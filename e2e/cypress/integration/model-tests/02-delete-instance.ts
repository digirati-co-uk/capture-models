// 1. - Model with more than one instance.
//    - Revision request to delete an instance
// 2. - Model with only single instance
//    - Revision request to delete it (nuke the contents)
// 3. - Published models with deleted items
//    - Test helpers to filter deleted items
//    - Deleted items should not appear in published endpoints
import { generateId, traverseDocument } from '@capture-models/helpers';
import { CaptureModel, RevisionRequest } from '@capture-models/types';

it('deleting a field in a deeply nested model', () => {
  cy.loadFixture('02-nesting/04-deeply-nested-mixed-instance').then(fixture => {
    const revisionId = generateId();
    const revisionRequest: RevisionRequest = {
      author: {
        id: `urn:madoc:user:2`,
        type: 'Person',
        name: 'Test user',
      },
      captureModelId: fixture.body.id,
      revision: {
        id: revisionId,
        status: 'accepted',
        fields: [],
        deletedFields: ['a616e598-2443-43e7-9b4a-56b05d4b9345'],
      },
      document: {} as any,
      source: 'canonical',
    };

    cy.apiRequest<RevisionRequest>({
      url: `/api/crowdsourcing/model/${fixture.body.id}/revision`,
      body: revisionRequest,
      method: 'post',
    }).then(res => {
      // Capture model should equal.
      expect(res.body.captureModelId).to.equal(fixture.body.id);
      // Revision should equal.
      expect(res.body.revision.id).to.equal(revisionId);
      // Change we made to document.
      expect(res.body.revision.deletedFields).to.contain('a616e598-2443-43e7-9b4a-56b05d4b9345');
    });

    cy.apiRequest<CaptureModel>({
      url: `/api/crowdsourcing/model/${fixture.body.id}`,
    }).then(res => {
      const model = res.body;

      // We should have our revision.
      expect(model.revisions).to.have.lengthOf(1);

      // It should be our one.
      expect(model.revisions?.[0].id).to.equal(revisionId);

      expect(model.revisions?.[0].deletedFields).to.contain('a616e598-2443-43e7-9b4a-56b05d4b9345');

      let found = false;
      traverseDocument(model.document, {
        visitField(field) {
          if (field.id === 'a616e598-2443-43e7-9b4a-56b05d4b9345') {
            found = true;
          }
        },
      });
      expect(found).to.equal(false);
    });
  });
});

it('deleting a the last field in a deeply nested model', () => {
  cy.loadFixture('02-nesting/04-deeply-nested-mixed-instance').then(fixture => {
    const revisionId = generateId();
    const revisionRequest: RevisionRequest = {
      author: {
        id: `urn:madoc:user:2`,
        type: 'Person',
        name: 'Test user',
      },
      captureModelId: fixture.body.id,
      revision: {
        id: revisionId,
        status: 'accepted',
        fields: [],
        deletedFields: ['e3a2be45-88f9-476b-b7de-7a089cdf104f'],
      },
      document: {} as any,
      source: 'canonical',
    };

    cy.apiRequest<RevisionRequest>({
      url: `/api/crowdsourcing/model/${fixture.body.id}/revision`,
      body: revisionRequest,
      method: 'post',
    }).then(res => {
      // Capture model should equal.
      expect(res.body.captureModelId).to.equal(fixture.body.id);
      // Revision should equal.
      expect(res.body.revision.id).to.equal(revisionId);
      // Change we made to document.
      expect(res.body.revision.deletedFields).to.contain('e3a2be45-88f9-476b-b7de-7a089cdf104f');
    });

    cy.apiRequest<CaptureModel>({
      url: `/api/crowdsourcing/model/${fixture.body.id}`,
    }).then(res => {
      const model = res.body;

      // We should have our revision.
      expect(model.revisions).to.have.lengthOf(1);

      // It should be our one.
      expect(model.revisions?.[0].id).to.equal(revisionId);

      expect(model.revisions?.[0].deletedFields).to.contain('e3a2be45-88f9-476b-b7de-7a089cdf104f');

      let found = false;
      traverseDocument(model.document, {
        visitField(field) {
          if (field.id === 'e3a2be45-88f9-476b-b7de-7a089cdf104f') {
            found = true;
          }
        },
      });
      expect(found).to.equal(false, 'Field was not removed');

      // But also check if a new one was minted at the right place without a value.
      traverseDocument(model.document, {
        visitEntity(entity) {
          if (entity.id === '8ac324b8-23a7-4533-8ef5-4739fa035697') {
            // @ts-ignore
            expect(entity.properties.name[0].value).to.equal('');
          }
        },
      });
    });
  });
});

it('deleting a the last field in a deeply nested model (as a draft)', () => {
  cy.loadFixture('02-nesting/04-deeply-nested-mixed-instance').then(fixture => {
    const revisionId = generateId();
    const revisionRequest: RevisionRequest = {
      author: {
        id: `urn:madoc:user:2`,
        type: 'Person',
        name: 'Test user',
      },
      captureModelId: fixture.body.id,
      revision: {
        id: revisionId,
        status: 'draft',
        fields: [],
        deletedFields: ['e3a2be45-88f9-476b-b7de-7a089cdf104f'],
      },
      document: {} as any,
      source: 'canonical',
    };

    cy.apiRequest<RevisionRequest>({
      url: `/api/crowdsourcing/model/${fixture.body.id}/revision`,
      body: revisionRequest,
      method: 'post',
    }).then(res => {
      // Capture model should equal.
      expect(res.body.captureModelId).to.equal(fixture.body.id);
      // Revision should equal.
      expect(res.body.revision.id).to.equal(revisionId);
      // Change we made to document.
      expect(res.body.revision.deletedFields).to.contain('e3a2be45-88f9-476b-b7de-7a089cdf104f');
    });

    cy.apiRequest<CaptureModel>({
      url: `/api/crowdsourcing/model/${fixture.body.id}`,
    }).then(res => {
      const model = res.body;

      // We should have our revision.
      expect(model.revisions).to.have.lengthOf(1);

      // It should be our one.
      expect(model.revisions?.[0].id).to.equal(revisionId);

      expect(model.revisions?.[0].deletedFields).to.contain('e3a2be45-88f9-476b-b7de-7a089cdf104f');

      let found = false;
      traverseDocument(model.document, {
        visitField(field) {
          if (field.id === 'e3a2be45-88f9-476b-b7de-7a089cdf104f') {
            found = true;
          }
        },
      });
      expect(found).to.equal(true, 'Field was mistakenly removed');

      // But also check if a new one was minted at the right place without a value.
      traverseDocument(model.document, {
        visitEntity(entity) {
          if (entity.id === '8ac324b8-23a7-4533-8ef5-4739fa035697') {
            // @ts-ignore
            expect(entity.properties.name[0].id).to.equal('e3a2be45-88f9-476b-b7de-7a089cdf104f');
            // @ts-ignore
            expect(entity.properties.name[0].value).to.equal('One instance at the depth');
          }
        },
      });
    });
  });
});
