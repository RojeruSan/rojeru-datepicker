<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rojeru DatePicker Demo</title>
    <link rel="stylesheet" href="../src/rojeru-datepicker.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f8fafc;
            color: #334155;
        }
        .demo-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }
        .demo-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
        }
        h1, h2, h3 {
            color: #1e293b;
        }
        .input-group {
            margin-bottom: 20px;
        }
        .input-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #475569;
        }
        .input-group input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #cbd5e1;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.2s;
            box-sizing: border-box;
        }
        .input-group input:focus {
            outline: none;
            border-color: #3b82f6;
        }
        .dark-mode {
            background: #1e293b;
            color: #f1f5f9;
        }
        .dark-mode .demo-card {
            background: #334155;
            border-color: #475569;
            color: #e2e8f0;
        }
        .dark-mode h1, .dark-mode h2, .dark-mode h3 {
            color: #f1f5f9;
        }
        .mode-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        }
        .code-block {
            background: #1e293b;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
            margin-top: 15px;
        }
        .highlight {
            background: #fef3c7;
            padding: 2px 6px;
            border-radius: 4px;
            color: #92400e;
        }
        .dark-mode .highlight {
            background: #78350f;
            color: #fef3c7;
        }
    </style>
</head>
<body>
<button class="mode-toggle" onclick="toggleDarkMode()">🌙 Modo Oscuro</button>

<h1>📅 Rojeru DatePicker Demo</h1>
<p>Una librería de selector de fechas moderna, ligera y personalizable.</p>

<div class="demo-container">
    <!-- Demo 1: Fecha simple -->
    <div class="demo-card">
        <h2>📆 Fecha Simple</h2>
        <div class="input-group">
            <label>Selecciona una fecha:</label>
            <input type="text" id="dateSingle" placeholder="Haz clic para seleccionar fecha">
        </div>
        <button onclick="clearDate('dateSingle')">Limpiar</button>
        <button onclick="showCode('single')">Ver Código</button>
        <div id="codeSingle" class="code-block" style="display:none;">
            const singlePicker = new RojeruDatePicker({
            input: document.getElementById('dateSingle'),
            type: 'single',
            format: 'dd/mm/YYYY',
            locale: 'es',
            allowClear: true,
            mode: 'dropdown',
            onSelect: (result) => {
            console.log('Fecha seleccionada:', result);
            }
            });
        </div>
    </div>

    <!-- Demo 2: Rango de fechas -->
    <div class="demo-card">
        <h2>📅📆 Rango de Fechas</h2>
        <div class="input-group">
            <label>Selecciona un rango:</label>
            <input type="text" id="dateRange" placeholder="Haz clic para seleccionar rango">
        </div>
        <button onclick="clearDate('dateRange')">Limpiar</button>
        <button onclick="showCode('range')">Ver Código</button>
        <div id="codeRange" class="code-block" style="display:none;">
            const rangePicker = new RojeruDatePicker({
            input: document.getElementById('dateRange'),
            type: 'range',
            format: 'dd/mm/YYYY',
            locale: 'es',
            allowClear: true,
            mode: 'modal',
            weekStart: 1, // Lunes
            title: 'Selecciona el rango de fechas',
            onSelect: (result) => {
            console.log('Rango seleccionado:', result);
            }
            });
        </div>
    </div>

    <!-- Demo 3: Fecha con hora -->
    <div class="demo-card">
        <h2>⏰ Fecha con Hora</h2>
        <div class="input-group">
            <label>Fecha y hora:</label>
            <input type="text" id="dateTime" placeholder="Haz clic para seleccionar fecha y hora">
        </div>
        <button onclick="clearDate('dateTime')">Limpiar</button>
        <button onclick="showCode('time')">Ver Código</button>
        <div id="codeTime" class="code-block" style="display:none;">
            const timePicker = new RojeruDatePicker({
            input: document.getElementById('dateTime'),
            type: 'single',
            includeTime: true,
            format: 'dd/mm/YYYY',
            locale: 'es',
            allowClear: true,
            mode: 'dropdown',
            typeButtons: 'outline', // Botones outline
            onSelect: (result) => {
            console.log('Fecha y hora:', result);
            }
            });
        </div>
    </div>

    <!-- Demo 4: Con valor inicial -->
    <div class="demo-card">
        <h2>🎯 Con Valor Inicial</h2>
        <div class="input-group">
            <label>Fecha predefinida:</label>
            <input type="text" id="dateInitial" placeholder="Ya tiene un valor inicial">
        </div>
        <button onclick="clearDate('dateInitial')">Limpiar</button>
        <button onclick="showCode('initial')">Ver Código</button>
        <div id="codeInitial" class="code-block" style="display:none;">
            const initialPicker = new RojeruDatePicker({
            input: document.getElementById('dateInitial'),
            type: 'single',
            format: 'dd/mm/YYYY',
            locale: 'es',
            allowClear: true,
            mode: 'dropdown',
            initialValue: '15/03/2024',
            onSelect: (result) => {
            console.log('Nueva fecha:', result);
            }
            });
        </div>
    </div>

    <!-- Demo 5: Con restricciones -->
    <div class="demo-card">
        <h2>🔒 Con Restricciones</h2>
        <div class="input-group">
            <label>Fecha entre límites:</label>
            <input type="text" id="dateLimited" placeholder="Solo fechas de 2024">
        </div>
        <button onclick="clearDate('dateLimited')">Limpiar</button>
        <button onclick="showCode('limited')">Ver Código</button>
        <div id="codeLimited" class="code-block" style="display:none;">
            const limitedPicker = new RojeruDatePicker({
            input: document.getElementById('dateLimited'),
            type: 'single',
            format: 'dd/mm/YYYY',
            locale: 'es',
            allowClear: true,
            mode: 'dropdown',
            minDate: new Date('2024-01-01'),
            maxDate: new Date('2024-12-31'),
            onSelect: (result) => {
            console.log('Fecha válida:', result);
            }
            });
        </div>
    </div>

    <!-- Demo 6: Rango con valor inicial -->
    <div class="demo-card">
        <h2>📊 Rango Inicial</h2>
        <div class="input-group">
            <label>Rango predefinido:</label>
            <input type="text" id="dateRangeInitial" placeholder="Rango inicial establecido">
        </div>
        <button onclick="clearDate('dateRangeInitial')">Limpiar</button>
        <button onclick="showCode('rangeInitial')">Ver Código</button>
        <div id="codeRangeInitial" class="code-block" style="display:none;">
            const rangeInitialPicker = new RojeruDatePicker({
            input: document.getElementById('dateRangeInitial'),
            type: 'range',
            format: 'dd/mm/YYYY',
            locale: 'es',
            allowClear: true,
            mode: 'modal',
            initialValue: {
            start: '01/03/2024',
            end: '15/03/2024'
            },
            onSelect: (result) => {
            console.log('Rango actualizado:', result);
            }
            });
        </div>
    </div>
