import { BaseField, BaseSelector, CaptureModel, RevisionRequest } from '@capture-models/types';
import { generateId } from '@capture-models/helpers';

it('Creating a capture model', () => {
  cy.fixture('01-basic/01-single-field').then(fixture => {
    cy.log('Loading fixture');

    cy.task('get-token', {
      scope: ['models.admin', 'site.admin'],
      site: { id: 1, name: 'Test site' },
      user: { id: 2, name: 'Test user' },
      expiresIn: 24 * 60 * 60 * 365,
    }).then(token => {
      cy.request({
        url: `/api/crowdsourcing/model/${fixture.id}`,
        method: 'delete',
        auth: {
          bearer: token,
        },
      });

      cy.request({
        url: '/api/crowdsourcing/model',
        method: 'post',
        body: fixture,
        auth: {
          bearer: token,
        },
      })
        .its('body')
        .should(resp => {
          expect(resp.id).to.equal('f8302402-0c99-4eb9-88fe-9588f9366378');
        });
    });
  });
});

it('Updating a capture model', () => {
  cy.loadFixture('01-basic/01-single-field').then(fixture => {
    const model = fixture.body;

    // Set a new label
    model.document.properties.label[0].value = 'Some other value';

    cy.apiRequest<CaptureModel>({
      url: `/api/crowdsourcing/model/${model.id}`,
      method: 'PUT',
      body: model,
    }).then(resp => {
      // Same ID.
      expect(resp.body.id).to.equal('f8302402-0c99-4eb9-88fe-9588f9366378');

      // New label
      expect((resp.body.document.properties.label[0] as BaseField).value).to.equal('Some other value');
    });
  });
});

it('Creating a revision', () => {
  cy.loadFixture('01-basic/01-single-field').then(fixture => {
    const revisionId = generateId();
    const fieldId = generateId();
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
        structureId: 'e25a8ece-df85-4fc2-b6ad-0fd1006dd4c1',
        fields: ['label'],
      },
      document: {
        id: '0bc81bf9-807a-423e-a4b2-d8ada10de95a',
        type: 'entity',
        label: 'Label',
        labelledBy: 'label',
        properties: {
          label: [
            {
              id: fieldId,
              type: 'text-field',
              label: 'Name',
              value: 'A second value',
              revises: '9a98d760-56a3-4474-8080-346200910907',
              revision: revisionId,
            } as BaseField,
          ],
        },
      } as any,
      source: 'structure',
    };

    cy.apiRequest<RevisionRequest>({
      url: `/api/crowdsourcing/model/${fixture.body.id}/revision`,
      body: revisionRequest,
      method: 'post',
    });

    cy.apiRequest<RevisionRequest>({
      url: `/api/crowdsourcing/revision/${revisionRequest.revision.id}?show_revised=true`,
      method: 'get',
    }).then(res => {
      // Capture model should equal.
      expect(res.body.captureModelId).to.equal(fixture.body.id);
      // Revision should equal.
      expect(res.body.revision.id).to.equal(revisionId);
      // Change we made to document.
      const labels: any[] = res.body.document.properties.label;
      const label = labels.find(l => l.revision === revisionId);
      expect((label as BaseField).value).to.equal('A second value');

      expect(labels).to.have.lengthOf(2);
    });

    cy.apiRequest<CaptureModel>({
      url: `/api/crowdsourcing/model/${fixture.body.id}?published=true`,
    }).then(res => {
      const model = res.body;
      expect(model.revisions).to.have.lengthOf(0);
    });

    cy.apiRequest<CaptureModel>({
      url: `/api/crowdsourcing/model/${fixture.body.id}?published=false`,
    }).then(res => {
      const model = res.body;

      // We should have our revision.
      expect(model.revisions).to.have.lengthOf(1);

      // It should be our one.
      expect(model.revisions?.[0].id).to.equal(revisionId);

      // So now 2 fields
      expect(model.document.properties.label).to.have.lengthOf(2);

      // Our field should be in the response.
      const allFields = model.document.properties.label as BaseField[];
      const ourField = allFields.find(f => f.revision === revisionId) as BaseField;

      expect(ourField).not.to.be.undefined;
      expect(ourField.revision).to.equal(revisionId);
      expect(ourField.value).to.equal('A second value');
    });
  });
});

