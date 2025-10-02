// Asegura objetos base para el preset de jest-expo
if (typeof global.window === 'undefined') {
  global.window = {};
}
if (typeof global.navigator === 'undefined') {
  global.navigator = {};
}
// Algunos presets acceden/definen propiedades con defineProperty:
try {
  if (!('product' in global.navigator)) {
    Object.defineProperty(global.navigator, 'product', { value: 'ReactNative', configurable: true });
  }
} catch {}
