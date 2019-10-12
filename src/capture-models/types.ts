// #region input-types

export type BaseInput<T = never> = {
	label: string;
	value: string;
	// Default selector is always optional.
	selector?: Selector;
	// Hint to client, to inform the client if an autocomplete vocabulary is available
	//   for this property.
	autocomplete?: boolean;
	// Returns true if it should be used to identify a resource in a fallback model.
	//   Example: FOAF:person [ firstName, lastName ] may be set this to true, if a
	//   resource is identified as already existing in the vocabulary, then
	//   no other fields need to be completed. This is an additive feature, un-supporting
	//   clients or models can safely ignore the property.
	isResourceIdentifier?: boolean;
	// Optional, on the parent type
	conformsTo?: string;
	// Templates
	template?: T;
};

export type ModelField<T = never> = Partial<BaseInput<T>> & {
	type: 'model';
	fields: FieldMap<T>;
};

export type SimpleTextbox<T = never> = BaseInput<T> & {
	type: 'text-box';
};

export type SimpleTextarea<T = never> = BaseInput<T> & {
	type: 'text-area';
};

export type FieldReference<T = never> = Partial<BaseInput<T>> & {
	id: string;
	type: 'field';
};

// @todo stubs
export type CKEditor<T = never> = BaseInput<T> & { type: 'unknown' };
export type GoogleMapPicker<T = never> = BaseInput<T> & { type: 'unknown' };
export type StaticDropdown<T = never> = BaseInput<T> & { type: 'unknown' };
export type StaticAutocomplete<T = never> = BaseInput<T> & { type: 'unknown' };
export type DatePicker<T = never> = BaseInput<T> & { type: 'unknown' };

export type AllFields<T = never> =
	| ModelField<T>
	| FieldReference<T>
	| SimpleTextbox<T>
	| SimpleTextarea<T>
	| CKEditor<T>
	| GoogleMapPicker<T>
	| StaticDropdown<T>
	| StaticAutocomplete<T>
	| DatePicker<T>;

// #endregion input-types

// #region selectors
// @todo selectors.
export type Selector = any;
// #endregion selectors

// #region structure

export type FieldMapItem<T = never> = {
	template?: T;
	singleValue?: boolean;
	conformsTo: string;
	items: AllFields<T>[];
};

export type FieldMap<T, V = any, K = keyof V> = {
	[key: string]: FieldMapItem<T>;
};

export type AllStructures<T = never> = StructureChoice<T> | StructureModel<T>;

export type StructureLevel = {
	type: string;
	label: string;
	description: string;
	conformsTo?: string;
};

export type StructureModel<T = any, K extends keyof T = keyof T> = StructureLevel & {
	type: 'model';
	items: K[];
};

export type StructureChoice<T = never> = StructureLevel & {
	type: 'choice';
	items: AllStructures<T>[];
};

export type CaptureModel<T extends Templates = {}, F extends FieldMap<keyof T> = any> = {
	structure: AllStructures<F>;
	fields: F;
	templates: T;
};

export type Templates = {
	[name: string]: Partial<AllFields<never>>;
};

function makeStructure<T extends Templates, F extends FieldMap<keyof T>>(
	structure: AllStructures<F>,
	fields: F,
	templates: T
): CaptureModel<T, F> {
	return { structure, fields, templates };
}

// #endregion structure

// const empty = makeStructure(
// 	{
// 		type: 'choice',
// 		label: '',
// 		description: '',
// 		items: []
// 	},
// 	{},
// 	{}
// );

// Structure
// - composition of navigation and fields into models
// Flat field descriptions
// - Flat mapping for field types
// Drafts
// - List of models, implementing structure

// const captureModel = {
// 	structure: {},
// 	drafts: {
// 		'id-1234': {
// 			title: [ 'value1', 'value2' ]
// 		}
// 	},
// 	fields: {
// 		title: {
// 			conformsTo: 'dcterms:title',
// 			singleValue: true,
// 			template: 'some-template',
// 			items: [ { type: 'text-box', label: 'Title', value: '' } ]
// 		}
// 	},
// 	templates: {
// 		'some-template': { value: 'some default value', selector: { type: 'point', x: 123, y: 456 } }
// 	}
// };

const structure = makeStructure(
	{
		type: 'choice',
		label: 'Annotation this image',
		description: 'Place or description',
		items: [
			{
				type: 'model',
				label: 'Description',
				description: 'Enter a description',
				items: [ 'dcterms:title', 'dcterms:description' ]
			},
			{
				type: 'model',
				label: 'Person',
				description: 'Full place',
				items: [ 'people' ]
			}
		]
	},
	{
		// Outputs "string" - could be added facets in discovery config
		'dcterms:title': {
			conformsTo: 'dcterms:title',
			singleValue: true,
			items: [
				{
					type: 'text-box',
					label: 'Title',
					value: '',
					selector: {
						/* .. */
					}
				}
			]
		},
		// Outputs "string[]"
		// field-2.items.value = 'search'
		// [field-name].items.value = 'search'
		'dcterms:description': {
			conformsTo: 'dcterms:description',
			items: [
				{
					type: 'text-area',
					label: 'Title',
					value: '',
					selector: {
						/* .. */
					}
				}
			]
		},
		// Outputs { "dcterms:title": string; "dcterms:description": string[]; "@type": "schema:place" }
		// Ignore case for now.
		people: {
			conformsTo: 'foaf:Person',
			singleValue: false,
			items: [
				{
					type: 'model',
					label: 'Person',
					selector: {},
					fields: {
						// people.items.fields.field-3.items.value = 'search';
						// [model-name].items.fields[field-name].items.value = [term];
						'foaf:firstName': {
							conformsTo: 'foaf:firstName',
							singleValue: true,
							items: [ { type: 'text-box', label: 'First name', value: '' } ]
						},
						// Outputs "string[]"
						'foaf:lastName': {
							conformsTo: 'foaf:lastName',
							singleValue: true,
							items: [ { type: 'text-box', label: 'Last name', value: '' } ]
						}
					}
				}
			]
		}
	},
	{
		'template-1': { type: 'text-box', selector: {} }
	}
);
