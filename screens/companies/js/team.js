// screens/team/js/team.js

(function initTeamModule() {
    console.log("Módulo Equipe Carregado (Modo Seguro).");

    // --- DADOS DA EQUIPE ---
    const teamData = [
        { id: 1, name: "Lucas Silva", role: "Frontend Dev", email: "lucas@zonkai.com", time: "09:00 - 18:00", status: "online", initials: "LS" },
        { id: 2, name: "Fernanda Costa", role: "Product Manager", email: "fernanda@zonkai.com", time: "10:00 - 19:00", status: "meeting", initials: "FC" },
        { id: 3, name: "João Pereira", role: "UI/UX Designer", email: "joao@zonkai.com", time: "08:00 - 17:00", status: "offline", initials: "JP" },
        { id: 4, name: "Amanda Oliveira", role: "Tech Lead", email: "amanda@zonkai.com", time: "09:00 - 18:00", status: "online", initials: "AO" },
        { id: 5, name: "Roberto Campos", role: "DevOps", email: "roberto@zonkai.com", time: "12:00 - 21:00", status: "online", initials: "RC" },
        { id: 6, name: "Juliana Mendes", role: "Marketing", email: "juliana@zonkai.com", time: "09:00 - 18:00", status: "offline", initials: "JM" }
    ];

    // --- SELETORES ---
    // Selecionamos APENAS a grid e os inputs. Não tocamos no header.
    const gridContainer = document.getElementById('dynamic-team-grid');
    const searchInput = document.getElementById('team-search-input');
    const statusSelect = document.getElementById('team-status-filter');

    // --- RENDERIZAÇÃO ---
    function renderMembers(list) {
        if (!gridContainer) return;

        // Limpa APENAS a área dos cards, mantendo o resto da página intacto
        gridContainer.innerHTML = '';

        if (list.length === 0) {
            gridContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhum membro encontrado</h3>
                    <p>Tente ajustar os filtros de busca.</p>
                </div>
            `;
            return;
        }

        list.forEach(member => {
            // Cria o card
            const card = document.createElement('div');
            card.className = 'member-card';

            // Define classe visual do status
            let statusClass = 'st-offline';
            if (member.status === 'online') statusClass = 'st-online';
            if (member.status === 'meeting') statusClass = 'st-meeting';

            card.innerHTML = `
                <div class="avatar-box">
                    <div class="avatar-circle">${member.initials}</div>
                    <div class="status-indicator ${statusClass}" title="${member.status}"></div>
                </div>
                
                <h3 class="member-name">${member.name}</h3>
                <span class="member-role">${member.role}</span>
                
                <div class="info-block">
                    <div class="info-line">Email: <span>${member.email.split('@')[0]}...</span></div>
                    <div class="info-line">Horário: <span>${member.time}</span></div>
                </div>

                <div class="action-buttons">
                    <button class="btn-small">
                        <span class="material-symbols-outlined">chat</span> Msg
                    </button>
                    <button class="btn-small">
                        <span class="material-symbols-outlined">person</span> Perfil
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

        const filtered = teamData.filter(m => {
            const matchText = m.name.toLowerCase().includes(text) || m.role.toLowerCase().includes(text);
            const matchStatus = status === 'all' || m.status === status;
            return matchText && matchStatus;
        });

        renderMembers(filtered);
    }

    // --- EVENTOS ---
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (statusSelect) statusSelect.addEventListener('change', applyFilters);

    // Inicializa
    renderMembers(teamData);

})();