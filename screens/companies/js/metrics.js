// screens/companies/js/metrics.js

(function initMetricsPage() {
    console.log("Iniciando módulo Metrics (SPA)...");

    // DETECÇÃO DE TEMA
    const currentTheme = document.body.dataset.theme || 'dark';
    const isDark = currentTheme === 'dark';

    // CONFIGURAÇÃO DE CORES BASEADA NO TEMA
    const chartConfig = {
        textColor: isDark ? '#A9A9B3' : '#415a77', // var(--text-secondary)
        gridColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        tooltipBg: isDark ? '#1b263b' : '#ffffff',
        tooltipColor: isDark ? '#f0f4f8' : '#0d1b2a',
        themeMode: isDark ? 'dark' : 'light'
    };

    // 1. Inicializar Gráficos com config do tema
    initRevenueChart(chartConfig);
    initCategoryChart(chartConfig);
    
    // 2. Animar Números dos KPIs
    animateValue("kpi-revenue", 0, 128450, 2000, true);
    animateValue("kpi-profit", 0, 42300, 2000, true);
    animateValue("kpi-clients", 0, 154, 1500, false);
    animateValue("kpi-ticket", 0, 834, 1500, true);

    // 3. Carregar Tabela
    loadTransactions();

    // 4. Lógica dos Botões de Filtro
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filters.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            console.log(`Filtrando por: ${e.target.dataset.period} dias`);
        });
    });

    /* --- Funções Locais --- */
    
    function initRevenueChart(config) {
        const chartElement = document.querySelector("#revenueChart");
        if (!chartElement) return;

        const options = {
            series: [{
                name: 'Receita',
                data: [31000, 40000, 28000, 51000, 42000, 109000, 100000]
            }, {
                name: 'Despesas',
                data: [11000, 32000, 45000, 32000, 34000, 52000, 41000]
            }],
            chart: {
                height: 350,
                type: 'area',
                toolbar: { show: false },
                fontFamily: 'Inter, sans-serif',
                background: 'transparent',
                // Força redim em troca de tema se a janela mudar
                redrawOnParentResize: true
            },
            // Cores principais (Ciano e Vermelho) mantidas, funcionam bem nos dois temas
            colors: ['#00F9FF', '#ff5252'], 
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 2 },
            xaxis: {
                categories: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
                labels: { style: { colors: config.textColor } }, // Cor adaptativa
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: {
                labels: { 
                    style: { colors: config.textColor }, // Cor adaptativa
                    formatter: (value) => { return "R$ " + (value / 1000).toFixed(0) + "k" }
                }
            },
            grid: {
                borderColor: config.gridColor, // Grade adaptativa
                strokeDashArray: 4,
            },
            theme: { mode: config.themeMode }, // Modo do ApexCharts
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.1,
                    stops: [0, 90, 100]
                }
            },
            legend: { 
                position: 'top', 
                horizontalAlign: 'right',
                labels: { colors: config.textColor } // Legenda adaptativa
            },
            tooltip: {
                theme: config.themeMode,
                style: {
                    fontSize: '12px',
                    fontFamily: undefined
                },
                marker: { show: true },
            }
        };

        const chart = new ApexCharts(chartElement, options);
        chart.render();
    }

    function initCategoryChart(config) {
        const chartElement = document.querySelector("#categoryChart");
        if (!chartElement) return;

        const options = {
            series: [44, 55, 13, 33],
            labels: ['Serviços', 'Produtos', 'Consultoria', 'Outros'],
            chart: {
                type: 'donut',
                height: 350,
                background: 'transparent'
            },
            colors: ['#00F9FF', '#0066FF', '#7B00FF', '#FF00E6'],
            plotOptions: {
                pie: {
                    donut: {
                        size: '70%',
                        labels: {
                            show: true,
                            name: { show: true, color: config.textColor }, // Adaptativo
                            value: { 
                                show: true, 
                                color: isDark ? '#00F9FF' : '#0056b3', // Cor do valor adapta ao destaque
                                fontSize: '22px', 
                                fontWeight: 'bold' 
                            },
                            total: { 
                                show: true, 
                                color: config.textColor, // Adaptativo
                                label: 'Total',
                                formatter: function (w) {
                                    return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                                }
                            }
                        }
                    }
                }
            },
            // A borda do gráfico deve combinar com o fundo do card
            stroke: { 
                show: true, 
                colors: [isDark ? '#1b263b' : '#ffffff'], 
                width: 2 
            },
            dataLabels: { enabled: false },
            legend: { 
                position: 'bottom', 
                labels: { colors: config.textColor } // Adaptativo
            },
            theme: { mode: config.themeMode }
        };

        const chart = new ApexCharts(chartElement, options);
        chart.render();
    }

    function animateValue(id, start, end, duration, isCurrency) {
        const obj = document.getElementById(id);
        if(!obj) return;
        
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            let current = Math.floor(progress * (end - start) + start);
            
            if (isCurrency) {
                obj.innerHTML = current.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            } else {
                obj.innerHTML = current;
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function loadTransactions() {
        const tbody = document.getElementById('transaction-body');
        if(!tbody) return;

        const data = [
            { id: '#TRX-9841', desc: 'Pagamento Serviço Web', date: '27 Nov, 2025', status: 'completed', value: 'R$ 4.500,00' },
            { id: '#TRX-9842', desc: 'Renovação Hospedagem', date: '26 Nov, 2025', status: 'pending', value: 'R$ 250,00' },
            { id: '#TRX-9843', desc: 'Consultoria UI/UX', date: '26 Nov, 2025', status: 'completed', value: 'R$ 1.200,00' },
            { id: '#TRX-9844', desc: 'Estorno Cliente A', date: '25 Nov, 2025', status: 'canceled', value: 'R$ -150,00' },
            { id: '#TRX-9845', desc: 'Venda Plano Anual', date: '24 Nov, 2025', status: 'completed', value: 'R$ 12.000,00' },
        ];

        tbody.innerHTML = data.map(item => `
            <tr>
                <td><span style="color: var(--highlight-color); font-weight: bold;">${item.id}</span></td>
                <td>${item.desc}</td>
                <td>${item.date}</td>
                <td><span class="status-badge status-${item.status}">${translateStatus(item.status)}</span></td>
                <td><strong>${item.value}</strong></td>
            </tr>
        `).join('');
    }

    function translateStatus(status) {
        const map = {
            'completed': 'Concluído',
            'pending': 'Pendente',
            'canceled': 'Cancelado'
        };
        return map[status] || status;
    }
})();