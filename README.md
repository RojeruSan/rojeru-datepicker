# 📅 Rojeru DatePicker

Una librería de selector de fechas moderna, ligera y personalizable con soporte para selección simple, rangos, hora, y modo oscuro automático.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Size](https://img.shields.io/badge/size-15KB-yellow)

## ✨ Características

- 🎯 **Selección simple o por rangos**
- ⏰ **Soporte para hora** (opcional)
- 🌙 **Modo oscuro automático** basado en clases CSS del documento
- 📱 **Totalmente responsive** y accesible
- 🎨 **Dos estilos de botones**: sólido y outline
- 🔧 **Altamente personalizable** con múltiples opciones
- 🚀 **Sin dependencias** - Vanilla JavaScript puro
- ♿ **Accesibilidad WCAG** compatible
- 🌍 **Soporte multi-idioma** (ES/EN)

## 📦 Instalación

### Opción 1: CDN (Recomendada)
```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rojeru-datepicker@1.0.0/dist/rojeru-datepicker.min.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/rojeru-datepicker@1.0.0/dist/rojeru-datepicker.min.js"></script>
```

### Opción 2: NPM
```text
npm install rojeru-datepicker
```
### Opción 3: Descarga manual
Descarga los archivos desde [GitHub]()

## 🚀 Uso básico

```html
<!-- HTML -->
<input type="text" id="miFecha">

<!-- JavaScript -->
<script>
const picker = new RojeruDatePicker({
    input: document.getElementById('miFecha'),
    type: 'single',
    format: 'dd/mm/YYYY',
    locale: 'es'
});
</script>
```

## ⚙️ Opciones de configuración
| Opción                 | Tipo            | Valor por defecto | Descripción                                                                 |
|------------------------|-----------------|-------------------|-----------------------------------------------------------------------------|
| `input`                | `HTMLElement`   | `null` (requerido)| Elemento `<input>` donde se mostrará la fecha.                             |
| `type`                 | `String`        | `'single'`        | Tipo de selección: `'single'` o `'range'`.                                 |
| `includeTime`          | `Boolean`       | `false`           | Si incluye selector de hora.                                               |
| `format`               | `String`        | `'dd/mm/YYYY'`    | Formato de fecha: `dd`, `d`, `mm`, `m`, `YYYY`, `YY`, etc.                 |
| `locale`               | `String`        | `'es'`            | Idioma: `'es'` o `'en'`.                                                   |
| `minDate`              | `Date`/`String` | `null`            | Fecha mínima permitida.                                                    |
| `maxDate`              | `Date`/`String` | `null`            | Fecha máxima permitida.                                                    |
| `mode`                 | `String`        | `'modal'`         | Modo de visualización: `'modal'` o `'dropdown'`.                           |
| `weekStart`            | `Number`        | `0`               | Primer día de la semana: `0` (Domingo) o `1` (Lunes).                      |
| `allowClear`           | `Boolean`       | `false`           | Muestra botón para limpiar selección.                                      |
| `position`             | `String`        | `'auto'`          | Posición del dropdown: `'auto'`, `'top'`, `'bottom'`.                      |
| `autoDarkMode`         | `Boolean`       | `true`            | Detecta automáticamente el modo oscuro del sistema.                        |
| `title`                | `String`        | `null`            | Título personalizado para el datepicker.                                   |
| `initialValue`         | `String`/`Object`| `null`           | Valor inicial (puede ser string o objeto de fecha).                        |
| `typeButtons`          | `String`        | `'solid'`         | Estilo de botones: `'solid'` o `'outline'`.                                |
| `onSelect`             | `Function`      | `null`            | Callback ejecutado al seleccionar una fecha.                               |
| `onClose`              | `Function`      | `null`            | Callback ejecutado al cerrar el datepicker.                                |
| `closeOnOverlayClick`  | `Boolean`       | `true`            | Cierra el datepicker al hacer clic fuera de él.                            |
## 📚 Ejemplos
### Fecha simple con hora
```javascript
const picker = new RojeruDatePicker({
    input: document.getElementById('fecha'),
    type: 'single',
    includeTime: true,
    format: 'dd/mm/YYYY',
    locale: 'es',
    allowClear: true,
    onSelect: (result) => {
        console.log('Fecha seleccionada:', result.date);
        console.log('Hora seleccionada:', result.time);
        console.log('Formateado:', result.formatted);
    }
});
```
### Rango de fechas con restricciones
```javascript
const picker = new RojeruDatePicker({
    input: document.getElementById('rango'),
    type: 'range',
    format: 'YYYY-mm-dd',
    locale: 'en',
    minDate: new Date('2024-01-01'),
    maxDate: new Date('2024-12-31'),
    weekStart: 1,
    title: 'Select your date range',
    onSelect: (result) => {
        console.log('Desde:', result.start);
        console.log('Hasta:', result.end);
    }
});
```
### Con valor inicial
```javascript
// Para fecha simple
const picker = new RojeruDatePicker({
    input: document.getElementById('fecha'),
    initialValue: '15/03/2024'
});

// Para rango
const picker = new RojeruDatePicker({
    input: document.getElementById('rango'),
    type: 'range',
    initialValue: {
        start: '01/03/2024',
        end: '15/03/2024'
    }
});
```
### Botones outline
```javascript
const picker = new RojeruDatePicker({
    input: document.getElementById('fecha'),
    typeButtons: 'outline',
    // Los botones tendrán estilo outline
});
```

## 🎨 Modo Oscuro
El datepicker detecta automáticamente el modo oscuro cuando detecta alguna de estas clases en el documento:

* .dark-mode
* .dark
* .theme-dark

También puedes forzarlo manualmente agregando la clase `rojeru-dark-mode` al elemento` .rojeru-datepicker.`
## 🌍 Internacionalización
### Soporta español e inglés. Para añadir más idiomas, extiende el método t() en la clase.
```javascript
// Ejemplo de agregar francés
RojeruDatePicker.prototype.t = function(key) {
    const translations = {
        es: { aceptar: 'Aceptar', cancelar: 'Cancelar', ... },
        en: { aceptar: 'Accept', cancelar: 'Cancel', ... },
        fr: { aceptar: 'Accepter', cancelar: 'Annuler', ... }
    };
    const lang = translations[this.options.locale] || translations.es;
    return lang[key] || `[${key}]`;
};
```

## 📱 Responsive
* En móviles (<768px) se usa siempre modo modal
* Tamaños ajustables mediante CSS custom properties
* Fuentes y espaciados adaptativos

## ♿ Accesibilidad
* Soporte completo para navegación por teclado
* Etiquetas ARIA en todos los elementos interactivos
* Alto contraste en modo oscuro/claro
* Focus states visibles

## 🔧 API de métodos
| Método          | Descripción                          |
|-----------------|--------------------------------------|
| `.open()`       | Abre el datepicker.                  |
| `.close()`      | Cierra el datepicker.                |
| `.clear()`      | Limpia la selección.                 |
| `.destroy()`    | Elimina todos los event listeners.   |
| `.setDate(date)`| Establece una fecha específica.      |
| `.getDate()`    | Obtiene la fecha seleccionada.       |

### 🛠️ Personalización CSS
```css
/* Variables CSS personalizables */
:root {
    --rojeru-primary: #3b82f6;
    --rojeru-secondary: #64748b;
    --rojeru-success: #22c55e;
    --rojeru-border-radius: 12px;
    --rojeru-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

## 📄 Licencia
MIT © Rogelio Urieta Camacho (RojeruSan)

## 🏆 Créditos
Desarrollado por Rogelio Urieta Camacho (RojeruSan)

## ❤️ Donaciones
[![Donar](https://img.shields.io/badge/Donar-PayPal-00457C?logo=paypal&style=for-the-badge)](https://www.paypal.com/donate/?cmd=_s-xclick&hosted_button_id=JLWEAETTE3H28&ssrt=1764941769118)