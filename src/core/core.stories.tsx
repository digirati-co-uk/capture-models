import {
  CaptureModelProvider,
  useCaptureModel,
  useCurrentForm,
  useNavigation,
} from './captureModelContext';
import { CaptureModel } from '../types/capture-model';
import React, { useEffect } from 'react';
import { FieldTypes } from '../types/field-types';

export default { title: 'Core stories' };

const model: CaptureModel = {
  structure: {
    type: 'choice',
    label: 'Annotate this book',
    description: 'Add some details on this book, or leave a review',
    items: [
      {
        type: 'choice',
        label: 'Desribe this book',
        items: [
          {
            type: 'model',
            label: 'Basic information',
            fields: ['name', 'description', 'author'],
          },
          {
            type: 'model',
            label: 'Add an ISBN number',
            fields: ['isbn'],
          },
        ],
      },
      {
        type: 'model',
        label: 'Add a review',
        fields: ['review'],
      },
      {
        type: 'model',
        label: 'Rate this book',
        fields: [['review', ['author', 'datePublished', 'reviewRating']]],
      },
    ],
  },
  document: {
    '@context': 'http://schema.org',
    conformsTo: 'Book',
    type: 'entity',
    properties: {
      name: [
        {
          type: 'text-box',
          term: 'name',
          label: 'Enter the name of the book',
          value: "The Hitchhiker's Guide to the Galaxy",
        },
      ],
      description: [
        {
          type: 'text-area',
          term: 'description',
          label: 'Enter a description of the book',
          value:
            "The Hitchhiker's Guide to the Galaxy is the first of five books in the Hitchhiker's Guide to the Galaxy comedy science fiction \"trilogy\" by Douglas Adams. The novel is an adaptation of the first four parts of Adams' radio series of the same name.",
        },
      ],
      isbn: [
        {
          type: 'text-box',
          term: 'isbn',
          label: 'Enter the ISBN',
          value: '0345391802',
        },
      ],
      author: [
        {
          type: 'viaf-lookup',
          term: 'author',
          label: 'Author',
          'viaf-nametype': 'personal',
          value: {
            '@id': 'http://viaf.org/viaf/113230702',
            label: 'Douglas Adams',
          },
        },
      ],
      review: [
        {
          type: 'entity',
          conformsTo: 'Review',
          properties: {
            author: [
              {
                type: 'text-box',
                term: 'author',
                label: 'Enter your name',
                value: 'John Doe',
              },
            ],
            datePublished: [
              {
                type: 'current-date',
                term: 'datePublished',
                format: 'YYYY-MM-DD',
                value: '2019-10-10',
              },
            ],
            name: [
              {
                type: 'text-box',
                term: 'name',
                label: 'Short name of your review',
                value: 'A masterpiece of literature',
              },
            ],
            reviewBody: [
              {
                type: 'text-area',
                term: 'reviewBody',
                label: 'Write your review',
                value:
                  'Very simply, the book is one of the funniest SF spoofs ever written, with hyperbolic ideas folding in on themselves',
              },
            ],
            reviewRating: [
              { term: 'reviewRating', type: 'star-rating', max: 5, value: 5 },
            ],
          },
        },
        {
          type: 'entity',
          conformsTo: 'Review',
          properties: {
            author: [
              {
                term: 'author',
                type: 'text-box',
                label: 'Enter your name',
                value: 'John Smith',
              },
            ],
            datePublished: [
              {
                term: 'datePublished',
                type: 'current-date',
                format: 'YYYY-MM-DD',
                value: '2019-10-11',
              },
            ],
            name: [
              {
                term: 'name',
                type: 'text-box',
                label: 'Short name of your review',
                value: '',
              },
            ],
            reviewBody: [
              {
                term: 'reviewBody',
                type: 'text-area',
                label: 'Write your review',
                value: '',
              },
            ],
            reviewRating: [
              { type: 'star-rating', max: 5, value: 4, term: 'reviewRating' },
            ],
          },
        },
        {
          type: 'entity',
          conformsTo: 'Review',
          properties: {
            author: [
              {
                term: 'author',
                type: 'text-box',
                label: 'Enter your name',
                value: 'Jane Doe',
              },
            ],
            datePublished: [
              {
                term: 'datePublished',
                type: 'current-date',
                format: 'YYYY-MM-DD',
                value: '2019-10-12',
              },
            ],
            name: [
              {
                term: 'name',
                type: 'text-box',
                label: 'Short name of your review',
                value: 'A great book',
              },
            ],
            reviewBody: [
              {
                term: 'reviewBody',
                type: 'text-area',
                label: 'Write your review',
                value: "It's very great",
              },
            ],
            reviewRating: [
              { term: 'reviewRating', type: 'star-rating', max: 5, value: 5 },
            ],
          },
        },
      ],
    },
  },
};

const Simple: React.FC = () => {
  const { captureModel } = useCaptureModel();

  return <h1>{captureModel.structure.label}</h1>;
};

export const simpleUseCaptureModel: React.FC = () => (
  <CaptureModelProvider captureModel={model}>
    <Simple />
  </CaptureModelProvider>
);

const SimpleNav: React.FC = () => {
  const { currentView, pushPath, currentPath, popPath } = useNavigation();

  if (!currentView) {
    return null;
  }

  return (
    <div>
      {currentPath.length ? <button onClick={popPath}>back</button> : null}
      <h1>{currentView.label}</h1>
      <p>{currentView.description}</p>
      <ul>
        {currentView.type === 'choice'
          ? currentView.items.map((item, idx) => (
              <li onClick={() => pushPath(idx)}>{item.label}</li>
            ))
          : 'We are on a form!'}
      </ul>
    </div>
  );
};

export const simpleUseNavigation: React.FC = () => (
  <CaptureModelProvider captureModel={model}>
    <SimpleNav />
  </CaptureModelProvider>
);

const SimpleForm: React.FC = () => {
  const { currentFields, updateFieldValue } = useCurrentForm();
  const { replacePath } = useNavigation();

  useEffect(() => {
    replacePath([0, 1]);
    // @todo fix this bug with the memo behaviour of deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {currentFields.map(fields => (
        <div>
          {(fields as FieldTypes[]).map((field, idx) => (
            <ul>
              <li>
                <strong>Label: </strong> {field.label}
              </li>
              <li>
                <strong>Description: </strong> {field.description}
              </li>
              <li>
                <strong>Type: </strong> {field.type}
              </li>
              <li>
                <strong>Value: </strong> {field.value}{' '}
                <button
                  onClick={() =>
                    updateFieldValue(
                      [[field.term, idx]],
                      `${new Date().getTime()}`
                    )
                  }
                >
                  Update value
                </button>
              </li>
            </ul>
          ))}
        </div>
      ))}
    </div>
  );
};

export const simpleUseCurrentForm: React.FC = () => (
  <CaptureModelProvider captureModel={model}>
    <SimpleForm />
  </CaptureModelProvider>
);
