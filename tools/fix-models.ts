import { traverseDocument } from '@capture-models/helpers/src/traverse-document';
import { traverseStructure } from '@capture-models/helpers/src/traverse-structure';
import { CaptureModel } from '@capture-models/types/src/index';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import path from 'path';
import { v4 } from 'uuid';

const dir = readdirSync(path.join(__dirname, '..', 'fixtures'));

const reg = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

for (const folder of dir) {
  if (!statSync(path.join(__dirname, '..', 'fixtures', folder)).isDirectory()) {
    continue;
  }
  const jsonList = readdirSync(path.join(__dirname, '..', 'fixtures', folder));

  for (const jsonName of jsonList) {
    const json: CaptureModel = JSON.parse(
      readFileSync(path.join(__dirname, '..', 'fixtures', folder, jsonName)).toString()
    );
    if (!Object.keys(json).length) {
      // Empty example.
      continue;
    }

    json.structure.label = `${folder.replace(/^(\d)+-/, '')} - ${jsonName
      .replace(/^(\d)+-/, '')
      .replace(/-/g, ' ')
      .replace(/(.json|\.)/, '')}`;

    const idMap: { [id: string]: string } = {};
    const getId = (id: string) => {
      if (!id) {
        return v4();
      }
      if (id.match(reg)) {
        return id;
      }
      if (!idMap[id]) {
        idMap[id] = v4();
      }
      return idMap[id];
    };

    traverseDocument(json.document, {
      visitField(field) {
        if (field.id) {
          field.id = getId(field.id);
        } else {
          field.id = v4();
        }
        if (field.revision) {
          field.revision = getId(field.revision);
        }
      },
      visitEntity(entity) {
        if (entity.id) {
          entity.id = getId(entity.id);
        } else {
          entity.id = v4();
        }
        if (!entity.label) {
          entity.label = 'Untitled entity';
        }
        if (entity.revision) {
          entity.revision = getId(entity.revision);
        }
        if (entity.authors) {
          entity.authors = entity.authors.map(getId);
        }
      },
      visitSelector(selector) {
        if (selector.id) {
          selector.id = getId(selector.id);
        } else {
          selector.id = v4();
        }
      },
    });

    traverseStructure(json.structure, structure => {
      if (structure.id) {
        structure.id = getId(structure.id);
      } else {
        structure.id = v4();
      }
    });

    if (json.contributors) {
      const newContributors = {};
      Object.keys(json.contributors).forEach(id => {
        if (json.contributors) {
          const newId = getId(json.contributors[id].id);
          json.contributors[id].id = newId;
          (newContributors as any)[newId] = json.contributors[id];
        }
      });
      json.contributors = newContributors;
    }

    if (json.revisions) {
      json.revisions.forEach(rev => {
        rev.id = getId(rev.id);
        if (rev.revises) {
          rev.revises = getId(rev.revises);
        }
        if (rev.authors) {
          rev.authors = rev.authors.map(getId);
        }
        if (rev.structureId) {
          rev.structureId = getId(rev.structureId);
        }
      });
    }

    if (json.id) {
      json.id = getId(json.id);
    } else {
      json.id = v4();
    }

    writeFileSync(path.join(__dirname, '..', 'fixtures', folder, jsonName), JSON.stringify(json, null, 2));
  }
}
