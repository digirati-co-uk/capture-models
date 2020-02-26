import { assets } from './middleware/assets';
import { choiceRevisionApi } from './routes/api/choice-revision';
import { createCaptureModelApi } from './routes/api/create-capture-model';
import { createRevisionApi } from './routes/api/create-revision';
import { deleteCaptureModelApi } from './routes/api/delete-capture-model';
import { deleteRevisionApi } from './routes/api/delete-revision';
import { forkRevisionApi } from './routes/api/fork-revision';
import { updateRevisionApi } from './routes/api/update-revision';
import { TypedRouter } from './utility/typed-router';
import { captureModelApi } from './routes/api/capture-model';
import { revisionApi } from './routes/api/revision';
import { fixtures, testFixture } from './routes/fixtures';
import { indexPage } from './routes/view';

export const router = new TypedRouter({
  // Page routes.
  'index-page': [TypedRouter.GET, '/', indexPage],
  assets: [TypedRouter.GET, '/assets/main.js', assets],

  // API Routes.
  'capture-model': [TypedRouter.GET, '/api/model/:id', captureModelApi],
  'create-capture-model': [TypedRouter.POST, '/api/model', createCaptureModelApi],
  'delete-capture-model': [TypedRouter.DELETE, '/api/model/:id', deleteCaptureModelApi],
  'create-revision': [TypedRouter.POST, '/api/model/:captureModelId/revision', createRevisionApi],
  'choice-revision': [TypedRouter.GET, '/api/model/:captureModelId/structure/:structureId', choiceRevisionApi],
  'fork-revision': [TypedRouter.GET, '/api/model/:captureModelId/fork/:revisionId', forkRevisionApi],
  'update-revision': [TypedRouter.PUT, '/api/revision/:id', updateRevisionApi],
  'delete-revision': [TypedRouter.DELETE, '/api/revision/:id', deleteRevisionApi],
  revision: [TypedRouter.GET, '/api/revision/:id', revisionApi],

  // Fixture routes.
  'test-fixture': [TypedRouter.GET, '/test-fixture/:name/:file', testFixture],
  fixtures: [TypedRouter.GET, '/fixtures', fixtures],
});
