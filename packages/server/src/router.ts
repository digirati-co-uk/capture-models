import { captureModelExport } from './routes/api/capture-model-export';
import { captureModelListApi } from './routes/api/caputre-model-list';
import { choiceRevisionApi } from './routes/api/choice-revision';
import { cloneCaptureModel } from './routes/api/clone-capture-model';
import { createCaptureModelApi } from './routes/api/create-capture-model';
import { createRevisionApi } from './routes/api/create-revision';
import { deleteCaptureModelApi } from './routes/api/delete-capture-model';
import { deleteRevisionApi } from './routes/api/delete-revision';
import { forkRevisionApi } from './routes/api/fork-revision';
import { revisionListApi } from './routes/api/revision-list';
import { updateCaptureModelApi } from './routes/api/update-capture-model';
import { updateRevisionApi } from './routes/api/update-revision';
import { TypedRouter } from './utility/typed-router';
import { captureModelApi } from './routes/api/capture-model';
import { revisionApi } from './routes/api/revision';
import { cloneRevisionApi } from './routes/api/clone-revision';

export const router = new TypedRouter({
  // Page routes.
  // 'index-page': [TypedRouter.GET, '/crowdsourcing-editor/', indexPage],
  // assets: [TypedRouter.GET, '/crowdsourcing-editor/assets/:folder/:assetName', assets()],
  // 'assets-sub': [TypedRouter.GET, '/crowdsourcing-editor/assets/:folder/:subFolder/:assetName', assets()],

  // API Routes.
  'list-capture-models': [TypedRouter.GET, '/api/crowdsourcing/model', captureModelListApi],
  'capture-model': [TypedRouter.GET, '/api/crowdsourcing/model/:id', captureModelApi],
  'capture-model-export': [TypedRouter.GET, '/api/crowdsourcing/model/:id/json', captureModelExport],
  'create-capture-model': [TypedRouter.POST, '/api/crowdsourcing/model', createCaptureModelApi],
  'update-capture-model': [TypedRouter.PUT, '/api/crowdsourcing/model/:id', updateCaptureModelApi],
  'delete-capture-model': [TypedRouter.DELETE, '/api/crowdsourcing/model/:id', deleteCaptureModelApi],
  'clone-capture-model': [TypedRouter.POST, '/api/crowdsourcing/model/:id/clone', cloneCaptureModel],
  'create-revision': [TypedRouter.POST, '/api/crowdsourcing/model/:captureModelId/revision', createRevisionApi],
  'choice-revision': [
    TypedRouter.GET,
    '/api/crowdsourcing/model/:captureModelId/structure/:structureId',
    choiceRevisionApi,
  ],
  'fork-revision': [TypedRouter.GET, '/api/crowdsourcing/model/:captureModelId/fork/:revisionId', forkRevisionApi],
  'clone-revision': [TypedRouter.GET, '/api/crowdsourcing/model/:captureModelId/clone/:revisionId', cloneRevisionApi],
  'update-revision': [TypedRouter.PUT, '/api/crowdsourcing/revision/:id', updateRevisionApi],
  'delete-revision': [TypedRouter.DELETE, '/api/crowdsourcing/revision/:id', deleteRevisionApi],
  revision: [TypedRouter.GET, '/api/crowdsourcing/revision/:id', revisionApi],
  'revision-list': [TypedRouter.GET, '/api/crowdsourcing/revision', revisionListApi],
});
