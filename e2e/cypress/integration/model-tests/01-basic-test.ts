import { BaseField, CaptureModel, RevisionRequest } from '@capture-models/types';
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
    }).then(res => {
      // Capture model should equal.
      expect(res.body.captureModelId).to.equal(fixture.body.id);
      // Revision should equal.
      expect(res.body.revision.id).to.equal(revisionId);
      // Change we made to document.
      const labels: any[] = res.body.document.properties.label;
      const label = labels.find(l => l.revision === revisionId);
      expect((label as BaseField).value).to.equal('A second value');
    });

    cy.apiRequest<CaptureModel>({
      url: `/api/crowdsourcing/model/${fixture.body.id}`,
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
