import React from 'react';
import { Breadcrumb } from 'semantic-ui-react';

type Props = {
  subtreePath: string[];
  popSubtree: (payload?: { count: number }) => void;
};

export const SubtreeBreadcrumb: React.FC<Props> = ({ popSubtree, subtreePath }) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Section
        onClick={subtreePath.length !== 0 ? () => popSubtree({ count: subtreePath.length }) : undefined}
      >
        Document root
      </Breadcrumb.Section>
      {subtreePath.map((path, n) => (
        <>
          {n !== subtreePath.length ? <Breadcrumb.Divider /> : null}
          <Breadcrumb.Section
            key={n}
            onClick={n !== subtreePath.length - 1 ? () => popSubtree({ count: subtreePath.length - n - 1 }) : undefined}
          >
            {path}
          </Breadcrumb.Section>
        </>
      ))}
    </Breadcrumb>
  );
};
