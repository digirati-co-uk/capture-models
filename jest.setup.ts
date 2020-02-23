// const { configure } = require('enzyme');
// const Adapter = require('enzyme-adapter-react-16');
//
// configure({ adapter: new Adapter() });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeCaptureModel(): R;
    }
  }
}

expect.extend({
  toBeCaptureModel(received: any) {
    return {
      pass:
        received && received.id !== undefined && received.document !== undefined && received.structure !== undefined,
      message: () => 'Object is not a Capture Model',
    };
  },
});

export {};
