// build.js
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 Construyendo RojeruDatePicker...');

// Verificar que existen los archivos fuente
if (!fs.existsSync('src/rojeru-datepicker.js')) {
    console.error('❌ No se encuentra src/rojeru-datepicker.js');
    process.exit(1);
}

if (!fs.existsSync('src/rojeru-datepicker.css')) {
    console.error('❌ No se encuentra src/rojeru-datepicker.css');
    process.exit(1);
}

// Crear carpeta dist si no existe
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Copiar archivos sin minificar
fs.copyFileSync('src/rojeru-datepicker.js', 'dist/rojeru-datepicker.js');
fs.copyFileSync('src/rojeru-datepicker.css', 'dist/rojeru-datepicker.css');

console.log('✅ Archivos copiados a dist/');

// Minificar JavaScript
try {
    execSync('terser src/rojeru-datepicker.js -o dist/rojeru-datepicker.min.js --compress --mangle');
    console.log('✅ JavaScript minificado');
} catch (error) {
    console.warn('⚠️  No se pudo minificar JavaScript, usando versión sin minificar');
    fs.copyFileSync('src/rojeru-datepicker.js', 'dist/rojeru-datepicker.min.js');
}

// Minificar CSS
try {
    execSync('npx cleancss -O2 src/rojeru-datepicker.css -o dist/rojeru-datepicker.min.css');
    console.log('✅ CSS minificado');
} catch (error) {
    console.warn('⚠️  No se pudo minificar CSS, usando versión sin minificar');
    fs.copyFileSync('src/rojeru-datepicker.css', 'dist/rojeru-datepicker.min.css');
}

console.log('🎉 Build completado!');