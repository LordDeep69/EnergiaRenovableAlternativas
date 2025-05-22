class PresentationManager {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 18;
        this.downloadsEnabled = false;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupDownloads();
        this.updateSlideCounter();
        this.updateProgressBar();
        console.log('✅ Presentación inicializada');
    }

    enableDownloads() {
        this.downloadsEnabled = true;
        console.log('✅ Descargas habilitadas');
    }

    setupNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
            nextBtn.addEventListener('click', () => this.nextSlide());
            console.log('✅ Navegación configurada');
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === 'Home') this.goToSlide(1);
            if (e.key === 'End') this.goToSlide(this.totalSlides);
        });
    }

    setupDownloads() {
        const pdfBtn = document.getElementById('downloadPDF');
        const pptBtn = document.getElementById('downloadPPT');

        if (pdfBtn && pptBtn) {
            pdfBtn.addEventListener('click', () => this.downloadAsPDF());
            pptBtn.addEventListener('click', () => this.downloadAsPowerPoint());
            console.log('✅ Botones de descarga configurados');
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;

        const currentSlideEl = document.getElementById(`slide-${this.currentSlide}`);
        if (currentSlideEl) {
            currentSlideEl.classList.remove('active');
        }

        this.currentSlide = slideNumber;
        const newSlideEl = document.getElementById(`slide-${this.currentSlide}`);
        if (newSlideEl) {
            newSlideEl.classList.add('active');
        }

        this.updateSlideCounter();
        this.updateProgressBar();
        this.initSlideFeatures();
    }

    initSlideFeatures() {
        setTimeout(() => {
            if (this.currentSlide === 2) {
                this.initAgendaSlide();
            }
        }, 100);
    }

    initAgendaSlide() {
        const agendaItems = document.querySelectorAll('.agenda-item');
        
        agendaItems.forEach((item) => {
            item.style.cursor = 'pointer';
            
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            newItem.addEventListener('click', () => {
                const slideText = newItem.querySelector('.item-slides').textContent;
                const slideMatch = slideText.match(/\d+/);
                
                if (slideMatch) {
                    const slideNumber = parseInt(slideMatch[0]);
                    if (slideNumber && slideNumber <= this.totalSlides) {
                        this.goToSlide(slideNumber);
                    }
                }
            });
            
            newItem.addEventListener('mouseenter', () => {
                newItem.style.transform = 'translateX(5px)';
            });
            
            newItem.addEventListener('mouseleave', () => {
                newItem.style.transform = 'translateX(0)';
            });
        });
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    updateSlideCounter() {
        const counter = document.querySelector('.slide-counter');
        if (counter) {
            counter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
        }
    }

    updateProgressBar() {
        let progressBar = document.querySelector('.progress-bar');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            document.body.appendChild(progressBar);
        }
        
        const progress = (this.currentSlide / this.totalSlides) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // NUEVA FUNCIÓN PDF NATIVA - SIN HTML2CANVAS
    async downloadAsPDF() {
        console.log('🔄 Iniciando descarga PDF nativa...');
        
        if (!this.downloadsEnabled) {
            alert('Las librerías de descarga aún se están cargando. Intenta en unos segundos.');
            return;
        }

        if (typeof window.jspdf === 'undefined') {
            console.error('❌ Librería jsPDF no disponible');
            alert('Error: Librería de PDF no disponible');
            return;
        }

        const pdfBtn = document.getElementById('downloadPDF');
        const btnText = pdfBtn.querySelector('.btn-text');
        
        try {
            // Estado de carga
            btnText.textContent = 'Generando...';
            pdfBtn.style.opacity = '0.7';
            pdfBtn.style.pointerEvents = 'none';

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            
            // Configurar fuentes y metadatos
            pdf.setFont('helvetica');
            pdf.setProperties({
                title: 'Energías Renovables Alternativas',
                subject: 'Biomasa, Geotérmica, Mareomotriz, Energía de las Olas y Térmica Solar',
                author: 'Presentación Técnica Especializada',
                creator: 'Sistema de Presentaciones Web'
            });
            
            console.log('📄 Creando diapositivas...');
            
            // Crear cada diapositiva
            this.createSlide1(pdf);
            
            pdf.addPage();
            this.createSlide2(pdf);
            
            // Placeholder para futuras diapositivas
            for (let i = 3; i <= this.totalSlides; i++) {
                pdf.addPage();
                this.createPlaceholderSlide(pdf, i);
            }
            
            // Descargar
            pdf.save('Energias-Renovables-Alternativas.pdf');
            console.log('✅ PDF generado exitosamente');
            
            // Estado de éxito
            btnText.textContent = '¡Descargado!';
            setTimeout(() => {
                btnText.textContent = 'PDF';
            }, 2000);

        } catch (error) {
            console.error('❌ Error generando PDF:', error);
            btnText.textContent = 'Error';
            setTimeout(() => {
                btnText.textContent = 'PDF';
            }, 2000);
        } finally {
            pdfBtn.style.opacity = '1';
            pdfBtn.style.pointerEvents = 'auto';
        }
    }

    // Crear Diapositiva 1 - Portada
    createSlide1(pdf) {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Fondo degradado (simulado con rectángulos)
        pdf.setFillColor(15, 23, 42); // #0f172a
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        pdf.setFillColor(30, 41, 59); // #1e293b
        pdf.rect(0, pageHeight * 0.7, pageWidth, pageHeight * 0.3, 'F');
        
        // Título principal
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(48);
        pdf.setFont('helvetica', 'bold');
        
        const title1 = 'Energías Renovables';
        const title2 = 'del Futuro';
        
        // Centrar texto
        const title1Width = pdf.getTextWidth(title1);
        const title2Width = pdf.getTextWidth(title2);
        
        pdf.text(title1, (pageWidth - title1Width) / 2, pageHeight * 0.3);
        
        // Título con "gradiente" (simulado con colores)
        pdf.setTextColor(34, 197, 94); // Verde
        pdf.text(title2, (pageWidth - title2Width) / 2, pageHeight * 0.4);
        
        // Subtítulo
        pdf.setTextColor(148, 163, 184); // Gris claro
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'normal');
        
        const subtitle = 'Biomasa • Geotérmica • Mareomotriz • Energía de las Olas • Térmica Solar';
        const subtitleWidth = pdf.getTextWidth(subtitle);
        pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, pageHeight * 0.5);
        
        // Iconos de energía (simulados con texto y colores)
        const energies = [
            { name: 'Biomasa', color: [34, 197, 94], icon: '🌿' },
            { name: 'Geotérmica', color: [239, 68, 68], icon: '🏔️' },
            { name: 'Mareomotriz', color: [59, 130, 246], icon: '🌊' },
            { name: 'Olas', color: [6, 182, 212], icon: '〰️' },
            { name: 'Térmica Solar', color: [245, 158, 11], icon: '☀️' }
        ];
        
        const startX = pageWidth * 0.1;
        const iconSpacing = (pageWidth * 0.8) / energies.length;
        
        energies.forEach((energy, index) => {
            const x = startX + (index * iconSpacing);
            const y = pageHeight * 0.65;
            
            // Fondo del icono
            pdf.setFillColor(255, 255, 255, 0.1);
            pdf.roundedRect(x - 15, y - 15, 30, 25, 5, 5, 'F');
            
            // Icono (emoji)
            pdf.setFontSize(20);
            pdf.text(energy.icon, x - 5, y - 5);
            
            // Nombre
            pdf.setTextColor(...energy.color);
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            const nameWidth = pdf.getTextWidth(energy.name);
            pdf.text(energy.name, x - (nameWidth / 2), y + 15);
        });
        
        // Información de presentación
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        
        const date = 'Mayo 2025';
        const author = 'Presentación Técnica Especializada';
        const dateWidth = pdf.getTextWidth(date);
        const authorWidth = pdf.getTextWidth(author);
        
        pdf.text(date, (pageWidth - dateWidth) / 2, pageHeight * 0.85);
        pdf.text(author, (pageWidth - authorWidth) / 2, pageHeight * 0.9);
    }

    // Crear Diapositiva 2 - Agenda
    createSlide2(pdf) {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Fondo
        pdf.setFillColor(15, 23, 42);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Título
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(36);
        pdf.setFont('helvetica', 'bold');
        
        const title = 'Agenda de Presentación';
        const titleWidth = pdf.getTextWidth(title);
        pdf.text(title, (pageWidth - titleWidth) / 2, 30);
        
        // Subtítulo
        pdf.setTextColor(148, 163, 184);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        
        const subtitle = 'Explorando el futuro de las energías renovables alternativas';
        const subtitleWidth = pdf.getTextWidth(subtitle);
        pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, 45);
        
        // Secciones de agenda
        const sections = [
            {
                number: '01',
                title: 'Introducción',
                color: [59, 130, 246],
                items: [
                    'Contexto Global Energético - Diapositiva 3',
                    'Panorama General Comparativo - Diapositiva 4'
                ]
            },
            {
                number: '02',
                title: 'Energía de Biomasa',
                color: [34, 197, 94],
                items: [
                    'Fundamentos y Tipos - Diapositiva 5',
                    'Tecnologías y Aplicaciones - Diapositiva 6',
                    'Ventajas y Desafíos - Diapositiva 7'
                ]
            },
            {
                number: '03',
                title: 'Energía Geotérmica',
                color: [239, 68, 68],
                items: [
                    'Principios Fundamentales - Diapositiva 8',
                    'Tecnologías y Clasificación - Diapositiva 9',
                    'Casos de Éxito Mundial - Diapositiva 10'
                ]
            },
            {
                number: '04',
                title: 'Energías Marinas',
                color: [6, 182, 212],
                items: [
                    'Energía Mareomotriz - Diapositivas 11-12',
                    'Energía de las Olas - Diapositivas 13-14'
                ]
            },
            {
                number: '05',
                title: 'Energía Térmica Solar',
                color: [245, 158, 11],
                items: [
                    'Tecnología CSP - Diapositiva 15',
                    'Almacenamiento y Eficiencia - Diapositiva 16'
                ]
            },
            {
                number: '06',
                title: 'Análisis y Conclusiones',
                color: [139, 92, 246],
                items: [
                    'Comparativa Final - Diapositiva 17',
                    'Futuro y Perspectivas - Diapositiva 18'
                ]
            }
        ];
        
                // Dibujar secciones en grid 2x3
                const cols = 2;
                const rows = 3;
                const sectionWidth = (pageWidth - 60) / cols;
                const sectionHeight = (pageHeight - 120) / rows;
                
                sections.forEach((section, index) => {
                    const col = index % cols;
                    const row = Math.floor(index / cols);
                    
                    const x = 30 + (col * sectionWidth);
                    const y = 70 + (row * sectionHeight);
                    
                    // Fondo de sección
                    pdf.setFillColor(255, 255, 255, 0.05);
                    pdf.roundedRect(x, y, sectionWidth - 10, sectionHeight - 10, 5, 5, 'F');
                    
                    // Línea superior de color
                    pdf.setFillColor(...section.color);
                    pdf.rect(x, y, sectionWidth - 10, 3, 'F');
                    
                    // Número de sección
                    pdf.setFillColor(...section.color);
                    pdf.circle(x + 15, y + 20, 8, 'F');
                    
                    pdf.setTextColor(255, 255, 255);
                    pdf.setFontSize(12);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(section.number, x + 12, y + 23);
                    
                    // Título de sección
                    pdf.setTextColor(255, 255, 255);
                    pdf.setFontSize(14);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(section.title, x + 30, y + 23);
                    
                    // Items
                    pdf.setTextColor(226, 232, 240);
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'normal');
                    
                    section.items.forEach((item, itemIndex) => {
                        pdf.text('• ' + item, x + 10, y + 40 + (itemIndex * 12));
                    });
                });
                
                // Footer
                pdf.setTextColor(148, 163, 184);
                pdf.setFontSize(12);
                const footerText = '⏱️ Duración estimada: 25-30 minutos';
                pdf.text(footerText, 30, pageHeight - 20);
            }
        
            // Crear diapositivas placeholder para las que aún no están desarrolladas
            createPlaceholderSlide(pdf, slideNumber) {
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                
                // Fondo
                pdf.setFillColor(15, 23, 42);
                pdf.rect(0, 0, pageWidth, pageHeight, 'F');
                
                // Título placeholder
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(36);
                pdf.setFont('helvetica', 'bold');
                
                const title = `Diapositiva ${slideNumber}`;
                const titleWidth = pdf.getTextWidth(title);
                pdf.text(title, (pageWidth - titleWidth) / 2, pageHeight * 0.4);
                
                // Subtítulo
                pdf.setTextColor(148, 163, 184);
                pdf.setFontSize(16);
                pdf.setFont('helvetica', 'normal');
                
                const subtitle = 'Contenido en desarrollo';
                const subtitleWidth = pdf.getTextWidth(subtitle);
                pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, pageHeight * 0.5);
                
                // Mensaje informativo
                pdf.setTextColor(100, 116, 139);
                pdf.setFontSize(12);
                const message = 'Esta diapositiva será desarrollada en las próximas iteraciones';
                const messageWidth = pdf.getTextWidth(message);
                pdf.text(message, (pageWidth - messageWidth) / 2, pageHeight * 0.6);
            }
        
            // PowerPoint con método nativo también
            async downloadAsPowerPoint() {
                console.log('🔄 Iniciando descarga PowerPoint nativa...');
                
                if (!this.downloadsEnabled) {
                    alert('Las librerías de descarga aún se están cargando. Intenta en unos segundos.');
                    return;
                }
        
                if (typeof PptxGenJS === 'undefined') {
                    console.error('❌ Librería PptxGenJS no disponible');
                    alert('Error: Librería de PowerPoint no disponible');
                    return;
                }
        
                const pptBtn = document.getElementById('downloadPPT');
                const btnText = pptBtn.querySelector('.btn-text');
                
                try {
                    btnText.textContent = 'Generando...';
                    pptBtn.style.opacity = '0.7';
                    pptBtn.style.pointerEvents = 'none';
        
                    const pptx = new PptxGenJS();
                    pptx.layout = 'LAYOUT_16x9';
                    
                    // Configurar propiedades
                    pptx.author = 'Presentación Energías Renovables';
                    pptx.company = 'Energías del Futuro';
                    pptx.subject = 'Energías Renovables Alternativas';
                    pptx.title = 'Biomasa, Geotérmica, Mareomotriz, Energía de las Olas y Térmica Solar';
        
                    console.log('📊 Creando diapositivas PowerPoint...');
                    
                    // Crear diapositivas
                    this.createPPTSlide1(pptx);
                    this.createPPTSlide2(pptx);
                    
                    // Placeholder para futuras diapositivas
                    for (let i = 3; i <= this.totalSlides; i++) {
                        this.createPPTPlaceholderSlide(pptx, i);
                    }
        
                    // Descargar
                    await pptx.writeFile({ fileName: 'Energias-Renovables-Alternativas.pptx' });
                    console.log('✅ PowerPoint generado exitosamente');
        
                    btnText.textContent = '¡Descargado!';
                    setTimeout(() => {
                        btnText.textContent = 'PowerPoint';
                    }, 2000);
        
                } catch (error) {
                    console.error('❌ Error generando PowerPoint:', error);
                    btnText.textContent = 'Error';
                    setTimeout(() => {
                        btnText.textContent = 'PowerPoint';
                    }, 2000);
                } finally {
                    pptBtn.style.opacity = '1';
                    pptBtn.style.pointerEvents = 'auto';
                }
            }
        
            // Crear Diapositiva 1 PowerPoint - Portada
            createPPTSlide1(pptx) {
                const slide = pptx.addSlide();
                
                // Fondo
                slide.background = { color: '0f172a' };
                
                // Título principal
                slide.addText('Energías Renovables', {
                    x: 1,
                    y: 2,
                    w: 8,
                    h: 1,
                    fontSize: 48,
                    fontFace: 'Arial',
                    color: 'ffffff',
                    bold: true,
                    align: 'center'
                });
                
                // Título con gradiente simulado
                slide.addText('del Futuro', {
                    x: 1,
                    y: 3,
                    w: 8,
                    h: 1,
                    fontSize: 48,
                    fontFace: 'Arial',
                    color: '22c55e',
                    bold: true,
                    align: 'center'
                });
                
                // Subtítulo
                slide.addText('Biomasa • Geotérmica • Mareomotriz • Energía de las Olas • Térmica Solar', {
                    x: 1,
                    y: 4.5,
                    w: 8,
                    h: 0.5,
                    fontSize: 16,
                    fontFace: 'Arial',
                    color: '94a3b8',
                    align: 'center'
                });
                
                // Información de presentación
                slide.addText('Mayo 2025\nPresentación Técnica Especializada', {
                    x: 1,
                    y: 6.5,
                    w: 8,
                    h: 1,
                    fontSize: 12,
                    fontFace: 'Arial',
                    color: '64748b',
                    align: 'center'
                });
            }
        
            // Crear Diapositiva 2 PowerPoint - Agenda
            createPPTSlide2(pptx) {
                const slide = pptx.addSlide();
                
                // Fondo
                slide.background = { color: '0f172a' };
                
                // Título
                slide.addText('Agenda de Presentación', {
                    x: 1,
                    y: 0.5,
                    w: 8,
                    h: 0.8,
                    fontSize: 36,
                    fontFace: 'Arial',
                    color: 'ffffff',
                    bold: true,
                    align: 'center'
                });
                
                // Subtítulo
                slide.addText('Explorando el futuro de las energías renovables alternativas', {
                    x: 1,
                    y: 1.3,
                    w: 8,
                    h: 0.5,
                    fontSize: 14,
                    fontFace: 'Arial',
                    color: '94a3b8',
                    align: 'center'
                });
                
                // Secciones de agenda
                const agendaText = `
        01. Introducción
            • Contexto Global Energético - Diapositiva 3
            • Panorama General Comparativo - Diapositiva 4
        
        02. Energía de Biomasa
            • Fundamentos y Tipos - Diapositiva 5
            • Tecnologías y Aplicaciones - Diapositiva 6
            • Ventajas y Desafíos - Diapositiva 7
        
        03. Energía Geotérmica
            • Principios Fundamentales - Diapositiva 8
            • Tecnologías y Clasificación - Diapositiva 9
            • Casos de Éxito Mundial - Diapositiva 10
                `;
                
                slide.addText(agendaText, {
                    x: 0.5,
                    y: 2.2,
                    w: 4.5,
                    h: 4,
                    fontSize: 12,
                    fontFace: 'Arial',
                    color: 'e2e8f0',
                    valign: 'top'
                });
                
                const agendaText2 = `
        04. Energías Marinas
            • Energía Mareomotriz - Diapositivas 11-12
            • Energía de las Olas - Diapositivas 13-14
        
        05. Energía Térmica Solar
            • Tecnología CSP - Diapositiva 15
            • Almacenamiento y Eficiencia - Diapositiva 16
        
        06. Análisis y Conclusiones
            • Comparativa Final - Diapositiva 17
            • Futuro y Perspectivas - Diapositiva 18
                `;
                
                slide.addText(agendaText2, {
                    x: 5,
                    y: 2.2,
                    w: 4.5,
                    h: 4,
                    fontSize: 12,
                    fontFace: 'Arial',
                    color: 'e2e8f0',
                    valign: 'top'
                });
                
                // Footer
                slide.addText('⏱️ Duración estimada: 25-30 minutos', {
                    x: 0.5,
                    y: 6.5,
                    w: 4,
                    h: 0.5,
                    fontSize: 12,
                    fontFace: 'Arial',
                    color: '94a3b8'
                });
            }
        
            // Crear diapositivas placeholder PowerPoint
            createPPTPlaceholderSlide(pptx, slideNumber) {
                const slide = pptx.addSlide();
                
                // Fondo
                slide.background = { color: '0f172a' };
                
                // Título
                slide.addText(`Diapositiva ${slideNumber}`, {
                    x: 1,
                    y: 2.5,
                    w: 8,
                    h: 1,
                    fontSize: 36,
                    fontFace: 'Arial',
                    color: 'ffffff',
                    bold: true,
                    align: 'center'
                });
                
                // Subtítulo
                slide.addText('Contenido en desarrollo', {
                    x: 1,
                    y: 3.5,
                    w: 8,
                    h: 0.5,
                    fontSize: 16,
                    fontFace: 'Arial',
                    color: '94a3b8',
                    align: 'center'
                });
                
                // Mensaje
                slide.addText('Esta diapositiva será desarrollada en las próximas iteraciones', {
                    x: 1,
                    y: 4.5,
                    w: 8,
                    h: 0.5,
                    fontSize: 12,
                    fontFace: 'Arial',
                    color: '64748b',
                    align: 'center'
                });
            }
        
            wait(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        }
        
        // Efectos para la primera diapositiva
        function addInteractiveEffects() {
            const energyIcons = document.querySelectorAll('.energy-icon');
            
            energyIcons.forEach((icon) => {
                icon.addEventListener('mouseenter', () => {
                    icon.style.transform = 'translateY(-15px) scale(1.05)';
                });
                
                icon.addEventListener('mouseleave', () => {
                    icon.style.transform = 'translateY(-10px) scale(1)';
                });
            });
            
            createFloatingParticles();
        }
        
        function createFloatingParticles() {
            const particleContainer = document.querySelector('.energy-particles');
            if (!particleContainer) return;
            
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.className = 'floating-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 6 + 2}px;
                    height: ${Math.random() * 6 + 2}px;
                    background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: floatParticle ${Math.random() * 10 + 15}s linear infinite;
                    animation-delay: ${Math.random() * 5}s;
                `;
                
                particleContainer.appendChild(particle);
            }
        }
        
        // Inicialización
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 Iniciando presentación...');
            
            window.presentation = new PresentationManager();
            
            setTimeout(() => {
                addInteractiveEffects();
                console.log('✨ Efectos agregados');
            }, 1000);
        });