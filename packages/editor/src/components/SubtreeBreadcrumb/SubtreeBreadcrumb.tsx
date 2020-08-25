import React from 'react';
import { Breadcrumb, BreadcrumbDivider, BreadcrumbSection } from '../../atoms/Breadcrumb';

type Props = {
  subtreePath: string[];
  popSubtree: (payload?: { count: number }) => void;
};

export const SubtreeBreadcrumb: React.FC<Props> = ({ popSubtree, subtreePath }) => {
  return (
    <Breadcrumb>
      <BreadcrumbSection
        onClick={subtreePath.length !== 0 ? () => popSubtree({ count: subtreePath.length }) : undefined}
      >
        Document root
      </BreadcrumbSection>
      {subtreePath.map((path, n) => (
        <React.Fragment key={n}>
          {n !== subtreePath.length ? <BreadcrumbDivider>/</BreadcrumbDivider> : null}
          <BreadcrumbSection
            key={n}
            onClick={n !== subtreePath.length - 1 ? () => popSubtree({ count: subtreePath.length - n - 1 }) : undefined}
          >
            {path}
          </BreadcrumbSection>
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
};
