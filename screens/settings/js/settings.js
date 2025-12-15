window.initSettingsModule = function() {
    console.log("⚙️ Módulo de Configurações Inicializado - V3 - Temas e Fixes");

    // === 1. UTILITÁRIOS DE COR ===
    // Converte Hex (#ffffff) para RGB (255, 255, 255) para usar nas variáveis de opacidade
    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        let bigint = parseInt(hex, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return `${r}, ${g}, ${b}`;
    }

    // Escurece ou clareia uma cor (para criar gradientes automáticos)
    function shadeColor(color, percent) {
        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  

        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

        return "#"+RR+GG+BB;
    }
    
    // Gera um gradiente sutil baseado na cor de fundo
    function generateGradient(hexColor) {
        return `linear-gradient(135deg, ${hexColor} 0%, ${shadeColor(hexColor, -20)} 100%)`;
    }
    
    // Função auxiliar para aplicar opacidade
    function hexToRgba(hex, alpha) {
        const rgb = hexToRgb(hex);
        return `rgba(${rgb}, ${alpha})`;
    }


    // === 2. DEFINIÇÃO DE TEMAS (7 no total: 2 existentes + 5 novos) ===
    
    // Função para gerar variáveis complementares automaticamente
    const getBaseThemeVars = (isLight, highlightHex) => ({
        '--highlight-color': highlightHex,
        '--highlight-rgb': hexToRgb(highlightHex),
        '--bloom-color': hexToRgba(highlightHex, 0.35),
        
        '--glass-border': isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        '--ripple-color': isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
        '--text-primary': isLight ? '#0d1b2a' : '#EAEAEA',
        '--text-secondary': isLight ? '#415a77' : '#A9A9B3',
        '--icon-color': isLight ? '#415a77' : '#A9A9B3',
        '--btn-primary-color': isLight ? '#ffffff' : '#0d1b2a', 
        '--surface-color-secondary': isLight ? '#F0F4F8' : '#141c24', 
    });


    const themes = [
        // 1. Noite Estelar (Dark Existente)
        { 
            id: 'dark', 
            name: 'Noite Estelar', 
            isLight: false, 
            colors: {
                '--bg-color': '#0d1b2a', 
                '--surface-color': '#1b263b', 
                '--glass-bg': hexToRgba('#1b263b', 0.65), 
                ...getBaseThemeVars(false, '#6C63FF') // Azul Púrpura
            } 
        },
        // 2. Claro Sereno (Light Existente)
        { 
            id: 'light', 
            name: 'Claro Sereno', 
            isLight: true, 
            colors: {
                '--bg-color': '#f0f4f8', 
                '--surface-color': '#ffffff', 
                '--glass-bg': hexToRgba('#ffffff', 0.65), 
                ...getBaseThemeVars(true, '#0056b3') // Azul Clássico
            } 
        },
        // === NOVOS 5 TEMAS SOLICITADOS ===

        // 3. Onda Profunda (Azul Frio, Dark)
        {
            id: 'oceanic', 
            name: 'Onda Profunda', 
            isLight: false, 
            colors: {
                '--bg-color': '#051a28',
                '--surface-color': '#0c2e40',
                '--glass-bg': hexToRgba('#0c2e40', 0.65), 
                ...getBaseThemeVars(false, '#00BCD4') // Ciano
            }
        },
        // 4. Crepúsculo Quente (Laranja/Vermelho, Dark)
        {
            id: 'sunset', 
            name: 'Crepúsculo Quente', 
            isLight: false, 
            colors: {
                '--bg-color': '#211915',
                '--surface-color': '#362a22',
                '--glass-bg': hexToRgba('#362a22', 0.65),
                ...getBaseThemeVars(false, '#FF7043') // Laranja Pôr do Sol
            }
        },
        // 5. Verde Floresta (Verde, Dark)
        {
            id: 'forest', 
            name: 'Verde Floresta', 
            isLight: false, 
            colors: {
                '--bg-color': '#0e1f18',
                '--surface-color': '#1f3c2b',
                '--glass-bg': hexToRgba('#1f3c2b', 0.65),
                ...getBaseThemeVars(false, '#4CAF50') // Verde Esmeralda
            }
        },
        // 6. Minimalista (Cinza, Light)
        {
            id: 'minimal-light', 
            name: 'Minimalista', 
            isLight: true, 
            colors: {
                '--bg-color': '#F8F9FA',
                '--surface-color': '#FFFFFF',
                '--glass-bg': hexToRgba('#FFFFFF', 0.65),
                ...getBaseThemeVars(true, '#495057') // Cinza Chumbo
            }
        },
        // 7. Púrpura Retro (Púrpura, Dark)
        {
            id: 'retro-purple', 
            name: 'Púrpura Retro', 
            isLight: false, 
            colors: {
                '--bg-color': '#1A0D2C',
                '--surface-color': '#2C1B41',
                '--glass-bg': hexToRgba('#2C1B41', 0.65),
                ...getBaseThemeVars(false, '#AB47BC') // Púrpura Médio
            }
        }
    ];

    // === 3. SELETORES DE DOM ===
    const sidebarItems = document.querySelectorAll('.settings-menu li');
    const sections = document.querySelectorAll('.settings-section');
    const themeGrid = document.getElementById('theme-grid');
    const applyBtn = document.getElementById('apply-theme-btn');
    const previewCard = document.getElementById('preview-card');

    // Preview Elements Internos
    const pSidebar = previewCard.querySelector('.preview-sidebar');
    const pHeader = previewCard.querySelector('.preview-header');
    const pBoxes = previewCard.querySelectorAll('.preview-box');

    let selectedThemeId = localStorage.getItem('theme_id') || 'dark';


    // === 4. NAVEGAÇÃO ENTRE ABAS ===
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // === 5. GERAÇÃO E APLICAÇÃO DE TEMAS ===

    function updatePreview(theme) {
        // Atualiza a pré-visualização do tema
        previewCard.style.background = theme.colors['--bg-color'];
        pSidebar.style.background = theme.colors['--surface-color-secondary'] || theme.colors['--surface-color'];
        pHeader.style.background = theme.colors['--highlight-color'];

        pBoxes.forEach(box => {
            box.style.background = theme.colors['--surface-color'];
            box.style.borderColor = theme.colors['--glass-border'];
            box.style.color = theme.colors['--text-primary']; // Garante que o texto seja legível
        });

        previewCard.setAttribute('data-theme', theme.isLight ? 'light' : 'dark');
    }

    // Geração do HTML para seleção de temas
    function renderThemeOptions() {
        themeGrid.innerHTML = ''; 
        themes.forEach(theme => {
            const isSelected = theme.id === selectedThemeId;
            const primaryColor = theme.colors['--highlight-color'];
            const surfaceColor = theme.colors['--surface-color'];

            const themeOption = document.createElement('div');
            themeOption.classList.add('theme-option');
            if (isSelected) themeOption.classList.add('selected');
            themeOption.dataset.themeId = theme.id;
            themeOption.innerHTML = `
                <div class="theme-preview" style="background: ${theme.colors['--bg-color']}; border-color: ${primaryColor};">
                    <div class="preview-surface" style="background: ${surfaceColor};"></div>
                    <div class="preview-highlight" style="background: ${primaryColor};"></div>
                </div>
                <span class="theme-name">${theme.name}</span>
            `;

            themeOption.addEventListener('click', () => {
                selectedThemeId = theme.id;
                document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('selected'));
                themeOption.classList.add('selected');
                updatePreview(theme); // Atualiza preview imediatamente
            });

            themeGrid.appendChild(themeOption);
        });
    }

    // Aplica as variáveis globais ao root da página
    function applyGlobalTheme() {
        const root = document.documentElement;
        const theme = themes.find(t => t.id === selectedThemeId);

        if (!theme) {
            console.error("Tema selecionado não encontrado:", selectedThemeId);
            return;
        }

        // Aplica todas as variáveis de cor
        for (const key in theme.colors) {
            root.style.setProperty(key, theme.colors[key]);
        }
        
        // Aplica o gradiente de fundo especial
        const newGradient = generateGradient(theme.colors['--bg-color']);
        root.style.setProperty('--background-animation-bg', newGradient);
        
        // Define se é dark ou light (para ícones e contraste)
        document.body.setAttribute('data-theme', theme.isLight ? 'light' : 'dark');
        
        // Salva
        localStorage.setItem('theme_id', theme.id);
        
        // Feedback
        const originalText = applyBtn.textContent;
        applyBtn.textContent = "Tema Aplicado com Sucesso! ✨";
        setTimeout(() => applyBtn.textContent = originalText, 2500);
    }

    // === 6. LÓGICA DO "MODO LEVE" (ANIMAÇÃO) E SWITCHERS GERAIS (FIX) ===
    
    // Função global que adiciona/remove a classe de animação
    window.toggleLightModeAnimation = function(isActive) {
        if (isActive) {
            document.body.classList.add('no-animation');
        } else {
            document.body.classList.remove('no-animation');
        }
        localStorage.setItem('no_animation_mode', isActive ? 'true' : 'false');
    }
    
    // Configuração genérica de Toggles (Switchers) para persistência
    function setupToggle(id, storageKey, callback = (isActive) => {}) {
        const toggle = document.getElementById(id);
        if (toggle) {
            // 1. Define estado inicial (carrega do localStorage)
            const savedState = localStorage.getItem(storageKey) === 'true';
            toggle.checked = savedState;
            callback(savedState); // Aplica o estado inicial
            
            // 2. Adiciona listener
            toggle.addEventListener('change', (e) => {
                const newState = e.target.checked;
                localStorage.setItem(storageKey, newState ? 'true' : 'false');
                callback(newState);
            });
        }
    }
    
    // Configura todos os toggles
    setupToggle('light-mode-toggle', 'no_animation_mode', window.toggleLightModeAnimation);
    setupToggle('2fa-toggle', 'security_2fa_enabled', (isActive) => {
        console.log('2FA Ativado:', isActive);
    });
    setupToggle('desktop-notifications-toggle', 'notifications_desktop_enabled', (isActive) => {
        console.log('Notificações Desktop Ativado:', isActive);
    });
    setupToggle('email-notifications-toggle', 'notifications_email_enabled', (isActive) => {
        console.log('Notificações por E-mail Ativado:', isActive);
    });
    setupToggle('project-updates-toggle', 'notifications_project_updates', (isActive) => {
        console.log('Alertas de Projeto Ativado:', isActive);
    });
    // Adiciona toggle de auto-save
    setupToggle('auto-save-toggle', 'general_auto_save', (isActive) => {
        console.log('Auto Save Ativado:', isActive);
    });

    // === 7. INICIALIZAÇÃO ===
    const initialTheme = themes.find(t => t.id === selectedThemeId) || themes[0];
    renderThemeOptions();
    updatePreview(initialTheme);
    applyBtn.addEventListener('click', applyGlobalTheme);
    
    // Simula clique no primeiro item do menu para mostrar o conteúdo inicial (Aparência)
    if (sidebarItems.length > 0) {
        sidebarItems[0].click();
    }
};