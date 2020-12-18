// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />
/// <reference types="@capture-model/types" />

// in your TS file
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/class-name-casing
  interface cy {
    loadFixture(fixtureName: string): { then: (res: (model: { body: CaptureModel }) => void) => any };
    apiRequest<Return>(request: RequestBody | string): { then: (res: (model: { body: Return }) => void) => any };
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Chainable {
    // declare additional custom commands as methods, like
    // login(username: string, password: string)
    // loadFixture(fixtureName: string): { then: (res: (model: { body: any }) => void) => any };
  }
}
