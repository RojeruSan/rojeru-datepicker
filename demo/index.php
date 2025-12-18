<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo RojeruDatePicker</title>
    <link rel="stylesheet" href="../src/rojeru-datepicker.css">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            color: #333;
            line-height: 1.6;
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #1e40af;
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .subtitle {
            color: #64748b;
            font-size: 1.2rem;
        }

        .examples-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }

        .example-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .example-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .example-title {
            color: #1e40af;
            font-size: 1.4rem;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
        }

        .input-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #475569;
        }

        input[type="text"] {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #cbd5e1;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }

        input[type="text"]:focus {
            outline: none;
            border-color: #3b82f6;
        }

        .demo-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: background 0.3s ease;
            margin-top: 10px;
        }

        .demo-btn:hover {
            background: #2563eb;
        }

        .modal-btn {
            background: #10b981;
        }

        .modal-btn:hover {
            background: #059669;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(3px);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background: white;
            border-radius: 15px;
            padding: 30px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            position: relative;
            animation: modalFadeIn 0.3s ease;
        }

        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .modal-header {
            margin-bottom: 25px;
        }

        .modal-title {
            color: #1e40af;
            font-size: 1.6rem;
        }

        .close-modal {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #64748b;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s ease;
        }

        .close-modal:hover {
            background: #f1f5f9;
        }

        .dark-mode-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1e293b;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            z-index: 100;
        }

        .code-block {
            background: #1e293b;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
        }

        .date-display {
            margin-top: 15px;
            padding: 10px;
            background: #f8fafc;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            border-left: 4px solid #3b82f6;
        }

        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #64748b;
            font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .examples-grid {
                grid-template-columns: 1fr;
            }

            h1 {
                font-size: 2rem;
            }

            .modal-content {
                width: 95%;
                padding: 20px;
            }
        }
    </style>
</head>
<body>
<button class="dark-mode-toggle" id="darkModeToggle">🌙 Modo Oscuro</button>

