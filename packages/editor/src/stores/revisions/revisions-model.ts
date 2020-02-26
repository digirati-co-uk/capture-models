import { BaseSelector, CaptureModel, RevisionRequest } from '@capture-models/types';
import { Action, Computed, Thunk } from 'easy-peasy';
import { SelectorModel } from '../selectors/selector-model';

/**
 * Revision model
 *
 * This takes in a map of revisions and will allow you to select a revision
 * and to edit fields (including selectors) on that revision. It's a step
 * after the navigation element. A revision can be optionally saved back to the
 * model or simply stored in a "local revisions" on the computer.
 *
 * There are a few entry-point for creating new revisions:
 * - Create new field using navigation through choices
 * - Seeing and editing existing (without permission to edit)
 * - Seeing and forking existing (intention of creating new = translation)
 *
 * Note: Editing subset of fields, detecting changed fields and only adding those
 *       as new revisions. Could be strict equality check on value so long as that works
 *       or field plugins could choose to implement custom logic for equality.
 *
 * Use case examples:
 * - 2 transcriptions, new user creates NEW revision each time [ createRevision ]
 * - Translation, new user forks revision to create NEW field (not merged) [ forkRevision ]
 * - Identifying people - user adds more data to existing person [ editRevision ]
 * - Identifying people - user proposes more data to existing person [ editRevision ]
 * - Identifying people - user creates new person [ createRevision ]
 * - Comments - user creates new comments always (behaviour driven by profile) [ createRevision ]
 *
 * Operations on models:
 * - [] capture model + revision id = filtered capture model
 * - [] capture model + user = filtered capture model
 * - [] capture model + user = revisions list
 * - [] capture model + revision = new capture model
 * - capture model + capture model + revision + user = true/false (validation)
 *
 * Sketch Notes:
 * - Create revision from model fields in choice
 * - Create form from revision
 * - Create form from user
 * - Edit revision - similar to model
 * - Save revision to server, taking couchdb rev id
 * - Verify revision
 * - Remove revision
 * - Merge revision (manual)
 * - Filtering revisions (for users)
 *
 * Remaining things:
 * - How to label structures in the UI?
 * - Revisions should have structure ID.
 */
export type RevisionsModel = {
  revisions: {
    [key: string]: RevisionRequest;
  };

  // The revision.
  currentRevisionId: string | null;
  currentRevision: Computed<RevisionsModel, RevisionRequest | null>;
  unsavedRevisionIds: string[];

  // A slightly split out model for the selectors.
  selector: SelectorModel;

  // Actions
  createRevision: Action<
    RevisionsModel,
    // Either a structure id, fields (/w optional structure ID) and always an optional revises.
    { revisionId: string; cloneMode: REVISION_CLONE_MODE; modelMapping?: { [key: string]: string } }
  >;
  saveRevision: Action<RevisionsModel, { revisionId: string }>;
  selectRevision: Action<RevisionsModel, { revisionId: string }>;
  deselectRevision: Action<RevisionsModel, { revisionId: string }>;
  // discardRevisionChanges(rid) -- maybe

  // Fields and selector state.
  updateFieldValue: Action<RevisionsModel, { path: Array<[string, string]>; revisionId?: string; value: any }>;
  updateFieldSelector: Action<RevisionsModel, { path: Array<[string, string]>; revisionId?: string; state: any }>;
  updateEntitySelector: Action<RevisionsModel, { path: Array<[string, string]>; revisionId?: string; state: any }>;

  // Field instances (for allowMultiple=true)
  createNewFieldInstance: Action<
    RevisionsModel,
    { path: Array<[string, string]>; revisionId?: string; property: string }
  >;
  createNewEntityInstance: Action<
    RevisionsModel,
    { path: Array<[string, string]>; revisionId?: string; property: string }
  >;
  // Remove a field OR entity instance when provided with a path.
  removeInstance: Action<RevisionsModel, { path: Array<[string, string]>; revisionId?: string }>;

  // And some selector actions
  chooseSelector: Action<RevisionsModel, { selectorId: string }>;
  clearSelector: Action<RevisionsModel>;
  updateSelector: Action<RevisionsModel, { selectorId: string; state: BaseSelector['state'] }>;
  updateCurrentSelector: Thunk<RevisionsModel, BaseSelector['state']>;
  updateSelectorPreview: Action<RevisionsModel, { selectorId: string; preview: any }>;
  setTopLevelSelector: Action<RevisionsModel, { selectorId: string }>;
  clearTopLevelSelector: Action<RevisionsModel>;
  addVisibleSelectorIds: Action<RevisionsModel, { selectorIds: string[] }>;
  removeVisibleSelectorIds: Action<RevisionsModel, { selectorIds: string[] }>;
  // And some computed values. (Removed for now)
  // currentSelector: Computed<RevisionsModel, SelectorTypes | null>;
  // visibleSelectors: Computed<RevisionsModel, SelectorTypes[]>;
  setCaptureModel: Action<
    RevisionsModel,
    { captureModel: CaptureModel; initialRevision?: string; excludeStructures?: boolean }
  >;
};

export type EDIT_ALL_VALUES = 'EDIT_ALL_VALUES';
export type FORK_ALL_VALUES = 'FORK_ALL_VALUES';
export type FORK_TEMPLATE = 'FORK_TEMPLATE';

export type REVISION_CLONE_MODE =
  // Editing all of the values will keep the IDs and when saving back will either
  // directly edit the original fields, or be a new revision targeting those fields.
  | EDIT_ALL_VALUES
  // This will use an existing revision as a starting point, cloning all of the current
  // values, enumerated values, selectors and structure. The IDs of all of the fields
  // that are enumerable will be different. Fields become a change request if selected
  // fields are not enumerable, but will be filtered out if not changed.
  | FORK_ALL_VALUES
  // This will use an existing revision as a template, cloning all of the structure
  // and removing all of the values, selectors, following the template rules.
  | FORK_TEMPLATE;
// @todo some extensions to this model:
// Same as above, but does not remove selectors. NOT YET SUPPORTED.
//| 'FORK_TEMPLATE_WITH_SELECTORS'
// This will use an existing revision as a template, removing ALL of the values
// and selectors regardless of the template rules. NOT YET SUPPORTED.
//| 'FORK_STRUCTURE';
