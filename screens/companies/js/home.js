console.log("📰 Portal de Notícias (Home) Carregado.");

// === 1. DADOS MOCKADOS (Notícias com LINKS REAIS) ===
const mockNews = [
    {
        title: "Ibovespa supera 160 mil pontos puxado pelo varejo",
        description: "Índice caminha para encerrar a semana com ganho superior a 1%, impulsionado pelo recuo dos juros futuros.",
        image: "https://img.freepik.com/vetores-premium/um-grafico-com-o-grafico-mostrando-o-grafico_1161840-6267.jpg",
        category: "finance",
        source: "Times Brasil",
        time: "11 horas atrás",
        url: "https://timesbrasil.com.br/investimentos/bolsa/ibovespa-b3-passa-dos-160-mil-pontos-consumo-e-varejo-puxam-altas/",
        isHero: true,
        isWeeklyHighlight: false
    },
    {
        title: "Gestão com IA Generativa: Vantagem Estratégica",
        description: "Estudo detalha como executivos estão usando IA para renovar modelos de negócios e equilibrar ações de curto e longo prazo.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop",
        category: "business",
        source: "Taylor & Francis",
        time: "Recente",
        url: "https://www.tandfonline.com/doi/full/10.1080/08956308.2025.2497687",
        isHero: false,
        isWeeklyHighlight: false
    },
    {
        title: "DREX em 2025: Tudo sobre a moeda digital brasileira",
        description: "Banco Central expande piloto com novas funcionalidades e foco em inclusão financeira e contratos inteligentes.",
        image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=1000&auto=format&fit=crop",
        category: "finance",
        source: "TecBan Blog",
        time: "Ontem",
        url: "https://www.tecban.com.br/blog/drex-em-2025-saiba-tudo-sobre-a-moeda-digital-brasileira",
        isHero: false,
        isWeeklyHighlight: false
    },
    {
        title: "Blockchain reduz desperdício na cadeia de suprimentos",
        description: "Tecnologia cria cadeias transparentes, reduzindo emissões e validando práticas sustentáveis.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop",
        category: "tech",
        source: "Impactful Ninja",
        time: "9 dias atrás",
        url: "https://impactful.ninja/blockchain-technology-cuts-supply-chain-waste-verifies-green-claims/",
        isHero: false,
        isWeeklyHighlight: false
    },
    {
        title: "Liderança Ágil para Equipes Remotas e Híbridas",
        description: "Guia completo sobre como criar cultura de confiança e adaptação em ambientes de trabalho modernos.",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop",
        category: "business",
        source: "The Collective",
        time: "Artigo",
        url: "https://www.jointhecollective.com/article/agile-leadership-in-remote-and-hybrid-teams/",
        isHero: false,
        isWeeklyHighlight: true
    },
    {
        title: "Reforma Tributária 2025: Impacto nos Pequenos Negócios",
        description: "Entenda o que muda na rotina de quem empreende e como se preparar para as novas regras fiscais.",
        image: "https://images.unsplash.com/photo-1521791136064-7798c676af16?q=80&w=1000&auto=format&fit=crop",
        category: "finance",
        source: "Sebrae",
        time: "Atualizado",
        url: "https://sebrae.com.br/sites/PortalSebrae/ufs/pe/artigos/reforma-tributaria-2025-o-que-pequenos-negocios-precisam-saber,6d772d5ec7b37910VgnVCM1000001b00320aRCRD",
        isHero: false,
        isWeeklyHighlight: true
    },
    {
        title: "Adoção Institucional de Criptoativos em 2025",
        description: "Relatório aponta crescimento de 50% na atividade cripto nos EUA e expansão de ETFs de Bitcoin.",
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000&auto=format&fit=crop",
        category: "tech",
        source: "Powerdrill Bloom",
        time: "56 dias atrás",
        url: "https://powerdrill.ai/blog/institutional-cryptocurrency-adoption",
        isHero: false,
        isWeeklyHighlight: true
    }
];