<div class="container">
    <header>
        <h1>📅 RojeruDatePicker Demo</h1>
        <p class="subtitle">Una librería flexible y elegante para selección de fechas</p>
    </header>

    <div class="examples-grid">
        <!-- Ejemplo 1: Fecha simple -->
        <div class="example-card">
            <h3 class="example-title">📝 Fecha Simple</h3>
            <div class="input-group">
                <label for="simpleDate">Selecciona una fecha:</label>
                <input type="text" id="simpleDate" placeholder="Haz clic para seleccionar">
            </div>
            <div class="date-display" id="simpleDateDisplay">No seleccionado</div>
            <button class="demo-btn" onclick="showCode('simple')">Ver Código</button>
            <div id="code-simple" class="code-block" style="display: none;">
                    <pre><code>const simplePicker = new RojeruDatePicker({
    input: document.getElementById('simpleDate'),
    type: 'single',
    format: 'dd/mm/YYYY',
    locale: 'es',
    onSelect: (result) => {
        document.getElementById('simpleDateDisplay').textContent =
            `Seleccionado: ${result.formatted}`;
    }
});</code></pre>
            </div>
        </div>

        <!-- Ejemplo 2: Rango de fechas -->
        <div class="example-card">
            <h3 class="example-title">📅 Rango de Fechas</h3>
            <div class="input-group">
                <label for="rangeDate">Selecciona un rango:</label>
                <input type="text" id="rangeDate" placeholder="Desde - Hasta">
            </div>
            <div class="date-display" id="rangeDateDisplay">No seleccionado</div>
            <button class="demo-btn" onclick="showCode('range')">Ver Código</button>
            <div id="code-range" class="code-block" style="display: none;">
                    <pre><code>const rangePicker = new RojeruDatePicker({
    input: document.getElementById('rangeDate'),
    type: 'range',
    format: 'dd/mm/YYYY',
    locale: 'es',
    onSelect: (result) => {
        const days = Math.round((result.end - result.start) / (1000 * 60 * 60 * 24));
        document.getElementById('rangeDateDisplay').textContent =
            `${result.formatted} (${days} días)`;
    }
});</code></pre>
            </div>
        </div>

        <!-- Ejemplo 3: Con hora -->
        <div class="example-card">
            <h3 class="example-title">⏰ Fecha con Hora</h3>
            <div class="input-group">
                <label for="timeDate">Fecha y hora:</label>
                <input type="text" id="timeDate" placeholder="dd/mm/YYYY HH:MM">
            </div>
            <div class="date-display" id="timeDateDisplay">No seleccionado</div>
            <button class="demo-btn" onclick="showCode('time')">Ver Código</button>
            <div id="code-time" class="code-block" style="display: none;">
                    <pre><code>const timePicker = new RojeruDatePicker({
    input: document.getElementById('timeDate'),
    type: 'single',
    includeTime: true,
    format: 'dd/mm/YYYY',
    locale: 'es',
    onSelect: (result) => {
        document.getElementById('timeDateDisplay').textContent =
            `Seleccionado: ${result.formatted}`;
    }
});</code></pre>
            </div>
        </div>

        <!-- Ejemplo 4: Modo Dropdown -->
        <div class="example-card">
            <h3 class="example-title">🔽 Modo Dropdown</h3>
            <div class="input-group">
                <label for="dropdownDate">Dropdown (se abre debajo):</label>
                <input type="text" id="dropdownDate" placeholder="Haz clic">
            </div>
            <div class="date-display" id="dropdownDateDisplay">No seleccionado</div>
            <button class="demo-btn" onclick="showCode('dropdown')">Ver Código</button>
            <div id="code-dropdown" class="code-block" style="display: none;">
                    <pre><code>const dropdownPicker = new RojeruDatePicker({
    input: document.getElementById('dropdownDate'),
    type: 'single',
    mode: 'dropdown',
    format: 'dd-mm-yyyy',
    allowClear: true,
    onSelect: (result) => {
        document.getElementById('dropdownDateDisplay').textContent =
            `Seleccionado: ${result.formatted}`;
    }
});</code></pre>
            </div>
        </div>

        <!-- Ejemplo 5: Botones Outline -->
        <div class="example-card">
            <h3 class="example-title">🎨 Estilo Outline</h3>
            <div class="input-group">
                <label for="outlineDate">Estilo con bordes:</label>
                <input type="text" id="outlineDate" placeholder="Estilo moderno">
            </div>
            <div class="date-display" id="outlineDateDisplay">No seleccionado</div>
            <button class="demo-btn" onclick="showCode('outline')">Ver Código</button>
            <div id="code-outline" class="code-block" style="display: none;">
                    <pre><code>const outlinePicker = new RojeruDatePicker({
    input: document.getElementById('outlineDate'),
    type: 'single',
    format: 'dd/mm/YYYY',
    typeButtons: 'outline', // ← Esto activa el estilo outline
    title: 'Selecciona una fecha',
    onSelect: (result) => {
        document.getElementById('outlineDateDisplay').textContent =
            `Seleccionado: ${result.formatted}`;
    }
});</code></pre>
            </div>
        </div>

        <!-- Ejemplo 6: Con restricciones -->
        <div class="example-card">
            <h3 class="example-title">🔒 Con Restricciones</h3>
            <div class="input-group">
                <label for="restrictedDate">Solo futuras (mínimo hoy):</label>
                <input type="text" id="restrictedDate" placeholder="Solo fechas futuras">
            </div>
            <div class="date-display" id="restrictedDateDisplay">No seleccionado</div>
            <button class="demo-btn" onclick="showCode('restricted')">Ver Código</button>
            <div id="code-restricted" class="code-block" style="display: none;">
                    <pre><code>const restrictedPicker = new RojeruDatePicker({
    input: document.getElementById('restrictedDate'),
    type: 'single',
    format: 'dd/mm/YYYY',
    minDate: new Date(), // Solo fechas de hoy en adelante
    maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    onSelect: (result) => {
        document.getElementById('restrictedDateDisplay').textContent =
            `Seleccionado: ${result.formatted}`;
    }
});</code></pre>
            </div>
        </div>
    </div>

    <!-- Ejemplo con Modal -->
    <div class="example-card" style="grid-column: 1 / -1;">
        <h3 class="example-title">🪟 DatePicker sobre Modal</h3>
        <p>Ejemplo de uso del datepicker dentro de un modal personalizado.</p>
        <button class="demo-btn modal-btn" onclick="abrirModal()">Abrir Modal con DatePicker</button>
        <button class="demo-btn" onclick="showCode('modal')" style="margin-left: 10px;">Ver Código del Modal</button>

        <div id="code-modal" class="code-block" style="display: none; margin-top: 15px;">
                <pre><code>// 1. Modal HTML