it('Creating a revision with revised selector', () => {
  cy.loadFixture('04-selectors/01-simple-selector').then(fixture => {
    const revisionId = generateId();
    const selectorId = generateId();
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
        structureId: '34083298-1792-4790-b909-e0166ea20a5d',
        fields: ['name'],
      },
      document: {
        id: 'd2820942-a460-41fb-94a8-878d952189c3',
        type: 'entity',
        properties: {
          name: [
            {
              id: '76e7ea6c-fcd1-4b71-aa8f-be5e100e755d',
              type: 'text-field',
              label: 'Name',
              description: 'The name of the thing',
              selector: {
                id: '0c15c2b8-48e9-4c83-b77e-054cd8215f93',
                type: 'box-selector',
                state: null,
                revisedBy: [
                  {
                    id: selectorId,
                    type: 'box-selector',
                    revisionId: revisionId,
                    state: { x: 1, y: 2, width: 3, height: 4 },
                  },
                ],
              } as BaseSelector,
              value: null,
            } as BaseField,
          ],
        },
      } as any,
      source: 'structure',
    };

    cy.apiRequest<RevisionRequest>({
      url: `/api/crowdsourcing/model/${fixture.body.id}/revision`,
      body: revisionRequest,
      method: 'post',
    });

    cy.apiRequest<RevisionRequest>({
      url: `/api/crowdsourcing/revision/${revisionRequest.revision.id}?show_revised=true`,
      method: 'get',
    }).then(res => {
      // Capture model should equal.
      expect(res.body.captureModelId).to.equal(fixture.body.id);
      // Revision should equal.
      expect(res.body.revision.id).to.equal(revisionId);
      // Change we made to document.
      const selector: any = res.body.document.properties.name[0].selector as any;

      expect(selector.id).to.equal('0c15c2b8-48e9-4c83-b77e-054cd8215f93');
      expect(selector.revisedBy).to.have.lengthOf(1);
      expect(selector.revisedBy[0].id).to.equal(selectorId);
      expect(selector.revisedBy[0].revisionId).to.equal(revisionId);
    });

    cy.apiRequest<CaptureModel>({
      url: `/api/crowdsourcing/model/${fixture.body.id}?published=true`,
    }).then(res => {
      const model = res.body;
      expect(model.revisions).to.have.lengthOf(0);
    });

    cy.apiRequest<CaptureModel>({
      url: `/api/crowdsourcing/model/${fixture.body.id}?published=false`,
    }).then(res => {
      const model = res.body;

      // We should have our revision.
      expect(model.revisions).to.have.lengthOf(1);

      // It should be our one.
      expect(model.revisions?.[0].id).to.equal(revisionId);
      expect(model.revisions?.[0].status).to.equal('draft');

      // So now 2 fields
      expect(model.document.properties.name).to.have.lengthOf(1);

      // Our field should be in the response.
      const selector: any = res.body.document.properties.name[0].selector as any;

      expect(selector.id).to.equal('0c15c2b8-48e9-4c83-b77e-054cd8215f93');
      expect(selector.revisedBy).to.have.lengthOf(1);
      expect(selector.revisedBy[0].id).to.equal(selectorId);
      expect(selector.revisedBy[0].revisionId).to.equal(revisionId);
    });
  });
});

