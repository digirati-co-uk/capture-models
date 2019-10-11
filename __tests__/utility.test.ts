import { generateBlankField, makeStructure } from '../src/capture-models/utility';

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
							items: [ { type: 'text-box', label: 'First name', value: 'something' } ]
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

describe('test 2', () => {
	test('it', () => {
		expect(generateBlankField(structure, structure.fields['dcterms:title'])).toEqual({
			label: 'Title',
			selector: {},
			type: 'text-box',
			value: ''
		});
	});
});