&lt;div class="modal" id="miModal"&gt;
    &lt;div class="modal-content"&gt;
        &lt;div class="modal-header"&gt;
            &lt;h2 class="modal-title"&gt;Formulario en Modal&lt;/h2&gt;
            &lt;button class="close-modal" onclick="cerrarModal()"&gt;×&lt;/button&gt;
        &lt;/div&gt;
        &lt;div class="input-group"&gt;
            &lt;label for="modalDate"&gt;Selecciona fecha:&lt;/label&gt;
            &lt;input type="text" id="modalDate" placeholder="Haz clic aquí"&gt;
        &lt;/div&gt;
        &lt;div class="date-display" id="modalDateDisplay"&gt;No seleccionado&lt;/div&gt;
    &lt;/div&gt;
&lt;/div&gt;

// 2. JavaScript
function abrirModal() {
    const modal = document.getElementById('miModal');
    modal.style.display = 'flex';

    // Inicializar datepicker DENTRO del modal
    if (!window.modalPicker) {
        window.modalPicker = new RojeruDatePicker({
            input: document.getElementById('modalDate'),
            mode: 'modal',
            format: 'dd/mm/YYYY',
            title: 'Fecha de Reserva',
            onSelect: (result) => {
                document.getElementById('modalDateDisplay').textContent =
                    `Fecha seleccionada: ${result.formatted}`;
            }
        });
    }
}

function cerrarModal() {
    document.getElementById('miModal').style.display = 'none';
}</code></pre>
        </div>
    </div>

    <!-- Modal de demostración -->
    <div class="modal" id="miModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">📋 Formulario en Modal</h2>
                <button class="close-modal" onclick="cerrarModal()">×</button>
            </div>
            <p style="margin-bottom: 20px; color: #64748b;">
                Este es un modal personalizado. El datepicker se abre correctamente sobre él.
            </p>

            <div class="input-group">
                <label for="modalDate">Selecciona una fecha:</label>
                <input type="text" id="modalDate" placeholder="Haz clic aquí para abrir el datepicker">
            </div>

            <div class="date-display" id="modalDateDisplay">No se ha seleccionado ninguna fecha</div>

            <div style="margin-top: 25px; display: flex; gap: 10px;">
                <button class="demo-btn" onclick="cerrarModal()">Cerrar</button>
                <button class="demo-btn modal-btn" onclick="guardarFecha()">Guardar Fecha</button>
            </div>
        </div>
    </div>

    <div class="footer">
        <p>RojeruDatePicker v1.0.2 - Licencia MIT</p>
        <p>Autor: Rogelio Urieta Camacho (RojeruSan)</p>
    </div>
</div>

