import { CaptureModel } from '@capture-models/types';

it('Creating a capture model with a target', () => {
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

      const newFixture = { ...fixture, target: [{ type: 'canvas', id: `urn:madoc:canvas:123` }] };

      cy.request({
        url: '/api/crowdsourcing/model',
        method: 'post',
        body: newFixture,
        auth: {
          bearer: token,
        },
      })
        .its('body')
        .should(resp => {
          expect(resp.id).to.equal('f8302402-0c99-4eb9-88fe-9588f9366378');
          expect(resp.target[0].id).to.equal('urn:madoc:canvas:123');
          expect(resp.target[0].type).to.equal('canvas');
        });

      cy.apiRequest<any>({
        url: `/api/crowdsourcing/model?target_type=canvas&target_id=urn:madoc:canvas:123`,
        method: 'get',
      }).then(res => {
        expect(res.body).to.have.lengthOf(1);
        expect(res.body[0]).not.to.be.undefined;
      });
    });
  });
});

it('Creating a derived capture model with a target', () => {
  cy.loadFixture('01-basic/01-single-field').then(fixture => {
    const model: CaptureModel = fixture.body;
    cy.apiRequest<CaptureModel>({
      url: `/api/crowdsourcing/model/${model.id}/clone`,
      method: 'POST',
      body: {
        target: [{ type: 'Canvas', id: 'urn:madoc:canvas:123' }],
      },
    }).then(res => {
      const revision = res.body;
      expect(revision).to.exist;
      expect(revision.derivedFrom).to.equal(model.id);
    });

    cy.apiRequest({
      url: `/api/crowdsourcing/model?target_id=urn:madoc:canvas:123&target_type=Canvas&all_derivatives=true`,
    }).then(res => {
      expect(res.body).to.have.lengthOf(1);
    });
  });
});