</div>

<script src="../src/rojeru-datepicker.js"></script>
<script>
    // Demo 1: Fecha simple
    const singlePicker = new RojeruDatePicker({
        input: document.getElementById('dateSingle'),
        type: 'single',
        format: 'dd/mm/YYYY',
        locale: 'es',
        allowClear: true,
        mode: 'dropdown',
        onSelect: (result) => {
            console.log('Fecha seleccionada:', result);
        }
    });

    // Demo 2: Rango de fechas
    const rangePicker = new RojeruDatePicker({
        input: document.getElementById('dateRange'),
        type: 'range',
        format: 'dd/mm/YYYY',
        locale: 'es',
        allowClear: true,
        mode: 'modal',
        weekStart: 1,
        title: 'Selecciona el rango de fechas',
        onSelect: (result) => {
            console.log('Rango seleccionado:', result);
        }
    });

    // Demo 3: Fecha con hora
    const timePicker = new RojeruDatePicker({
        input: document.getElementById('dateTime'),
        type: 'single',
        includeTime: true,
        format: 'dd/mm/YYYY',
        locale: 'es',
        allowClear: true,
        mode: 'dropdown',
        typeButtons: 'outline',
        onSelect: (result) => {
            console.log('Fecha y hora:', result);
        }
    });

    // Demo 4: Con valor inicial
    const initialPicker = new RojeruDatePicker({
        input: document.getElementById('dateInitial'),
        type: 'single',
        format: 'dd/mm/YYYY',
        locale: 'es',
        allowClear: true,
        mode: 'dropdown',
        initialValue: '15/03/2024',
        onSelect: (result) => {
            console.log('Nueva fecha:', result);
        }
    });

    // Demo 5: Con restricciones
    const limitedPicker = new RojeruDatePicker({
        input: document.getElementById('dateLimited'),
        type: 'single',
        format: 'dd/mm/YYYY',
        locale: 'es',
        allowClear: true,
        mode: 'dropdown',
        minDate: new Date('2024-01-01'),
        maxDate: new Date('2024-12-31'),
        onSelect: (result) => {
            console.log('Fecha válida:', result);
        }
    });

    // Demo 6: Rango con valor inicial
    const rangeInitialPicker = new RojeruDatePicker({
        input: document.getElementById('dateRangeInitial'),
        type: 'range',
        format: 'dd/mm/YYYY',
        locale: 'es',
        allowClear: true,
        mode: 'modal',
        initialValue: {
            start: '01/03/2024',
            end: '15/03/2024'
        },
        onSelect: (result) => {
            console.log('Rango actualizado:', result);
        }
    });

    // Funciones auxiliares
    function clearDate(inputId) {
        document.getElementById(inputId).value = '';
    }

    function showCode(demoId) {
        const element = document.getElementById(`code${demoId.charAt(0).toUpperCase() + demoId.slice(1)}`);
        if (element.style.display === 'none') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const btn = document.querySelector('.mode-toggle');
        btn.textContent = document.body.classList.contains('dark-mode') ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
    }
</script>
</body>
</html>