<script src="../src/rojeru-datepicker.js"></script>
<script>
    // Variables globales para los datepickers
    let pickers = {};

    // Función para mostrar/ocultar código
    function showCode(type) {
        const codeBlock = document.getElementById(`code-${type}`);
        codeBlock.style.display = codeBlock.style.display === 'none' ? 'block' : 'none';
    }

    // Función para alternar modo oscuro
    document.getElementById('darkModeToggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        document.documentElement.classList.toggle('dark-mode');

        // Reforzar detección de modo oscuro para datepickers
        if (document.body.classList.contains('dark-mode')) {
            this.textContent = '☀️ Modo Claro';
            document.body.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
            document.body.style.color = '#e2e8f0';
        } else {
            this.textContent = '🌙 Modo Oscuro';
            document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
            document.body.style.color = '#333';
        }

        // Notificar a los datepickers existentes
        Object.values(pickers).forEach(picker => {
            if (picker && picker.isDarkMode !== undefined) {
                picker.isDarkMode = document.body.classList.contains('dark-mode');
            }
        });
    });

    // 1. Fecha Simple
    pickers.simple = new RojeruDatePicker({
        input: document.getElementById('simpleDate'),
        type: 'single',
        format: 'dd/mm/YYYY',
        locale: 'es',
        onSelect: (result) => {
            document.getElementById('simpleDateDisplay').textContent =
                `Seleccionado: ${result.formatted}`;
        }
    });

    // 2. Rango de Fechas
    pickers.range = new RojeruDatePicker({
        input: document.getElementById('rangeDate'),
        type: 'range',
        format: 'dd/mm/YYYY',
        locale: 'es',
        allowClear: true,
        onSelect: (result) => {
            const days = Math.round((result.end - result.start) / (1000 * 60 * 60 * 24));
            document.getElementById('rangeDateDisplay').textContent =
                `${result.formatted} (${days} días)`;
        }
    });

    // 3. Con Hora
    pickers.time = new RojeruDatePicker({
        input: document.getElementById('timeDate'),
        type: 'single',
        includeTime: true,
        format: 'dd/mm/YYYY',
        locale: 'es',
        onSelect: (result) => {
            document.getElementById('timeDateDisplay').textContent =
                `Seleccionado: ${result.formatted}`;
        }
    });

    // 4. Modo Dropdown
    pickers.dropdown = new RojeruDatePicker({
        input: document.getElementById('dropdownDate'),
        type: 'single',
        mode: 'dropdown',
        format: 'dd-mm-yyyy',
        allowClear: true,
        onSelect: (result) => {
            document.getElementById('dropdownDateDisplay').textContent =
                `Seleccionado: ${result.formatted}`;
        }
    });

    // 5. Estilo Outline
    pickers.outline = new RojeruDatePicker({
        input: document.getElementById('outlineDate'),
        type: 'single',
        format: 'dd/mm/YYYY',
        typeButtons: 'outline',
        title: 'Selecciona una fecha',
        onSelect: (result) => {
            document.getElementById('outlineDateDisplay').textContent =
                `Seleccionado: ${result.formatted}`;
        }
    });

    // 6. Con Restricciones
    pickers.restricted = new RojeruDatePicker({
        input: document.getElementById('restrictedDate'),
        type: 'single',
        format: 'dd/mm/YYYY',
        minDate: new Date(),
        maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        onSelect: (result) => {
            document.getElementById('restrictedDateDisplay').textContent =
                `Seleccionado: ${result.formatted}`;
        }
    });

    // Funciones para el modal
    function abrirModal() {
        const modal = document.getElementById('miModal');
        modal.style.display = 'flex';

        // Inicializar datepicker DENTRO del modal
        if (!pickers.modal) {
            pickers.modal = new RojeruDatePicker({
                input: document.getElementById('modalDate'),
                mode: 'dropdown',
                format: 'dd/mm/YYYY',
                title: 'Fecha de Reserva',
                onSelect: (result) => {
                    document.getElementById('modalDateDisplay').textContent =
                        `Fecha seleccionada: ${result.formatted}`;
                },
                onOpen: function() {
                    // Ajuste dinámico del z-index para asegurar que esté sobre el modal
                    setTimeout(() => {
                        const overlay = document.querySelector('.rojeru-datepicker-overlay');
                        if (overlay) {
                            overlay.style.zIndex = '99999';
                            const picker = overlay.querySelector('.rojeru-datepicker');
                            if (picker) picker.style.zIndex = '100000';
                        }
                    }, 10);
                }
            });
        }
    }

    function cerrarModal() {
        document.getElementById('miModal').style.display = 'none';
    }

    function guardarFecha() {
        const display = document.getElementById('modalDateDisplay').textContent;
        if (display !== 'No se ha seleccionado ninguna fecha') {
            alert(`Fecha guardada: ${display}`);
            cerrarModal();
        } else {
            alert('Por favor, selecciona una fecha primero.');
        }
    }

    // Cerrar modal al hacer clic fuera del contenido
    document.getElementById('miModal').addEventListener('click', function(e) {
        if (e.target === this) {
            cerrarModal();
        }
    });

    // Inicializar algunos valores de ejemplo
    document.addEventListener('DOMContentLoaded', function() {
        // Establecer una fecha inicial para el ejemplo de rango
        const hoy = new Date();
        const enUnaSemana = new Date(hoy);
        enUnaSemana.setDate(hoy.getDate() + 7);

        // Formatear fechas
        const formatDate = (date) => {
            return date.getDate().toString().padStart(2, '0') + '/' +
                (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
                date.getFullYear();
        };

        // Ejemplo de rango predefinido
        document.getElementById('rangeDate').value =
            `${formatDate(hoy)} - ${formatDate(enUnaSemana)}`;

        // Ejemplo de fecha con hora
        document.getElementById('timeDate').value =
            `${formatDate(hoy)} 14:30`;
    });
</script>
</body>
</html>