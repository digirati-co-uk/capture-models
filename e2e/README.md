# Test plan

## Endpoints
These are the core endpoints for the application

- `GET /api/crowdsourcing/model` - List all capture models
- `GET /api/crowdsourcing/model/:id` - Get single model
- `POST /api/crowdsourcing/model` - Create new model
- `PUT /api/crowdsourcing/model/:id` - Update whole model
- `DELETE /api/crowdsourcing/model/:id` - Delete model
- `POST /api/crowdsourcing/model/:captureModelId/revision` - Create a revision
- `PUT /api/crowdsourcing/revision/:id` - Update a single revision
- `DELETE /api/crowdsourcing/revision/:id` - Delete a revision
- `GET /api/crowdsourcing/revision/:id` - Get a single revision
- `GET /api/crowdsourcing/revision` - List all revisions
  

### Supplemental endpoints
- `POST /api/crowdsourcing/model/:id/clone` - Clone model **todo: explain**
- `GET /api/crowdsourcing/model/:id/json` - Export model as JSON
- `GET /api/crowdsourcing/search/published` - Search published fields
- `GET /api/crowdsourcing/model/:captureModelId/structure/:structureId` - Get a revision document for structure
- `GET /api/crowdsourcing/model/:captureModelId/fork/:revisionId` - Get a forked version of a revision
- `GET /api/crowdsourcing/model/:captureModelId/clone/:revisionId` - Get a cloned version of a revision
