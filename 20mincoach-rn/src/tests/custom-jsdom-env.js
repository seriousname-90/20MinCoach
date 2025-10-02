// src/tests/custom-jsdom-env.js
const JSDOMEnvironment = require('jest-environment-jsdom').TestEnvironment;

class CustomJsdomEnv extends JSDOMEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  async setup() {
    await super.setup();

    // Asegura objetos base ANTES del preset de jest-expo
    const g = this.global;

    if (!g.window) g.window = {};
    if (!g.navigator) g.navigator = {};

    // Algunos presets definen/leen esta prop con defineProperty
    try {
      if (!('product' in g.navigator)) {
        Object.defineProperty(g.navigator, 'product', {
          value: 'ReactNative',
          configurable: true,
        });
      }
    } catch {}
  }
}

module.exports = CustomJsdomEnv;
