import './main.scss';

import React, { useState } from 'react';
import { render } from 'react-dom';
import { CaptureModel, AllStructures, StructureModel, FieldMap, FieldMapItem } from './capture-models/types';
import { makeStructure } from './capture-models/utility';
import { Button, IPanelProps, PanelStack, Card } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';

const model = makeStructure(
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
				type: 'choice',
				label: 'Inner 1',
				description: 'Inner 1 choice',
				items: [
					{
						type: 'choice',
						label: 'Inner 2',
						description: 'Inner 2 choice',
						items: [
							{
								type: 'choice',
								label: 'Inner 3',
								description: 'Inner 3 choice',
								items: [
									{
										type: 'model',
										label: 'Description',
										description: 'Enter a description',
										items: [ 'dcterms:title', 'dcterms:description' ]
									}
								]
							},
							{
								type: 'choice',
								label: 'Inner 4',
								description: 'Inner 4 choice',
								items: [
									{
										type: 'model',
										label: 'Description',
										description: 'Enter a description',
										items: [ 'dcterms:title', 'dcterms:description' ]
									}
								]
							}
						]
					},
					{
						type: 'choice',
						label: 'Inner 5',
						description: 'Inner 5 choice',
						items: [
							{
								type: 'model',
								label: 'Description',
								description: 'Enter a description',
								items: [ 'dcterms:title', 'dcterms:description' ]
							}
						]
					}
				]
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

const Navigation: React.FC<
	IPanelProps & { structure: AllStructures<any>; setActive: (model: StructureModel<any>) => void }
> = ({ structure, openPanel, setActive }) => {
	if (!structure) return null;
	return (
		<div>
			<h3>{structure.label}</h3>
			<p>{structure.description}</p>
			{structure.type === 'choice' ? (
				<div>
					{structure.items.map((choice) => (
						<div>
							<Button
								onClick={() =>
									choice.type === 'choice'
										? openPanel({
												component: Navigation,
												props: { structure: choice, setActive },
												title: choice.label
											})
										: setActive(choice)}
							>
								{choice.label}
							</Button>
						</div>
					))}
				</div>
			) : null}
		</div>
	);
};

const Form: React.FC<{
	captureModel: CaptureModel;
	fields: FieldMapItem[];
}> = ({ fields, captureModel }) => {
	console.log({ fields });

	return (
		<div>
			{fields.map((field) => {
				return (
					<div>
						{field.items.map((item) => {
							console.log({ field });
							if (item.type === 'model') {
								return <Form captureModel={captureModel} fields={Object.values(item)} />;
							}
							console.log(item);
							return (
								<div>
									{item.label} - {item.type}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

const App: React.FC = () => {
	const [ active, setActive ] = useState<StructureModel<{ [s in keyof typeof model.fields]: any }>>();

	if (active) {
		return (
			<div onClick={() => setActive(undefined)}>
				<Form fields={active.items.map((k) => model.fields[k])} active={active} />
			</div>
		);
	}

	return (
		<div>
			<h1>App</h1>
			<PanelStack
				className="panel-stack"
				initialPanel={{
					component: Navigation,
					title: model.structure.label,
					props: { structure: model.structure, setActive }
				}}
			/>
		</div>
	);
};

render(<App />, document.getElementById('root'));
