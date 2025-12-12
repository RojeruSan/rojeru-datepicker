/**
 * RojeruDatePicker v1.0.2
 * Autor: Rogelio Urieta Camacho (RojeruSan)
 * Licencia: MIT
 * Requiere: rojeru-datepicker.css
 */
class RojeruDatePicker {
    constructor(options = {}) {
        this.options = {
            input: null,
            type: 'single', // 'single' | 'range'
            includeTime: false,
            format: 'dd/mm/YYYY',
            locale: 'es',
            minDate: null,
            maxDate: null,
            onSelect: null,
            onClose: null,
            mode: 'modal', // 'modal' | 'dropdown'
            closeOnOverlayClick: true,
            weekStart: 0, // 0=Domingo, 1=Lunes
            allowClear: false,
            position: 'auto', // 'auto' | 'top' | 'bottom'
            autoDarkMode: true, // Detecta automáticamente el modo oscuro,
            title: null,
            initialValue: null,
            typeButtons: 'solid'
        };

        Object.assign(this.options, options);

        if (!this.options.input) {
            throw new Error('RojeruDatePicker: "input" es obligatorio.');
        }

        // Convertir fechas mín/máx a objetos Date
        if (this.options.minDate && !(this.options.minDate instanceof Date)) {
            this.options.minDate = new Date(this.options.minDate);
        }
        if (this.options.maxDate && !(this.options.maxDate instanceof Date)) {
            this.options.maxDate = new Date(this.options.maxDate);
        }

        // ✅ CORREGIDO: Inicializar estado sin limpiar el input
        this.state = {
            start: null,
            end: null,
            time: this.options.includeTime ? '00:00' : null,
            currentView: new Date(),
            // Usar el valor del input como base, no sobreescribir si ya tiene valor
            inputValue: this.options.input.value || ''
        };

        // Determinar si estamos en modo oscuro
        this.isDarkMode = this.detectDarkMode();

        // ✅ CORREGIDO: Solo parsear initialValue si no es null
        if (this.options.initialValue !== null) {
            this.parseInitialValue();
        }

        // Handlers para cerrar con clic fuera
        this._clickOutsideHandler = null;
        this._keydownHandler = null;

        this.attach();
    }

    // ✅ Nuevo método para manejar valor inicial
    handleInitialValue() {
        if (this.options.initialValue === null) {
            // Limpiar completamente el estado
            this.state = {
                start: null,
                end: null,
                time: this.options.includeTime ? '00:00' : null,
                // ✅ RESTABLECER a la fecha actual
                currentView: new Date(),
                inputValue: this.options.input.value || ''
            };

            // También limpiar el input si existe
            if (this.options.input) {
                this.options.input.value = '';
            }
        } else {
            // Parsear normalmente si no es null
            this.parseInitialValue();
        }
    }

    detectDarkMode() {
        if (document.documentElement.classList.contains('dark-mode') ||
            document.body.classList.contains('dark-mode') ||
            document.documentElement.classList.contains('dark') ||
            document.body.classList.contains('dark') ||
            document.documentElement.classList.contains('theme-dark') ||
            document.body.classList.contains('theme-dark')) {
            return true;
        }
        return false;
    }

    attach() {
        // Solo adjuntar eventos si el input no tiene ya un datepicker
        if (!this.options.input.hasAttribute('data-rojeru-datepicker')) {
            this.options.input.readOnly = true;
            this.options.input.setAttribute('data-rojeru-datepicker', 'true');
            this.options.input.addEventListener('click', () => this.open());

            // Soporte para tecla Escape en el input
            this.options.input.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.close();
                if (e.key === 'Enter') this.open();
            });

            // Si allowClear es true, agregar botón de limpiar
            if (this.options.allowClear) {
                this.addClearButton();
            }

