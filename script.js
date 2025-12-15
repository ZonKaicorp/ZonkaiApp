document.addEventListener("DOMContentLoaded", () => {

    // === Seletores ===
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.overlay');
    const profileBtn = document.getElementById('profile-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const contentArea = document.getElementById('main-content');

    // Seletores de Modais
    const profileModal = document.getElementById('profile-modal');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');

    // Links de Navegação de Modais
    const goToRegisterLink = document.getElementById('go-to-register');
    const goToLoginLink = document.getElementById('go-to-login');

    // Formulários "Fake"
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');

    // Salva o conteúdo original do dashboard
    const originalContent = contentArea.innerHTML;

    // === NOVOS SELETORES (Para UI e Navegação) ===
    const modalUsernameGreet = document.getElementById('modal-username-greet');
    const regUsernameInput = document.getElementById('reg-username');
    const usernameValidationMsg = document.getElementById('username-validation-msg');
    const tipoContaSelect = document.getElementById('tipo-conta');
    const gestorFields = document.getElementById('gestor-fields');

    // IDs dos Links da Sidebar
    const sidebarDashboard = document.getElementById('sidebar-dashboard');
    const sidebarReports = document.getElementById('sidebar-reports');
    const sidebarTeam = document.getElementById('sidebar-team');
    const sidebarProjects = document.getElementById('sidebar-projects');
    const sidebarMessages = document.getElementById('sidebar-messages');

    // === Estado da Aplicação (Fake) ===
    let isLoggedIn = false;

    // === Funções ===
    function closeAllModals() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        profileModal.classList.remove('active');
        loginModal.classList.remove('active');
        registerModal.classList.remove('active');
    }

    function toggleSidebar() {
        if (!sidebar.classList.contains('active')) { closeAllModals(); }
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    function handleProfileClick() {
    if (!profileModal.classList.contains('active') && !loginModal.classList.contains('active')) {
        closeAllModals();
    }
    
    if (isLoggedIn) {
        profileModal.classList.toggle('active');
    } else {
        loginModal.classList.toggle('active');
    }
    
    overlay.classList.toggle('active');
    }

    function toggleTheme() {
        const currentTheme = document.body.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.body.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);

        const icon = themeToggle.querySelector('.material-symbols-outlined');
        icon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
    }

    function checkSavedTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.dataset.theme = savedTheme;

        const icon = themeToggle.querySelector('.material-symbols-outlined');
        icon.textContent = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';
    }

    // TORNANDO GLOBAL - ESSA FUNÇÃO CHAMA loadScript e passa a função de inicialização
    window.loadMainContent = async function (htmlPath, scriptPath = null, viewData = {}, initFunc = null) {
        try {
            const response = await fetch(htmlPath);

            if (!response.ok) {
                contentArea.innerHTML = `
                    <div style="padding: 20px; background-color: var(--surface-color); border-radius: var(--radius-large); margin: 20px;">
                        <h2 style="color: #ff6b6b;">ERRO DE CARREGAMENTO (404)</h2>
                        <p>O arquivo de tela não foi encontrado.</p>
                        <p>Verifique se o caminho <strong>${htmlPath}</strong> está correto.</p>
                    </div>
                `;
                throw new Error(`Falha ao carregar ${htmlPath}. Status: ${response.status}`);
            }

            let html = await response.text();
            contentArea.innerHTML = html; // HTML de team.html injetado

            if (viewData.username) {
                const homeUsernameGreet = contentArea.querySelector('.user-details h3');
                if (homeUsernameGreet) {
                    homeUsernameGreet.textContent = `Olá, ${viewData.username}!`;
                }
            }

            // 1. CHAMA A FUNÇÃO DE LOAD DO SCRIPT
            if (scriptPath) {
                // Passa a initFunc (window.initTeamModule) como callback
                loadScript(scriptPath, initFunc); 
            } else if (initFunc) {
                setTimeout(initFunc, 50); 
            }

        } catch (error) {
            console.error('Erro geral ao tentar carregar conteúdo:', error);
        }
    }

    // 2. FUNÇÃO loadScript: O CÓDIGO DE LOAD DINÂMICO
    function loadScript(scriptSrc, callback = null) {
        // Limpa o script antigo para evitar múltiplas execuções
        let oldScript = document.querySelector(`script[src^="${scriptSrc.split('?')[0]}"]`);
        if (oldScript) {
            oldScript.remove();
            console.log(`Script antigo removido: ${scriptSrc}`);
        }

        const script = document.createElement('script');
        // Adiciona um timestamp para evitar cache
        script.src = scriptSrc + `?v=${new Date().getTime()}`;
        script.defer = true;
        
        // 🚨 O PONTO CRÍTICO: Executa o callback (initTeamModule ou initNewsModule) APÓS o carregamento
        script.onload = () => {
            console.log(`Novo script carregado COMPLETAMENTE: ${scriptSrc}`);
            
            if (callback && typeof callback === 'function') {
                callback(); // <-- Executa a inicialização
            } else {
                 console.error(`Função de callback não encontrada após carregar ${scriptSrc}`);
            }
        };

        document.body.appendChild(script);
        console.log(`Tentando carregar novo script: ${scriptSrc}`);
    }

    function loadPlaceholder(title) {
        contentArea.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h2 style="color: var(--highlight-color);">${title}</h2>
                <p>Este módulo está em desenvolvimento.</p>
                <span class="material-symbols-outlined" style="font-size: 80px; margin-top: 20px;">construction</span>
            </div>
        `;
        closeAllModals();
    }

    // === Estado e Validação ===
    function setLoginState(username) {
        isLoggedIn = true;
        localStorage.setItem('username', username);
        modalUsernameGreet.textContent = `Olá, ${username}!`;
        profileBtn.querySelector('.material-symbols-outlined').textContent = 'account_circle';
        closeAllModals();
    }

    function validateUsername() {
        const username = regUsernameInput.value;
        let isValid = true;

        if (username.length <= 4) {
            usernameValidationMsg.textContent = 'Deve ter mais de 4 caracteres.';
            isValid = false;
        } else if (/[.,]/.test(username)) {
            usernameValidationMsg.textContent = 'Não pode conter pontos ou vírgulas.';
            isValid = false;
        } else {
            usernameValidationMsg.textContent = '';
        }

        if (isValid) {
            regUsernameInput.classList.remove('invalid');
            usernameValidationMsg.style.display = 'none';
        } else {
            regUsernameInput.classList.add('invalid');
            usernameValidationMsg.style.display = 'block';
        }
        return isValid;
    }

    // === Event Listeners ===
    checkSavedTheme();

    if (regUsernameInput) regUsernameInput.addEventListener('input', validateUsername);
    if (tipoContaSelect) {
        tipoContaSelect.addEventListener('change', (e) => {
            gestorFields.classList.toggle('active', e.target.value === 'gestor');
        });
    }

    menuToggle.addEventListener('click', (e) => { e.stopPropagation(); toggleSidebar(); });
    profileBtn.addEventListener('click', (e) => { e.stopPropagation(); handleProfileClick(); });
    themeToggle.addEventListener('click', toggleTheme);
    overlay.addEventListener('click', closeAllModals);

    goToRegisterLink.addEventListener('click', (e) => { e.preventDefault(); loginModal.classList.remove('active'); registerModal.classList.add('active'); });
    goToLoginLink.addEventListener('click', (e) => { e.preventDefault(); registerModal.classList.remove('active'); loginModal.classList.add('active'); });

    // 1. DASHBOARD LISTENER (HOME) - CORRIGIDO
    if (sidebarDashboard) {
        sidebarDashboard.addEventListener('click', (e) => {
            e.preventDefault();
            const username = localStorage.getItem('username');
            // MODIFICADO: Adiciona o caminho do JS e a função de inicialização
            window.loadMainContent('screens/companies/home.html', 'screens/companies/js/home.js', { username: username }, window.initNewsModule);
            closeAllModals();
        });
    }

    if (sidebarReports) {
        sidebarReports.addEventListener('click', (e) => {
            e.preventDefault();
            window.loadMainContent('screens/companies/metrics.html', 'screens/companies/js/metrics.js');
            closeAllModals();
        });
    }

    // 3. EVENT LISTENER DO TIME: PASSA O initTeamModule COMO FUNÇÃO DE CALLBACK
    if (sidebarTeam) {
        sidebarTeam.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Certifique-se que o caminho do HTML e JS estão corretos.
            window.loadMainContent(
                'screens/companies/team.html', 
                'screens/team/js/team.js', 
                {}, 
                window.initTeamModule // Função global que o loadScript irá chamar após o carregamento
            );
            
            closeAllModals(); 
        });
    }
    if (sidebarProjects) {
        sidebarProjects.addEventListener('click', (e) => {
            e.preventDefault();
            window.loadMainContent('screens/companies/projects.html', 'screens/projects/js/projects.js');
            closeAllModals(); 
        });
    }
// Exemplo de como DEVE estar no seu script.js:

if (sidebarMessages) {
    sidebarMessages.addEventListener('click', (e) => {
        e.preventDefault();
        window.loadMainContent(
            'screens/companies/messages/chatlist.html', 
            'screens/companies/messages/js/messages.js', 
            {}, 
            window.initMessagesModule // <-- ESSENCIAL: Garante que o JS correto seja chamado.
        );
        // ... outras ações (fechar menu, etc.)
    });
}
    // === Integração do Módulo de Configurações ===
    const sidebarSettingsBtn = document.getElementById('sidebar-settings-btn');

    if (sidebarSettingsBtn) {
        sidebarSettingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Navegando para Configurações...");
            
            // Carrega HTML, CSS (embutido ou linkado dinamicamente se sua função suportar) e JS
            window.loadMainContent(
                'screens/settings/settings.html',    // Caminho HTML
                'screens/settings/js/settings.js',   // Caminho JS
                {},                                  // ViewData
                window.initSettingsModule            // Função de Callback
            );

            // Injeta o CSS específico de configurações dinamicamente se necessário
            // (Se sua função loadMainContent não carrega CSS, adicione este link manualmente no head ou no settings.html)
            const cssId = 'settings-css';
            if (!document.getElementById(cssId)) {
                const head  = document.getElementsByTagName('head')[0];
                const link  = document.createElement('link');
                link.id   = cssId;
                link.rel  = 'stylesheet';
                link.type = 'text/css';
                link.href = 'screens/settings/css/settings.css';
                link.media = 'all';
                head.appendChild(link);
            }

            closeAllModals();
        });
    }

    // === Login/Logout ===
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        setLoginState(username);
        // 2. LOGIN SUBMIT - CORRIGIDO
        window.loadMainContent('screens/companies/home.html', 'screens/companies/js/home.js', { username: username }, window.initNewsModule);
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateUsername()) return;

        const username = regUsernameInput.value;
        const userType = tipoContaSelect.value;

        setLoginState(username);

        if (userType === 'gestor') {
            // 3. REGISTER SUBMIT (GESTOR) - CORRIGIDO
            window.loadMainContent('screens/companies/home.html', 'screens/companies/js/home.js', { username: username }, window.initNewsModule);
        } else {
            contentArea.innerHTML = `<div style="padding: 20px;"><h2>Dashboard (Trabalhador)</h2><p>Bem-vindo, ${username}!</p></div>`;
        }
    });

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLoggedIn = false;
        localStorage.removeItem('username');
        closeAllModals();

        profileBtn.querySelector('.material-symbols-outlined').textContent = 'person';
        modalUsernameGreet.textContent = 'Olá, Usuário!';

        contentArea.innerHTML = originalContent;
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // === VERIFICAÇÃO INICIAL === - CORRIGIDO
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        setLoginState(savedUsername);
        // 4. VERIFICAÇÃO INICIAL - CORRIGIDO
        window.loadMainContent('screens/companies/home.html', 'screens/companies/js/home.js', { username: savedUsername }, window.initNewsModule);
    }
});

// Outras funções (setupGoToProfileButton, animações)
document.addEventListener("DOMContentLoaded", () => {
    function setupGoToProfileButton() {
        const goToProfileBtn = document.getElementById('go-to-profile');

        if (goToProfileBtn) {
            goToProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();

                const username = localStorage.getItem('username') || 'Usuário';
                console.log('➡️ Clicou em Ver perfil completo:', username);

                // Fechamento de modais (simplificado para o escopo)
                const closeFunc = document.querySelector('.overlay')?.classList.contains('active') ? 
                                () => { 
                                    document.getElementById('sidebar')?.classList.remove('active');
                                    document.querySelector('.overlay')?.classList.remove('active');
                                    document.getElementById('profile-modal')?.classList.remove('active');
                                    document.getElementById('login-modal')?.classList.remove('active');
                                    document.getElementById('register-modal')?.classList.remove('active');
                                } : null;
                if (closeFunc) closeFunc();

                // Carrega a tela de perfil
                if (typeof window.loadMainContent === 'function') {
                    window.loadMainContent(
                        'accounts/profile.html',
                        'screens/profile/js/profile.js',
                        { username: username }
                    );
                } else {
                    console.error('❌ Função window.loadMainContent() não encontrada.');
                }
            });

            console.log("✅ Botão 'Ver perfil completo' configurado com sucesso.");
        } 
    }

    setupGoToProfileButton();

    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (document.getElementById('go-to-profile')) {
                    setupGoToProfileButton();
                    observer.disconnect(); 
                    return;
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});
function checkSavedTheme() {
    const savedThemeId = localStorage.getItem('theme_id') || 'dark';
    const root = document.documentElement;
    
    // Simulação de aplicação de tema (em um app real, você teria que carregar as cores do tema selecionado)
    // Como o settings.js faz o trabalho pesado, aqui só garantimos que o data-theme esteja correto.
    // Assumindo que temas com 'light' no nome são light. Isso será substituído pela lógica completa do settings.js.
    const isLight = savedThemeId.includes('light');
    document.body.setAttribute('data-theme', isLight ? 'light' : 'dark');
    
    // Nota: O CSS Global em styles.css cuida das cores iniciais. O settings.js as sobrescreve.
    // Esta função é executada no load da SPA e deve garantir as cores iniciais corretas.
}

// NOVO: Função para aplicar o Modo Leve Globalmente ao iniciar o app
function applyGlobalLightMode() {
    const isNoAnimation = localStorage.getItem('no_animation_mode') === 'true';
    if (isNoAnimation) {
        document.body.classList.add('no-animation');
    } else {
        document.body.classList.remove('no-animation');
    }
    // Se a função existir em settings.js, chamá-la. Senão, esta já resolve a classe no body.
    if (window.toggleLightModeAnimation) {
         window.toggleLightModeAnimation(isNoAnimation);
    }
}

// --- Inicialização de Event Listeners ---

// ... Event listeners existentes ...

// Inicialização
checkSavedTheme();
applyGlobalLightMode(); // NOVO: Aplica o modo leve ao carregar a página
setAuthStatus(isAuthenticated);
;

// Cria partículas neon flutuantes
document.addEventListener("DOMContentLoaded", () => {
    const bgContainer = document.querySelector('.background-animation');
    const particleCount = 80;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const span = document.createElement('span');
        span.style.left = Math.random() * 100 + 'vw';
        span.style.top = Math.random() * 100 + 'vh';
        span.style.width = span.style.height = (Math.random() * 3 + 1) + 'px';
        span.dataset.speed = (Math.random() * 0.5 + 0.1).toFixed(2);
        bgContainer.appendChild(span);
        particles.push(span);
    }

    function animateParticles() {
        particles.forEach(p => {
            let top = parseFloat(p.style.top);
            let speed = parseFloat(p.dataset.speed);
            top -= speed;
            if (top < -5) top = 100;
            p.style.top = top + 'vh';
        });
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
});