// === 1.1 VÍDEOS ===
const mockVideos = [
    {
        title: "Gestão Empresarial - CURSO COMPLETO",
        duration: "02:21",
        author: "Mauricio Chiecco",
        thumbnail: "https://img.youtube.com/vi/Yp1rht8qHsk/maxresdefault.jpg",
        views: "27k visualizações",
        url: "https://youtu.be/Yp1rht8qHsk"
    },
    {
        title: "10 dicas INFALÍVEIS para a GESTÃO FINANCEIRA de um pequeno negócio!",
        duration: "02:13:27",
        author: "Programa Alavancar",
        thumbnail: "https://img.youtube.com/vi/cwWusUqgtVng-zLW/maxresdefault.jpg",
        views: "20k visualizações",
        url: "https://youtu.be/69l-iaw_Vz0?si=cwWusUqgtVng-zLW"
    },
    {
        title: "O que é Gestão Empresarial",
        duration: "20:06",
        author: "Jevandro Barros",
        thumbnail: "https://img.youtube.com/vi/gSgh4S0F2hw/maxresdefault.jpg",
        views: "36k visualizações",
        url: "https://youtu.be/gSgh4S0F2hw"
    },
    {
        title: "O que é gestão de projetos?",
        duration: "08:05",
        author: "Mario Trentim",
        thumbnail: "https://img.youtube.com/vi/cXSYwFongFU/maxresdefault.jpg",
        views: "145k visualizações",
        url: "https://youtu.be/cXSYwFongFU"
    }
];

// === 1.2 CURSOS DE GESTÃO (Novos) ===
const mockCourses = [
    {
        title: "Liderança e Gestão de Equipes",
        provider: "Escola Virtual Gov",
        level: "Iniciante",
        duration: "30h",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop",
        url: "https://www.escolavirtual.gov.br/curso/373"
    },
    {
        title: "Gestão Financeira para PMEs",
        provider: "Sebrae",
        level: "Intermediário",
        duration: "10h",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
        url: "https://sebrae.com.br/sites/PortalSebrae/cursosonline/gestao-financeira,e059d743ad3a8910VgnVCM1000001b00320aRCRD"
    },
    {
        title: "Gestão Ágil para Transformação Digital",
        provider: "Enap",
        level: "Avançado",
        duration: "175h",
        image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1000&auto=format&fit=crop",
        url: "https://www.escolavirtual.gov.br/programa/77"
    },
    {
        title: "Leadership & Management",
        provider: "Harvard Business School",
        level: "Executivo",
        duration: "4 semanas",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
        url: "https://online.hbs.edu/subjects/leadership-management/"
    }
];

// === 2. LÓGICA DE RENDERIZAÇÃO ===

function renderVideos() {
    const videoContainer = document.getElementById('video-grid');
    if(!videoContainer) return;

    videoContainer.innerHTML = '';
    
    mockVideos.forEach(video => {
        videoContainer.innerHTML += `
            <div class="video-card" onclick="window.open('${video.url}', '_blank')">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="play-overlay">
                        <span class="material-symbols-outlined">play_circle</span>
                    </div>
                    <span class="video-duration">${video.duration}</span>
                </div>
                <div class="video-info">
                    <h4>${video.title}</h4>
                    <p class="video-meta">${video.author} • ${video.views}</p>
                </div>
            </div>
        `;
    });
}

function renderCourses() {
    const courseContainer = document.getElementById('courses-grid');
    if(!courseContainer) return;

    courseContainer.innerHTML = '';
    
    mockCourses.forEach(course => {
        courseContainer.innerHTML += `
            <div class="course-card" onclick="window.open('${course.url}', '_blank')">
                <div class="course-img-box">
                    <img src="${course.image}" alt="${course.title}">
                    <span class="course-provider">${course.provider}</span>
                </div>
                <div class="course-content">
                    <h4>${course.title}</h4>
                    <div class="course-badges">
                        <span class="badge">${course.level}</span>
                        <span class="badge time"><span class="material-symbols-outlined">schedule</span> ${course.duration}</span>
                    </div>
                    <button class="course-btn">Acessar Curso</button>
                </div>
            </div>
        `;
    });
}

