import React, { useEffect, useState } from 'react';
import { parseRdfVocab, RdfVocab } from './rdf-vocab';

export default { title: 'Utility|RDF Importer' };

export const SimpleFetch: React.FC = () => {
  const [xml, setXml] = useState<RdfVocab>();

  const onClick = async (url: string) => {
    fetch(url)
      .then(r => r.text())
      .then(respXml => setXml(parseRdfVocab(respXml)));
  };

  if (xml) {
    return (
      <div>
        <button onClick={() => setXml(undefined)}>Go back</button>
        <table>
          <tbody>
            <tr>
              <td colSpan={3}>
                <strong>Properties</strong>
              </td>
            </tr>
            {xml.properties.map(prop => (
              <tr>
                <td>{prop.term}</td>
                <td>{prop.label}</td>
                <td>{prop.description}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={3}>
                <strong>Classes</strong>
              </td>
            </tr>
            {xml.classes.map(prop => (
              <tr>
                <td>{prop.term}</td>
                <td>{prop.label}</td>
                <td>{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      <h3>Choose vocab</h3>
      <ul>
        <li>
          <button
            onClick={() =>
              onClick(
                'https://raw.githubusercontent.com/omeka/omeka-s/36e9bc2382440ec0abb6b9b8c59abf6beba89c6d/application/data/vocabularies/dcterms.rdf'
              )
            }
          >
            DC Terms
          </button>
        </li>
        <li>
          <button
            onClick={() =>
              onClick(
                'https://raw.githubusercontent.com/omeka/omeka-s/36e9bc2382440ec0abb6b9b8c59abf6beba89c6d/application/data/vocabularies/foaf.rdf'
              )
            }
          >
            Friend of a Friend
          </button>
        </li>
        <li>
          <button
            onClick={() =>
              onClick(
                'https://raw.githubusercontent.com/omeka/omeka-s/36e9bc2382440ec0abb6b9b8c59abf6beba89c6d/application/data/vocabularies/dctype.rdf'
              )
            }
          >
            DC Type
          </button>
        </li>
        <li>
          <button
            onClick={() =>
              onClick(
                'https://raw.githubusercontent.com/omeka/omeka-s/36e9bc2382440ec0abb6b9b8c59abf6beba89c6d/application/data/vocabularies/bibo.owl'
              )
            }
          >
            The Bibliographic Ontology
          </button>
        </li>
      </ul>
    </div>
  );
};
