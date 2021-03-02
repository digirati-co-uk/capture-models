/**
 * @jest-environment node
 */
const { createElement } = require('react');
const { renderToString } = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components');

describe('Editor SSR', () => {
  test('server side loading', () => {
    expect(() => {
      require('../dist/umd/@capture-models/editor');
      // require('../dist/assets/app');
    }).not.toThrow();
  });

  test('react ssr', () => {
    const editor = require('../dist/umd/@capture-models/editor');

    const sheet = new ServerStyleSheet(); // <-- creating out stylesheet

    const markup = renderToString(sheet.collectStyles(createElement(editor.RoundedCard, {}, ['Testing this works'])));
    const styles = sheet.getStyleTags(); // <-- getting all the tags from the sheet

    expect(markup).toMatchInlineSnapshot(
      `"<article class=\\"RoundedCard__CardWrapper-model-editor__cyia0t-2 jSxtdI\\"><div class=\\"RoundedCard__CardBody-model-editor__cyia0t-1 jXlLrs\\">Testing this works</div></article>"`
    );
    expect(styles).toMatchInlineSnapshot(`
      "<style data-styled=\\"true\\" data-styled-version=\\"5.2.1\\">.jXlLrs{font-size:13px;line-height:1.4em;color:#000;}/*!sc*/
      data-styled.g57[id=\\"RoundedCard__CardBody-model-editor__cyia0t-1\\"]{content:\\"jXlLrs,\\"}/*!sc*/
      .jSxtdI{position:relative;box-sizing:border-box;background:#fff;padding:20px;border-radius:10px;margin-bottom:30px;box-shadow:0 2px 41px 0 rgba(0,0,0,0.15);border:2px solid transparent;z-index:2;}/*!sc*/
      .jSxtdI:hover{border:2px solid transparent;}/*!sc*/
      data-styled.g58[id=\\"RoundedCard__CardWrapper-model-editor__cyia0t-2\\"]{content:\\"jSxtdI,\\"}/*!sc*/
      </style>"
    `);
  });
});
