import { BaseField, CaptureModel, RevisionRequest } from '@capture-models/types';

it('Should keep properties when approving a revision', () => {
  const revisionRequest = {
    captureModelId: '5b49767b-f79b-4039-b933-9c917498dc42',
    revision: {
      structureId: '9c2c6558-703d-4276-ac44-01c78e66ecef',
      label: 'Default',
      id: '7b0052c9-ff2c-4463-b198-c6bcc6d18606',
      fields: ['regionOfInterest'],
      status: 'accepted',
      revises: null,
      authors: ['ca7c97bb-78ab-44ec-82be-e559eaf6c7df'],
    },
    document: {
      id: '4f6d0447-b3fa-4ed9-b137-7f6e68f4849c',
      type: 'entity',
      label: 'Untitled document',
      properties: {
        regionOfInterest: [
          {
            id: '3930eefd-50bf-40f1-9ed6-f7c59aea693c',
            type: 'text-field',
            label: 'regionOfInterest',
            value: 'tests with a change',
            revises: '48304e90-4257-4cbd-b3ef-4c8fcfb45b96',
            selector: { id: '01a9a2fd-bb23-4cfa-b3b4-7be643c66a15', type: 'box-selector', state: null },
            revision: '7b0052c9-ff2c-4463-b198-c6bcc6d18606',
          },
        ],
      },
    },
    source: 'structure',
    status: 'accepted',
  };

  cy.loadFixture('97-bugs/01-approve-revision');

  // Before loading, check that we cannot access using published = true

  cy.apiRequest<CaptureModel>({
    url: `/api/crowdsourcing/model/${revisionRequest.captureModelId}?published=true`,
    method: 'GET',
  }).then(res => {
    expect(res.body.document.properties.regionOfInterest).to.have.length(1);
  });

  cy.apiRequest<RevisionRequest>({
    url: `/api/crowdsourcing/revision/${revisionRequest.revision.id}`,
    method: 'PUT',
    body: revisionRequest,
  }).then(res => {
    expect(res.body.document.properties.regionOfInterest).not.to.be.undefined;
    expect((res.body.document.properties.regionOfInterest[1] as BaseField).value).to.equal('tests with a change');
    expect(res.body.revision).to.deep.equal({
      structureId: '9c2c6558-703d-4276-ac44-01c78e66ecef',
      approved: true,
      label: 'Default',
      id: '7b0052c9-ff2c-4463-b198-c6bcc6d18606',
      fields: ['regionOfInterest'],
      status: 'accepted',
      revises: null,
      authors: ['ca7c97bb-78ab-44ec-82be-e559eaf6c7df'],
      deletedFields: null,
    });
  });

  cy.apiRequest<CaptureModel>(`/api/crowdsourcing/model/${revisionRequest.captureModelId}`).then(res => {
    const model = res.body as any;

    expect(res.body.document.properties.regionOfInterest).to.have.length(2);

    const firstRegion = model.document.properties.regionOfInterest.find(({ value }: any) => value === '');
    const secondRegion = model.document.properties.regionOfInterest.find(
      ({ value }: any) => value === 'tests with a change'
    );

    expect(firstRegion).to.deep.equal({
      // The original field is retained.
      id: '48304e90-4257-4cbd-b3ef-4c8fcfb45b96',
      type: 'text-field',
      label: 'regionOfInterest',
      value: '',
      selector: { id: '6353eac6-518d-4a28-a598-b251f754db9c', type: 'box-selector', state: null },
    });
    expect(secondRegion).to.deep.equal({
      id: '3930eefd-50bf-40f1-9ed6-f7c59aea693c',
      type: 'text-field',
      label: 'regionOfInterest',
      value: 'tests with a change',
      // Here it will replace the other field tha
      // t's visible.
      // @todo what happens when 2 fields revise the same field? This is a situation where there is a conflict
      //       that needs to be fixed in the model.
      revises: '48304e90-4257-4cbd-b3ef-4c8fcfb45b96',
      selector: { id: '01a9a2fd-bb23-4cfa-b3b4-7be643c66a15', type: 'box-selector', state: null },
      revision: '7b0052c9-ff2c-4463-b198-c6bcc6d18606',
    });


    cy.apiRequest<CaptureModel>({
      url: `/api/crowdsourcing/model/${revisionRequest.captureModelId}?published=true`,
      method: 'GET',
    }).then(res => {
      expect(res.body.document.properties.regionOfInterest).to.have.length(2);
    });
  });
});
