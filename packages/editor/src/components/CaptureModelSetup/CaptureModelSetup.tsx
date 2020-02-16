import React, { useMemo } from 'react';
import { Card, List, Tab } from 'semantic-ui-react';

type Props = {};

// Upload existing capture model from JSON
// Capture model from URL - fetching, needs right CORS
// Brand new capture model - from template
// Capture model from pouchdb local.
// All data stored on local only pouchdb
// Create next component screen

// Considerations
// - Plugin system for templates, similar but less complex than fields/selectors
// - Possible way to configure a couchdb backend in the future, with auth

export const CaptureModelSetup: React.FC<Props> = () => {
  const panes = useMemo(
    () => [
      {
        menuItem: 'Saved models',
        render: () => (
          <div style={{ padding: 20 }}>
            <List>
              {([] as any[]).map(model => {
                return (
                  <List.Item>
                    <List.Header>{model.structure.label}</List.Header>
                  </List.Item>
                );
              })}
            </List>
          </div>
        ),
      },
      {
        menuItem: 'Upload model',
        render: () => <div>Upload a new model</div>,
      },
      {
        menuItem: 'From URL',
        render: () => <div>Add model from URL.</div>,
      },
      {
        menuItem: 'From Template',
        render: () => <div>Add model from Template.</div>,
      },
    ],
    []
  );

  return (
    <Card style={{ margin: 40 }} fluid>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </Card>
  );
};
