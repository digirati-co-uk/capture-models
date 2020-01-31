import React, { useState } from 'react';
import { parseRdfVocab, RdfVocab } from './rdf-vocab';

export default { title: 'Utility|RDF Importer' };

export const SimpleFetch: React.FC = () => {
  const [xml, setXml] = useState<RdfVocab>();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async (url: string) => {
    setIsLoading(true);
    fetch(url)
      .then(r => r.text())
      .then(respXml => {
        setIsLoading(false);
        setXml(parseRdfVocab(respXml));
      });
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
            onClick={() =>
              onClick(
                'https://raw.githubusercontent.com/omeka/omeka-s/36e9bc2382440ec0abb6b9b8c59abf6beba89c6d/application/data/vocabularies/bibo.owl'
              )
            }
          >
            The Bibliographic Ontology
          </button>
        </li>
        <li>
          <button
            disabled={isLoading}
            onClick={() =>
              onClick('https://raw.githubusercontent.com/digirati-co-uk/annotation-vocab/master/crowds.rdf')
            }
          >
            Crowds (Madoc)
          </button>
        </li>
        <li>
          <button
            disabled={isLoading}
            onClick={() =>
              onClick('https://raw.githubusercontent.com/digirati-co-uk/annotation-vocab/master/madoc.rdf')
            }
          >
            Madoc
          </button>
        </li>
        <li>
          <button disabled={isLoading} onClick={() => onClick('https://ogp.me/ns/ogp.me.rdf')}>
            Open Graph - not working due to CORS
          </button>
        </li>
        <li>
          <button disabled={isLoading} onClick={() => onClick('https://www.w3.org/2009/08/skos-reference/skos.rdf#')}>
            SKOS - bug with hash on prefix
          </button>
        </li>
      </ul>
    </div>
  );
};
