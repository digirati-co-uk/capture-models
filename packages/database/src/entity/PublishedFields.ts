import { ViewColumn, ViewEntity } from 'typeorm/index';

@ViewEntity({
  name: 'published_fields',
  expression: `
    select jsonb_path_query_first(cm.target, '$[*] ? (@.type == $type)', '{
  "type": "Canvas"
}'::jsonb)::jsonb -> 'id'        as canvas,
       jsonb_path_query_first(cm.target, '$[*] ? (@.type == $type)', '{
         "type": "Manifest"
       }'::jsonb)::jsonb -> 'id' as manifest,
       jsonb_path_query_first(cm.target, '$[*] ? (@.type == $type)', '{
         "type": "Collection"
       }'::jsonb)::jsonb -> 'id' as collection,
       field.id,
       field.value,
       field.type                as fieldType,
       property.term             as property,
       property."rootDocumentId" as captureModelId,
       document_property.term    as parentProperty,
       si.state                  as selector,
       si.type                   as selectorType,
       cm.context
from field
         left join revision r on field."revisionId" = r.id and r.approved = true
         left join selector_instance si on field."selectorId" = si.id
         left join property on field."parentId" = property.id
         left join document on property."documentId" = document.id
         left join property document_property on document."parentId" = property.id
         left join capture_model cm on r."captureModelId" = cm.id
  `,
})
export class PublishedFields {
  @ViewColumn()
  id: string;

  @ViewColumn()
  canvas: string;

  @ViewColumn()
  manifest: string | null;

  @ViewColumn()
  fieldType: string;

  @ViewColumn()
  value: string;

  @ViewColumn()
  property?: string;

  @ViewColumn()
  captureModelId: string;

  @ViewColumn()
  parentProperty: string;

  @ViewColumn()
  selector?: any;

  @ViewColumn()
  selectorType?: string;

  @ViewColumn()
  context: string[];
}