function renderNews(filter = 'all') {
    const heroContainer = document.getElementById('hero-article');
    const trendingContainer = document.getElementById('trending-list');
    const highlightsContainer = document.getElementById('weekly-highlights-grid');
    const bottomGrid = document.getElementById('bottom-grid');
    const loader = document.getElementById('news-loader');
    const content = document.getElementById('news-content');

    if (!heroContainer || !trendingContainer || !bottomGrid || !highlightsContainer) {
        console.error("ERRO: Elementos do Dashboard (Notícias) não encontrados no DOM.");
        return;
    }

    loader.style.display = 'flex';
    content.style.opacity = '0.5';

    let filteredNews = filter === 'all' 
        ? mockNews 
        : mockNews.filter(n => n.category === filter);

    if (filteredNews.length === 0) filteredNews = mockNews;

    setTimeout(() => {
        heroContainer.innerHTML = '';
        trendingContainer.innerHTML = '';
        highlightsContainer.innerHTML = '';
        bottomGrid.innerHTML = '';

        const heroNews = filteredNews.find(n => n.isHero) || filteredNews[0];
        const nonHeroNews = filteredNews.filter(n => n !== heroNews);
        const highlights = nonHeroNews.filter(n => n.isWeeklyHighlight).slice(0, 4);
        const otherNews = nonHeroNews.filter(n => !n.isWeeklyHighlight);

        // 1. Renderiza HERO (Com Link Real)
        heroContainer.innerHTML = `
            <div onclick="window.open('${heroNews.url}', '_blank')" style="height: 100%; width: 100%;">
                <img src="${heroNews.image}" alt="${heroNews.title}" class="hero-img">
                <div class="hero-overlay">
                    <span class="news-tag">${getCategoryName(heroNews.category)}</span>
                    <h2 class="hero-title">${heroNews.title}</h2>
                    <p class="hero-desc">${heroNews.description}</p>
                </div>
            </div>
        `;

        // 2. Renderiza TRENDING
        const trendingNews = otherNews.slice(0, 3);
        trendingNews.forEach(news => {
            trendingContainer.innerHTML += `
                <div class="trend-item" onclick="window.open('${news.url}', '_blank')">
                    <div class="trend-content">
                        <h5>${news.title}</h5>
                        <div class="trend-meta">
                            <span class="material-symbols-outlined" style="font-size: 14px;">schedule</span>
                            ${news.time} • ${news.source}
                        </div>
                    </div>
                </div>
            `;
        });

        // 3. Renderiza DESTAQUES
        if (highlights.length > 0) {
            highlights.forEach(news => {
                highlightsContainer.innerHTML += `
                    <div class="highlight-card" onclick="window.open('${news.url}', '_blank')">
                        <h4>${news.title}</h4>
                        <p>${news.description.substring(0, 100)}...</p>
                        <div class="highlight-meta">
                            ${news.source} | ${news.time}
                        </div>
                    </div>
                `;
            });
        }

        // 4. Renderiza GRID INFERIOR
        const displayGrid = otherNews.slice(3);
        displayGrid.forEach(news => {
            bottomGrid.innerHTML += `
                <div class="news-card-small" onclick="window.open('${news.url}', '_blank')">
                    <div class="small-img-container">
                        <img src="${news.image}" alt="${news.title}" class="small-img">
                    </div>
                    <div class="small-content">
                        <h4>${news.title}</h4>
                        <p>${news.description.substring(0, 80)}...</p>
                        <span class="read-more">Ler matéria</span>
                    </div>
                </div>
            `;
        });

        loader.style.display = 'none';
        content.style.opacity = '1';

    }, 600);
}

function getCategoryName(cat) {
    const map = { 'tech': 'Tecnologia', 'finance': 'Finanças', 'business': 'Negócios' };
    return map[cat] || 'Geral';
}

function setDate() {
    const dateEl = document.getElementById('current-date');
    if(dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.innerText = new Date().toLocaleDateString('pt-BR', options);
    }
}

window.initNewsModule = function() {
    console.log("🚀 Inicializando Módulo Home/Notícias/Cursos.");
    setDate();
    renderNews('all');
    renderVideos();
    renderCourses(); // Renderiza Cursos

    const tabs = document.querySelectorAll('.category-chip');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderNews(tab.getAttribute('data-category'));
        });
    });
}