it('Creating a revision with revised selector on entity', () => {
  cy.loadFixture('04-selectors/06-entity-selector').then(fixture => {
    const revisionId = generateId();
    const selectorId = generateId();
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
        structureId: 'e8258a74-eafa-4e24-9548-cf23ea8d03bb',
        fields: ['name', 'description', ['person', ['firstName', 'lastName']]],
      },
      document: {
        id: '2229b369-9b8c-461f-b931-1a2d07a359e3',
        type: 'entity',
        properties: {
          name: [
            {
              id: '20c0caad-9083-4348-a02b-2cec80a6adec',
              selector: {
                id: '52c6e7a7-c27c-4f6d-9404-07d30bc886b3',
                type: 'box-selector',
                state: null,
              },
              type: 'text-field',
              label: 'Name',
              description: 'The name of the thing',
            },
          ],
          description: [
            {
              id: '8dfe562b-bdba-46b8-8517-971acf48fd51',
              type: 'text-field',
              label: 'Description',
              description: 'Tell us something about the thing',
            },
          ],
          person: [
            {
              id: '985daf4f-da3e-4948-8e7d-5513acb2cd2f',
              type: 'entity',
              label: 'Person',
              selector: {
                id: 'ecee8404-11b1-4c44-b7a9-4c800b2ffd42',
                type: 'box-selector',
                state: null,
              },
              allowMultiple: true,
              properties: {
                firstName: [
                  {
                    id: '221824be-4566-45f1-bc15-fed59a2d83fe',
                    type: 'text-field',
                    label: 'First name',
                    value: 'first first name',
                  },
                ],
                lastName: [
                  {
                    id: '1234162e-a5d3-4357-8cad-5a3001b9a3a6',
                    type: 'text-field',
                    label: 'Last name',
                    value: 'first last name',
                  },
                ],
              },
              description: 'Describe a person',
            },
            {
              id: 'a58c6080-4ecb-4580-a7c5-730cd9f72580',
              type: 'entity',
              label: 'Person',
              allowMultiple: true,
              selector: {
                id: '3020f977-2304-43ee-9e0e-c7b9abf216b6',
                type: 'box-selector',
                state: null,
                revisedBy: [
                  {
                    id: selectorId,
                    type: 'box-selector',
                    revisionId: revisionId,
                    state: { x: 1, y: 2, width: 3, height: 4 },
                  },
                ],
              } as BaseSelector,
              properties: {
                firstName: [
                  {
                    id: '4b3440c4-6443-46d7-bdfd-e85736a1e254',
                    type: 'text-field',
                    label: 'First name',
                    value: 'second first name',
                  },
                ],
                lastName: [
                  {
                    id: '252468e6-8d78-4984-95af-549038ec6a57',
                    type: 'text-field',
                    label: 'Last name',
                    value: 'second last name',
                  },
                ],
              },
              description: 'Describe a person',
            },
          ],
        },
        label: 'Nested choices',
        description: '',
      } as any,
      source: 'structure',
    };

    cy.apiRequest<RevisionRequest>({
      url: `/api/crowdsourcing/model/${fixture.body.id}/revision`,
      body: revisionRequest,
      method: 'post',
    });

    cy.apiRequest<RevisionRequest>({
      url: `/api/crowdsourcing/revision/${revisionRequest.revision.id}?show_revised=true`,
      method: 'get',
    }).then(res => {
      // Capture model should equal.
      expect(res.body.captureModelId).to.equal(fixture.body.id);
      // Revision should equal.
      expect(res.body.revision.id).to.equal(revisionId);
      // Change we made to document.
      const selector: any = res.body.document.properties.person[1].selector as any;

      expect(selector.id).to.equal('3020f977-2304-43ee-9e0e-c7b9abf216b6');
      expect(selector.revisedBy).to.have.lengthOf(1);
      expect(selector.revisedBy[0].id).to.equal(selectorId);
      expect(selector.revisedBy[0].revisionId).to.equal(revisionId);
    });

    cy.apiRequest<CaptureModel>({
      url: `/api/crowdsourcing/model/${fixture.body.id}?published=false`,
    }).then(res => {
      const model = res.body;

      // We should have our revision.
      expect(model.revisions).to.have.lengthOf(1);

      // It should be our one.
      expect(model.revisions?.[0].id).to.equal(revisionId);

      // So now 2 fields
      expect(model.document.properties.name).to.have.lengthOf(1);

      // Our field should be in the response.
      const selector: any = res.body.document.properties.person[1].selector as any;

      expect(selector.id).to.equal('3020f977-2304-43ee-9e0e-c7b9abf216b6');
      expect(selector.revisedBy).to.have.lengthOf(1);
      expect(selector.revisedBy[0].id).to.equal(selectorId);
      expect(selector.revisedBy[0].revisionId).to.equal(revisionId);
    });
  });
});

it('creating a derived model', () => {
  // @todo.
});

it('Updating a revision', () => {
  // @todo.
});

it('Publishing a revision', () => {
  // @todo.
});

it('Returning only published fields', () => {
  // @todo.
});

it('Returning full model', () => {
  // @todo.
});

it('Simulate review process', () => {
  // @todo
});

it('Simulate direct editing process', () => {
  // @todo
});

it('Simulate rejection process', () => {
  // @todo
});
