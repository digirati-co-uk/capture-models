import { ViewColumn, ViewEntity } from 'typeorm/index';

@ViewEntity({
  name: 'published_fields',
  expression: `
    select (jsonb_path_query_first(cm.target, '$[*] ? (@.type == $type)', '{
  "type": "Canvas"
}'::jsonb)::jsonb -> 'id' ->> 0)::text        as canvas,
       (jsonb_path_query_first(cm.target, '$[*] ? (@.type == $type)', '{
         "type": "Manifest"
       }'::jsonb)::jsonb -> 'id' ->> 0)::text as manifest,
       (jsonb_path_query_first(cm.target, '$[*] ? (@.type == $type)', '{
         "type": "Collection"
       }'::jsonb)::jsonb -> 'id' ->> 0)::text as collection,
       field.id,
       field.value,
       field.type                as field_type,
       property.term             as property,
       property."rootDocumentId" as capture_model_id,
       document_property.term    as parent_property,
       document.label            as parent_label,
       si.state                  as selector,
       si.type                   as selector_type,
       dsi.state                  as parent_selector,
       dsi.type                   as parent_selector_type,
       cm.context
from field
         left join revision r on field."revisionId" = r.id and r.approved = true
         left join selector_instance si on field."selectorId" = si.id
         left join property on field."parentId" = property.id
         left join document on property."documentId" = document.id
         left join selector_instance dsi on document."selectorId" = dsi.id
         left join property document_property on document."parentId" = property.id
         left join capture_model cm on r."captureModelId" = cm.id
where r.approved = true
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
  field_type: string;

  @ViewColumn()
  value: string;

  @ViewColumn()
  property?: string;

  @ViewColumn()
  capture_model_id: string;

  @ViewColumn()
  parent_property: string;

  @ViewColumn()
  parent_label: string;

  @ViewColumn()
  selector?: any;

  @ViewColumn()
  selector_type?: string;

  @ViewColumn()
  parent_selector?: any;

  @ViewColumn()
  parent_selector_type?: string;

  @ViewColumn()
  context: string[];
}
