// Exportar la clase para uso en CommonJS
const RojeruDatePicker = require('./dist/rojeru-datepicker.js');

// También exportar para ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RojeruDatePicker;
}

// Si se usa en navegador, agregar al objeto global
if (typeof window !== 'undefined') {
    window.RojeruDatePicker = RojeruDatePicker;
}