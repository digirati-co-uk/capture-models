import { RoundedCard } from '@capture-models/editor';
import React, { useEffect, useState } from 'react';

type FixtureList = Array<{
  name: string;
  items: Array<{ name: string; url: string; status?: 'loading' | 'done' }>;
}>;

export const Fixtures: React.FC = () => {
  const [fixtures, setFixtures] = useState<FixtureList>([]);

  useEffect(() => {
    fetch(`/crowdsourcing-editor/api/fixtures`)
      .then(r => r.json())
      .then(setFixtures);
  }, []);

  return (
    <div style={{ padding: 30 }}>
      {fixtures.map(fixture => (
        <RoundedCard key={fixture.name}>
          <h3>{fixture.name}</h3>
          <ul>
            {fixture.items.map(innerFixture => (
              <li key={innerFixture.name}>
                <a target="_blank" href={innerFixture.url}>
                  {innerFixture.name}
                </a>
              </li>
            ))}
          </ul>
        </RoundedCard>
      ))}
    </div>
  );
};
