// screens/projects/js/projects.js

(function initProjectsModule() {
    console.log("Módulo Projetos Carregado.");

    // --- DADOS DOS PROJETOS (MOCK) ---
    const projectsData = [
        { 
            id: 101, 
            title: "Redesign E-commerce ZonKai", 
            client: "ZonKai Internal", 
            deadline: "15 Dez, 2025", 
            status: "in-progress", 
            progress: 65, 
            team: ["LS", "FC", "JP"] 
        },
        { 
            id: 102, 
            title: "App Mobile Financeiro", 
            client: "Banco Alpha", 
            deadline: "20 Nov, 2025", 
            status: "delayed", 
            progress: 80, 
            team: ["AO", "RC"] 
        },
        { 
            id: 103, 
            title: "Campanha Marketing Q4", 
            client: "Retail Corp", 
            deadline: "30 Nov, 2025", 
            status: "completed", 
            progress: 100, 
            team: ["JM", "JP"] 
        },
        { 
            id: 104, 
            title: "Migração de Servidores", 
            client: "TechSolutions", 
            deadline: "10 Jan, 2026", 
            status: "review", 
            progress: 90, 
            team: ["RC", "LS", "AO", "FC"] 
        },
        { 
            id: 105, 
            title: "Identidade Visual Startup", 
            client: "GreenEnergy", 
            deadline: "05 Dez, 2025", 
            status: "in-progress", 
            progress: 25, 
            team: ["JP", "JM"] 
        }
    ];

    // --- SELETORES ---
    const gridContainer = document.getElementById('dynamic-projects-grid');
    const searchInput = document.getElementById('project-search-input');
    const statusSelect = document.getElementById('project-status-filter');

    // --- AUXILIARES ---
    function getStatusLabel(status) {
        const map = {
            'in-progress': 'Em Andamento',
            'delayed': 'Atrasado',
            'completed': 'Concluído',
            'review': 'Em Revisão'
        };
        return map[status] || status;
    }

    function getStatusClass(status) {
        return `bg-${status}`;
    }

    function getProgressColor(status) {
        if(status === 'delayed') return '#ff5252';
        if(status === 'completed') return '#00e676';
        if(status === 'review') return '#ffb300';
        return 'var(--highlight-color)'; // Padrão
    }

    // --- RENDERIZAÇÃO ---
    function renderProjects(list) {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';

        if (list.length === 0) {
            gridContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhum projeto encontrado</h3>
                    <p>Verifique os filtros ou inicie um novo projeto.</p>
                </div>
            `;
            return;
        }

        list.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            // Gera HTML dos avatares
            const avatarsHtml = proj.team.map(initial => 
                `<div class="mini-avatar" title="Membro">${initial}</div>`
            ).join('');

            // Cor da barra baseada no status
            const progressColor = getProgressColor(proj.status);

            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <div class="project-title">${proj.title}</div>
                        <div class="client-name">
                            <span class="material-symbols-outlined" style="font-size:16px">business</span>
                            ${proj.client}
                        </div>
                    </div>
                    <span class="status-badge ${getStatusClass(proj.status)}">${getStatusLabel(proj.status)}</span>
                </div>

                <div class="card-body">
                    <div class="meta-info">
                        <div>
                            <span class="meta-label">Prazo Final</span>
                            ${proj.deadline}
                        </div>
                        <div style="text-align: right;">
                            <span class="meta-label">ID</span>
                            #${proj.id}
                        </div>
                    </div>

                    <div class="progress-container">
                        <div class="progress-header">
                            <span>Progresso</span>
                            <span>${proj.progress}%</span>
                        </div>
                        <div class="progress-track">
                            <div class="progress-fill" style="width: ${proj.progress}%; background: ${progressColor}"></div>
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <div class="team-avatars">
                        ${avatarsHtml}
                    </div>
                    <button class="btn-options">
                        <span class="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
            `;
            gridContainer.appendChild(card);
        });
    }

    // --- FILTROS ---
    function applyFilters() {
        const text = searchInput.value.toLowerCase();
        const status = statusSelect.value;

        const filtered = projectsData.filter(p => {
            const matchText = p.title.toLowerCase().includes(text) || 
                              p.client.toLowerCase().includes(text) ||
                              p.team.some(t => t.toLowerCase().includes(text)); // Busca por sigla da equipe
            const matchStatus = status === 'all' || p.status === status;
            
            return matchText && matchStatus;
        });

        renderProjects(filtered);
    }

    // --- EVENTOS ---
    if(searchInput) searchInput.addEventListener('input', applyFilters);
    if(statusSelect) statusSelect.addEventListener('change', applyFilters);

    // Inicializa
    renderProjects(projectsData);

})();