            // ✅ CORREGIDO: Solo actualizar el input si tenemos fechas válidas
            if (this.state.start && (this.options.type !== 'range' || this.state.end)) {
                const formatted = this.formatOutput();
                if (this.options.input) {
                    this.options.input.value = formatted;
                }
            }
        }
    }

    addClearButton() {
        // Verificar si ya existe un botón de limpiar
        if (this.options.input.parentNode.querySelector('.rojeru-datepicker-clear')) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';

        // Mover input al wrapper
        const parent = this.options.input.parentNode;
        parent.insertBefore(wrapper, this.options.input);
        wrapper.appendChild(this.options.input);

        // Crear botón de limpiar
        const clearBtn = document.createElement('button');
        clearBtn.className = 'rojeru-datepicker-clear';
        clearBtn.innerHTML = '×';
        clearBtn.type = 'button';
        Object.assign(clearBtn.style, {
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#888',
            display: this.options.input.value ? 'block' : 'none',
            zIndex: '1000'
        });
        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clear();
        });
        wrapper.appendChild(clearBtn);

        // Observar cambios en el input
        const observer = new MutationObserver(() => {
            clearBtn.style.display = this.options.input.value ? 'block' : 'none';
        });
        observer.observe(this.options.input, { attributes: true, attributeFilter: ['value'] });
    }

    parseInitialValue() {
        const val = this.options.initialValue;
        if (!val && val !== '') return; // Solo retornar si es undefined o null

        // Limpiar estado previo
        this.state.start = null;
        this.state.end = null;

        if (this.options.type === 'range') {
            // Manejar rangos en formato "dd/mm/YYYY - dd/mm/YYYY"
            if (typeof val === 'string' && val.includes(' - ')) {
                const [startStr, endStr] = val.split(' - ').map(s => s.trim());
                this.state.start = this.parseDateInput(startStr);
                this.state.end = this.parseDateInput(endStr);

                // Si hay hora en el string
                if (val.includes(' ')) {
                    const timeMatch = val.match(/\s([0-2]?[0-9]:[0-5][0-9])/);
                    if (timeMatch) {
                        this.state.time = timeMatch[1];
                    }
                }

                // ✅ ACTUALIZAR EL INPUT con el valor formateado
                if (this.options.input && this.state.start && this.state.end) {
                    this.options.input.value = this.formatOutput();
                }
            }
            // Manejar objeto con start y end
            else if (typeof val === 'object' && val.start && val.end) {
                this.state.start = this.parseDateInput(val.start);
                this.state.end = this.parseDateInput(val.end);
                this.state.time = val.time || null;

                // ✅ ACTUALIZAR EL INPUT con el valor formateado
                if (this.options.input && this.state.start && this.state.end) {
                    this.options.input.value = this.formatOutput();
                }
            }

            if (this.state.start) {
                this.state.currentView = new Date(this.state.start);
            }
        } else {
            // Fecha simple
            this.state.start = this.parseDateInput(val);
            if (this.state.start) {
                this.state.currentView = new Date(this.state.start);

                // ✅ ACTUALIZAR EL INPUT con el valor formateado
                if (this.options.input) {
                    this.options.input.value = this.formatOutput();
                }
            }

            // Si incluye hora y el valor tiene hora, extraerla
            if (this.options.includeTime && typeof val === 'string' && val.includes(' ')) {
                const parts = val.split(' ');
                const timePart = parts.find(part => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(part));
                if (timePart) {
                    this.state.time = timePart;
                }
            }
        }

        // ✅ Asegurar que el valor del input se guarde en el estado
        if (this.options.input) {
            this.state.inputValue = this.options.input.value;
        }
    }

    parseDateInput(input) {
        if (input instanceof Date) {
            return new Date(input);
        }
        if (typeof input === 'string') {
            // Remover cualquier hora del string
            const dateStr = input.split(' ')[0];

            // Soportar múltiples formatos comunes
            const formats = [
                /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
                /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
                /^(\d{1,2})-(\d{1,2})-(\d{4})$/
            ];

            for (const format of formats) {
                const match = dateStr.match(format);
                if (match) {
                    let day, month, year;

                    // Determinar qué formato se usó
                    if (format.source.includes('/')) {
                        // Formato dd/mm/yyyy o d/m/yyyy
                        day = parseInt(match[1]);
                        month = parseInt(match[2]) - 1;
                        year = parseInt(match[3]);
                    } else if (format.source.startsWith('^\\d{4}')) {
                        // Formato yyyy-mm-dd
                        year = parseInt(match[1]);
                        month = parseInt(match[2]) - 1;
                        day = parseInt(match[3]);
                    } else {
                        // Formato dd-mm-yyyy
                        day = parseInt(match[1]);
                        month = parseInt(match[2]) - 1;
                        year = parseInt(match[3]);
                    }

                    const date = new Date(year, month, day);
                    // Validar que la fecha sea válida
                    if (date.getFullYear() === year &&
                        date.getMonth() === month &&
                        date.getDate() === day) {
                        return date;
                    }
                }
            }

            // Intentar Date.parse() como fallback
            const fallback = new Date(input);
            if (!isNaN(fallback.getTime())) return fallback;
        }
        return null;
    }

    open() {
        if (this.overlay) this.close();

        const inputRect = this.options.input.getBoundingClientRect();
        const isMobile = window.innerWidth <= 768;

        this.overlay = document.createElement('div');
        this.overlay.className = 'rojeru-datepicker-overlay';
        this.overlay.dataset.id = 'dp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
        this.overlay.setAttribute('data-mode', this.options.mode);

        // Renderizar primero
        this.overlay.innerHTML = this.renderTemplate();
        document.body.appendChild(this.overlay);

        // Aplicar modo oscuro si es necesario
        if (this.isDarkMode) {
            const picker = this.overlay.querySelector('.rojeru-datepicker');
            if (picker) {
                picker.classList.add('rojeru-dark-mode');
            }
        }

        // ✅ POSICIONAMIENTO MEJORADO
        if (this.options.mode === 'dropdown' && !isMobile) {
            // Dropdown - aplicar estilos básicos primero
            Object.assign(this.overlay.style, {
                position: 'absolute',
                top: `${inputRect.bottom + window.scrollY + 4}px`,
                left: `${inputRect.left + window.scrollX}px`,
                width: `${Math.max(inputRect.width, 320)}px`,
                zIndex: 10000,
                background: 'transparent',
                display: 'block',
                // Importante para cálculos
                minWidth: `${Math.max(inputRect.width, 320)}px`
            });

            // Luego ajustar posición
            setTimeout(() => {
                this.adjustDropdownPosition();
            }, 10); // Pequeño delay para que se renderice
        } else {
            // Modal
            Object.assign(this.overlay.style, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: isMobile ? 'flex-start' : 'center',
                padding: isMobile ? '20px 0' : '0',
                backdropFilter: 'blur(2px)',
                zIndex: 10000
            });
        }

        this.bindEvents();
        this.updateView();

        // Enfoque en el primer elemento interactivo
        setTimeout(() => {
            const firstFocusable = this.overlay.querySelector('.rojeru-datepicker-nav.prev') ||
                this.overlay.querySelector('.rojeru-datepicker-month');
            firstFocusable?.focus();
        }, 50); // Aumentar delay para asegurar renderizado

        const overlays = document.querySelectorAll('.rojeru-datepicker-overlay');
        if (overlays.length > 1) {
            // Mantener solo el último overlay
            for (let i = 0; i < overlays.length - 1; i++) {
                overlays[i].remove();
            }
        }
    }

    adjustDropdownPosition() {
        const calendar = this.overlay.querySelector('.rojeru-datepicker');
        if (!calendar) return;

        const inputRect = this.options.input.getBoundingClientRect();
        const calendarRect = calendar.getBoundingClientRect();
        const overlayRect = this.overlay.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Resetear estilos primero
        calendar.style.top = '';
        calendar.style.bottom = '';
        calendar.style.left = '';
        calendar.style.right = '';

        this.overlay.style.top = `${inputRect.bottom + window.scrollY + 4}px`;
        this.overlay.style.left = `${inputRect.left + window.scrollX}px`;

        // Variables para calcular espacio disponible
        const spaceBelow = viewportHeight - inputRect.bottom - 10;
        const spaceAbove = inputRect.top - 10;
        const spaceRight = viewportWidth - inputRect.right - 10;
        const spaceLeft = inputRect.left - 10;

        // Calcular dimensiones del calendario
        const calendarHeight = calendarRect.height;
        const calendarWidth = calendarRect.width;

        // 1. AJUSTE VERTICAL (arriba/abajo)
        let verticalPosition = 'below';

        // Si se especificó posición manual, respetarla
        if (this.options.position === 'top') {
            verticalPosition = 'above';
        } else if (this.options.position === 'bottom') {
            verticalPosition = 'below';
        } else {
            // Modo AUTO: decidir dónde cabe mejor
            if (spaceBelow >= calendarHeight) {
                // Cabe abajo
                verticalPosition = 'below';
            } else if (spaceAbove >= calendarHeight) {
                // Cabe arriba
                verticalPosition = 'above';
            } else {
                // No cabe ni arriba ni abajo completamente
                // Elegir donde hay más espacio
                verticalPosition = spaceBelow >= spaceAbove ? 'below' : 'above';

                // Ajustar altura máxima si es necesario
                if (verticalPosition === 'below' && spaceBelow < calendarHeight) {
                    calendar.style.maxHeight = `${Math.max(spaceBelow - 20, 200)}px`;
                    calendar.style.overflowY = 'auto';
                } else if (verticalPosition === 'above' && spaceAbove < calendarHeight) {
                    calendar.style.maxHeight = `${Math.max(spaceAbove - 20, 200)}px`;
                    calendar.style.overflowY = 'auto';
                }
            }
        }

        // Aplicar posición vertical
        if (verticalPosition === 'above') {
            this.overlay.style.top = `${inputRect.top + window.scrollY - overlayRect.height - 4}px`;
            calendar.style.top = 'auto';
            calendar.style.bottom = `${inputRect.height + 4}px`;
        } else {
            this.overlay.style.top = `${inputRect.bottom + window.scrollY + 4}px`;
        }

        // 2. AJUSTE HORIZONTAL (izquierda/derecha)
        // Recalcular posición después del ajuste vertical
        const recalcRect = calendar.getBoundingClientRect();

        let horizontalAlignment = 'left';

        // Verificar si el calendario se sale por la derecha
        if (recalcRect.right > viewportWidth - 10) {
            // No cabe a la derecha, probar a la izquierda
            const leftPosition = inputRect.right - recalcRect.width;

            if (leftPosition >= 10) {
                // Cabe a la izquierda
                horizontalAlignment = 'right';
            } else {
                // No cabe ni a izquierda ni derecha, centrar
                horizontalAlignment = 'center';
            }
        }

        // Aplicar posición horizontal
        switch (horizontalAlignment) {
            case 'right':
                this.overlay.style.left = `${inputRect.right + window.scrollX - recalcRect.width}px`;
                calendar.style.left = 'auto';
                calendar.style.right = '0';
                break;

            case 'center':
                // Centrar respecto al input
                const centerLeft = inputRect.left + (inputRect.width / 2) - (recalcRect.width / 2);
                const boundedLeft = Math.max(10, Math.min(centerLeft, viewportWidth - recalcRect.width - 10));
                this.overlay.style.left = `${boundedLeft + window.scrollX}px`;
                break;

            case 'left':
            default:
                // Ya está posicionado a la izquierda por defecto
                // Solo verificar que no se salga por la derecha y ajustar si es necesario
                if (recalcRect.right > viewportWidth - 10) {
                    const shiftLeft = recalcRect.right - (viewportWidth - 10);
                    this.overlay.style.left = `${parseFloat(this.overlay.style.left) - shiftLeft}px`;
                }
                break;
        }

        // 3. VERIFICACIÓN FINAL - Asegurar que no se sale de la pantalla
        const finalRect = calendar.getBoundingClientRect();

        // Ajustar si se sale por la derecha
        if (finalRect.right > viewportWidth - 5) {
            const shiftAmount = finalRect.right - (viewportWidth - 5);
            this.overlay.style.left = `${parseFloat(this.overlay.style.left) - shiftAmount}px`;
        }

        // Ajustar si se sale por la izquierda
        if (finalRect.left < 5) {
            this.overlay.style.left = `${5 + window.scrollX}px`;
        }

        // Ajustar si se sale por arriba
        if (finalRect.top < 5) {
            this.overlay.style.top = `${5 + window.scrollY}px`;
        }

        // Ajustar si se sale por abajo
        if (finalRect.bottom > viewportHeight - 5) {
            const shiftAmount = finalRect.bottom - (viewportHeight - 5);
            this.overlay.style.top = `${parseFloat(this.overlay.style.top) - shiftAmount}px`;
        }

        // 4. Si está en modo móvil, forzar modal
        const isMobile = window.innerWidth <= 768;
        if (isMobile && this.options.mode === 'dropdown') {
            // Convertir a modal en móvil
            Object.assign(this.overlay.style, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                backdropFilter: 'blur(2px)',
                zIndex: 10000
            });

            calendar.style.maxHeight = '80vh';
            calendar.style.overflowY = 'auto';
            calendar.style.position = 'relative';
            calendar.style.margin = 'auto';
        }
    }

    close() {
        if (!this.overlay) return;

        // Remover listeners
        if (this._clickOutsideHandler) {
            document.removeEventListener('click', this._clickOutsideHandler, true);
            this._clickOutsideHandler = null;
        }
        if (this._keydownHandler) {
            document.removeEventListener('keydown', this._keydownHandler);
            this._keydownHandler = null;
        }

        // ✅ Garantizar eliminación del DOM
        try {
            if (this.overlay.parentNode) {
                this.overlay.parentNode.removeChild(this.overlay);
            }
        } catch (e) {
            console.warn('Error al eliminar overlay:', e);
        }

        const overlays = document.querySelectorAll('.rojeru-datepicker-overlay');
        if (overlays.length > 1) {
            overlays.forEach(el => el.remove());
        }

        this.overlay = null;

        if (typeof this.options.onClose === 'function') {
            this.options.onClose();
        }
    }

    clear() {
        this.state.start = null;
        this.state.end = null;
        this.state.time = this.options.includeTime ? '00:00' : null;
        // ✅ RESTABLECER currentView a la fecha actual
        this.state.currentView = new Date();
        this.options.input.value = '';

        // Actualizar botón de limpiar
        const clearBtn = this.options.input.parentNode?.querySelector('.rojeru-datepicker-clear');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }

        if (typeof this.options.onSelect === 'function') {
            this.options.onSelect(null);
        }

        // Cerrar el datepicker después de limpiar
        setTimeout(() => this.close(), 50);
    }

    bindEvents() {
        const overlay = this.overlay;
        if (!overlay) return;

        // Navegación
        const prevBtn = overlay.querySelector('.rojeru-datepicker-nav.prev');
        const nextBtn = overlay.querySelector('.rojeru-datepicker-nav.next');
        const monthSelect = overlay.querySelector('.rojeru-datepicker-month');
        const yearSelect = overlay.querySelector('.rojeru-datepicker-year');
        const timeInput = overlay.querySelector('.rojeru-datepicker-time-input');
        const cancelBtn = overlay.querySelector('.rojeru-datepicker-btn.cancel');
        const acceptBtn = overlay.querySelector('.rojeru-datepicker-btn.accept');
        const clearBtn = overlay.querySelector('.rojeru-datepicker-btn.clear');

        // Navegación por meses
        prevBtn.addEventListener('click', () => this.navigate(-1));
        nextBtn.addEventListener('click', () => this.navigate(1));

        // Cambios en selectores
        monthSelect.addEventListener('change', (e) => {
            const newDate = new Date(this.state.currentView);
            newDate.setMonth(parseInt(e.target.value));
            this.state.currentView = newDate;
            this.updateView();
        });

        yearSelect.addEventListener('change', (e) => {
            const newDate = new Date(this.state.currentView);
            newDate.setFullYear(parseInt(e.target.value));
            this.state.currentView = newDate;
            this.updateView();
        });

        // Cambio de hora
        if (timeInput) {
            timeInput.addEventListener('change', (e) => {
                this.state.time = e.target.value;
            });
            timeInput.addEventListener('input', (e) => {
                this.state.time = e.target.value;
            });
        }

        // Botones
        cancelBtn.addEventListener('click', () => this.close());
        acceptBtn.addEventListener('click', () => this.acceptSelection());

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clear());
        }

        // Navegación con teclado
        this._keydownHandler = (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
            if (e.key === 'ArrowLeft') {
                this.navigate(-1);
            }
            if (e.key === 'ArrowRight') {
                this.navigate(1);
            }
        };
        document.addEventListener('keydown', this._keydownHandler);

        // Clic fuera - MODAL
        if (this.options.mode === 'modal') {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay && this.options.closeOnOverlayClick) {
                    this.close();
                }
            });
        }
        // Clic fuera - DROPDOWN
        else {
            this._clickOutsideHandler = (e) => {
                // Si el clic no es dentro del overlay ni en el input, cerrar
                if (!overlay.contains(e.target) && e.target !== this.options.input) {
                    this.close();
                }
            };

            // Usar capture: true para manejar el evento antes que otros listeners
            document.addEventListener('click', this._clickOutsideHandler, true);
        }
    }

    navigate(direction) {
        const newDate = new Date(this.state.currentView);
        newDate.setMonth(newDate.getMonth() + direction);
        this.state.currentView = newDate;
        this.updateView();
    }

    acceptSelection() {
        let result = null;

        if (this.options.type === 'range') {
            if (this.state.start && this.state.end) {
                result = {
                    start: this.state.start,
                    end: this.state.end,
                    time: this.state.time,
                    formatted: this.formatOutput()
                };
            }
        } else {
            if (this.state.start) {
                result = {
                    date: this.state.start,
                    time: this.state.time,
                    formatted: this.formatOutput()
                };
            }
        }

        if (result) {
            this.options.input.value = result.formatted;

            // Actualizar botón de limpiar
            const clearBtn = this.options.input.parentNode?.querySelector('.rojeru-datepicker-clear');
            if (clearBtn) {
                clearBtn.style.display = 'block';
            }

            if (typeof this.options.onSelect === 'function') {
                this.options.onSelect(result);
            }

            this.close();
        }
    }

    formatOutput() {
        if (this.options.type === 'range') {
            const startStr = this.formatDate(this.state.start);
            const endStr = this.formatDate(this.state.end);
            let output = `${startStr} - ${endStr}`;

            if (this.state.time && this.options.includeTime) {
                output += ` ${this.state.time}`;
            }

            return output;
        } else {
            let output = this.formatDate(this.state.start);

            if (this.state.time && this.options.includeTime) {
                output += ` ${this.state.time}`;
            }

            return output;
        }
    }

    formatDate(date) {
        if (!date) return '';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const shortYear = year.toString().slice(-2);

        return this.options.format
            .replace(/dd/g, day)
            .replace(/d/g, date.getDate().toString())
            .replace(/mm/g, month)
            .replace(/m/g, (date.getMonth() + 1).toString())
            .replace(/YYYY/g, year.toString())
            .replace(/YY/g, shortYear)
            .replace(/yyyy/g, year.toString())
            .replace(/yy/g, shortYear)
            .replace(/y/g, year.toString());
    }

    renderTemplate() {
        const isRange = this.options.type === 'range';
        const includeTime = this.options.includeTime;
        const hasTitle = this.options.title && this.options.title.trim() !== '';
        const t = this.t.bind(this);

        // ✅ Determinar clase de botones según typeButtons
        const buttonClass = this.options.typeButtons === 'outline' ? 'outline' : '';

        return `
    <div class="rojeru-datepicker ${isRange ? 'rojeru-datepicker-range' : ''} ${this.isDarkMode ? 'rojeru-dark-mode' : ''}">
      ${hasTitle ? `<div class="rojeru-datepicker-title">${this.options.title}</div>` : ''}
      <div class="rojeru-datepicker-header">
        <button class="rojeru-datepicker-nav prev ${buttonClass}" aria-label="${t('mes_anterior')}">&lt;</button>
        <div class="rojeru-datepicker-controls">
          <select class="rojeru-datepicker-month ${buttonClass}" aria-label="${t('seleccionar_mes')}"></select>
          <select class="rojeru-datepicker-year ${buttonClass}" aria-label="${t('seleccionar_anio')}"></select>
        </div>
        <button class="rojeru-datepicker-nav next ${buttonClass}" aria-label="${t('mes_siguiente')}">&gt;</button>
      </div>
      
      <div class="rojeru-datepicker-body"></div>
      
      ${includeTime ? `
        <div class="rojeru-datepicker-time">
          <label>${t('hora')}:</label>
          <input type="time" class="rojeru-datepicker-time-input ${buttonClass}" value="${this.state.time || '00:00'}">
        </div>
      ` : ''}
      
      ${isRange ? `
        <div class="rojeru-datepicker-range-info">
          <div class="rojeru-datepicker-selected start" style="display:none;">
            <strong>${t('desde')}:</strong> <span></span>
          </div>
          <div class="rojeru-datepicker-selected end" style="display:none;">
            <strong>${t('hasta')}:</strong> <span></span>
          </div>
        </div>
      ` : ''}
      
      <div class="rojeru-datepicker-footer">
        ${this.options.allowClear ? `<button class="rojeru-datepicker-btn clear ${buttonClass}">${t('limpiar')}</button>` : ''}
        <button class="rojeru-datepicker-btn cancel ${buttonClass}">${t('cancelar')}</button>
        <button class="rojeru-datepicker-btn accept ${buttonClass}" disabled>${t('aceptar')}</button>
      </div>
    </div>
  `;
    }

    updateView() {
        const { currentView } = this.state;
        const month = currentView.getMonth();
        const year = currentView.getFullYear();

        const monthSelect = this.overlay.querySelector('.rojeru-datepicker-month');
        const yearSelect = this.overlay.querySelector('.rojeru-datepicker-year');
        const body = this.overlay.querySelector('.rojeru-datepicker-body');

        // Verificar que los elementos existen
        if (!monthSelect || !yearSelect || !body) {
            console.error('Elementos del datepicker no encontrados');
            return;
        }

        // Actualizar selects
        this.updateMonthSelect(monthSelect, month);
        this.updateYearSelect(yearSelect, year);

        // Limpiar cuerpo
        body.innerHTML = '';

        // Agregar días de la semana
        const weekDays = this.getWeekDays();
        weekDays.forEach(day => {
            const cell = document.createElement('div');
            cell.className = 'rojeru-datepicker-weekday';
            cell.textContent = day;
            cell.setAttribute('aria-label', day);
            body.appendChild(cell);
        });

        // Calcular primer día del mes con ajuste de weekStart
        const firstDay = new Date(year, month, 1);
        let offset = firstDay.getDay() - this.options.weekStart;
        if (offset < 0) offset += 7;

        // Días del mes anterior
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = offset - 1; i >= 0; i--) {
            const cell = document.createElement('div');
            const day = prevMonthLastDay - i;
            cell.textContent = day;
            cell.className = 'rojeru-datepicker-day rojeru-datepicker-day-outside';
            body.appendChild(cell);
        }

        // Días del mes actual
        const lastDay = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // ✅ Determinar clase para los días
        const dayButtonClass = this.options.typeButtons === 'outline' ? 'outline' : '';

        for (let day = 1; day <= lastDay; day++) {
            const cell = document.createElement('button');
            // ✅ Agregar clase outline si corresponde
            cell.className = `rojeru-datepicker-day ${dayButtonClass}`;
            cell.textContent = day;
            cell.type = 'button';

            const cellDate = new Date(year, month, day);
            cell.dataset.date = cellDate.toISOString();

            // Verificar si está en rango seleccionado
            let isInRange = false;
            if (this.options.type === 'range' && this.state.start && this.state.end) {
                isInRange = cellDate >= this.state.start && cellDate <= this.state.end;
            }

            // Verificar si está seleccionado
            const isStart = this.state.start && cellDate.getTime() === this.state.start.getTime();
            const isEnd = this.state.end && cellDate.getTime() === this.state.end.getTime();
            const isSelected = isStart || isEnd;

            // Verificar si es hoy
            const isToday = cellDate.getTime() === today.getTime();

            // Aplicar clases
            if (isSelected) {
                cell.classList.add('selected');
            } else if (isInRange) {
                cell.classList.add('in-range');
            } else if (isToday) {
                cell.classList.add('today');
            }

            // Verificar si está deshabilitado
            const isDisabled = this.isDateDisabled(cellDate);
            if (isDisabled) {
                cell.classList.add('disabled');
                cell.disabled = true;
            } else {
                cell.addEventListener('click', () => this.handleDayClick(cellDate));
                cell.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.handleDayClick(cellDate);
                    }
                });
            }

            body.appendChild(cell);
        }

        this.updateAcceptButton();
        this.updateRangeInfo();
    }

    getWeekDays() {
        // Base de días según locale
        const translations = {
            es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        };

        const baseDays = translations[this.options.locale] || translations.es;

        // Ajustar según weekStart
        if (this.options.weekStart === 1) { // Lunes
            return [...baseDays.slice(1), baseDays[0]];
        }

        return baseDays; // 0 = Domingo
    }

    isDateDisabled(date) {
        const min = this.options.minDate;
        const max = this.options.maxDate;

        if (min && date < min) return true;
        if (max && date > max) return true;

        return false;
    }

    updateMonthSelect(select, currentMonth) {
        select.innerHTML = '';
        const months = this.getMonths();

        months.forEach((name, i) => {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = name;
            option.selected = i === currentMonth;
            select.appendChild(option);
        });
    }

    updateYearSelect(select, currentYear) {
        select.innerHTML = '';

        const startYear = currentYear - 50;
        const endYear = currentYear + 10;

        for (let decade = Math.floor(startYear / 10) * 10; decade <= endYear; decade += 10) {
            const group = document.createElement('optgroup');
            group.label = this.options.locale === 'es' ? `Década ${decade}s` : `${decade}s`;
            select.appendChild(group);

            for (let y = decade; y < decade + 10 && y <= endYear; y++) {
                if (y >= startYear) {
                    const option = document.createElement('option');
                    option.value = y;
                    option.textContent = y.toString();
                    option.selected = y === currentYear;
                    group.appendChild(option);
                }
            }
        }
    }

    getMonths() {
        const months = [];
        for (let i = 0; i < 12; i++) {
            const date = new Date(2023, i, 1);
            months.push(
                new Intl.DateTimeFormat(this.options.locale, { month: 'long' })
                    .format(date)
                    .charAt(0)
                    .toUpperCase() +
                new Intl.DateTimeFormat(this.options.locale, { month: 'long' })
                    .format(date)
                    .slice(1)
            );
        }
        return months;
    }

    handleDayClick(date) {
        date.setHours(0, 0, 0, 0);

        if (this.options.type === 'range') {
            if (!this.state.start || this.state.end) {
                this.state.start = date;
                this.state.end = null;
            } else if (date >= this.state.start) {
                this.state.end = date;
            } else {
                this.state.end = this.state.start;
                this.state.start = date;
            }
        } else {
            this.state.start = date;
        }

        this.updateView();
    }

    updateAcceptButton() {
        const acceptBtn = this.overlay.querySelector('.rojeru-datepicker-btn.accept');
        if (!acceptBtn) return;

        if (this.options.type === 'range') {
            acceptBtn.disabled = !(this.state.start && this.state.end);
        } else {
            acceptBtn.disabled = !this.state.start;
        }
    }

    updateRangeInfo() {
        if (this.options.type !== 'range') return;

        const startEl = this.overlay.querySelector('.rojeru-datepicker-selected.start');
        const endEl = this.overlay.querySelector('.rojeru-datepicker-selected.end');

        if (startEl && this.state.start) {
            startEl.style.display = 'block';
            startEl.querySelector('span').textContent = this.formatDate(this.state.start);
        } else if (startEl) {
            startEl.style.display = 'none';
        }

        if (endEl && this.state.end) {
            endEl.style.display = 'block';
            endEl.querySelector('span').textContent = this.formatDate(this.state.end);
        } else if (endEl) {
            endEl.style.display = 'none';
        }
    }

    t(key) {
        const translations = {
            es: {
                hora: 'Hora',
                desde: 'Desde',
                hasta: 'Hasta',
                aceptar: 'Aceptar',
                cancelar: 'Cancelar',
                limpiar: 'Limpiar',
                mes_anterior: 'Mes anterior',
                mes_siguiente: 'Mes siguiente',
                seleccionar_mes: 'Seleccionar mes',
                seleccionar_anio: 'Seleccionar año',
                diasSemana: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
            },
            en: {
                hora: 'Time',
                desde: 'From',
                hasta: 'To',
                aceptar: 'Accept',
                cancelar: 'Cancel',
                limpiar: 'Clear',
                mes_anterior: 'Previous month',
                mes_siguiente: 'Next month',
                seleccionar_mes: 'Select month',
                seleccionar_anio: 'Select year',
                diasSemana: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            }
        };

        const lang = translations[this.options.locale] || translations.es;
        return lang[key] || `[${key}]`;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = RojeruDatePicker;
} else if (typeof define === 'function' && define.amd) {
    define([], function() {
        return RojeruDatePicker;
    });
} else if (typeof window !== 'undefined') {
    window.RojeruDatePicker = RojeruDatePicker;
}