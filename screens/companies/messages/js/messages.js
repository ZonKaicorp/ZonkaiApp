// messages.js - Lógica principal do módulo de mensagens (Chat com a Lumie IA)

// Importações do Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Variáveis Globais ---
let db;
let auth;
let currentUserId = null;
let isAuthReady = false;
let isTyping = false;
let unsubscribeSnapshot = null; // Para gerenciar o listener em tempo real do Firestore

// Configurações do ambiente fornecidas pelo Canvas
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Referência ao container principal para carregar views (do seu script.js)
const contentArea = document.getElementById('main-content');

// --- Funções Auxiliares do Firebase ---

/**
 * Configura a autenticação do Firebase usando token personalizado ou anônimo.
 */
async function setupFirebaseAuth() {
    if (Object.keys(firebaseConfig).length === 0) {
        console.warn("Configuração do Firebase não fornecida. Persistência de dados desativada.");
        isAuthReady = true; // Permite que a UI carregue mesmo sem persistência
        return;
    }
    
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    if (initialAuthToken) {
        try {
            await signInWithCustomToken(auth, initialAuthToken);
        } catch (error) {
            console.error("Erro ao fazer login com token personalizado:", error);
            await signInAnonymously(auth);
        }
    } else {
        await signInAnonymously(auth);
    }

    onAuthStateChanged(auth, (user) => {
        currentUserId = user ? user.uid : null;
        isAuthReady = true;
        console.log("Status de Autenticação:", currentUserId ? `Usuário: ${currentUserId}` : "Anônimo");
        
        // Se já estiver na tela de conversa, carrega as mensagens
        if (document.getElementById('chat-history') && currentUserId) {
            loadMessagesFromFirestore();
        }
    });
}

/**
 * Obtém a referência da coleção de mensagens para o usuário atual.
 */
function getMessagesCollectionRef() {
    if (!currentUserId || !db) return null;
    // Caminho: /artifacts/{appId}/users/{userId}/messages
    const path = `artifacts/${appId}/users/${currentUserId}/messages`;
    return collection(db, path);
}

/**
 * Salva uma mensagem no Firestore.
 * @param {string} text - O conteúdo da mensagem.
 * @param {'user'|'lumie'} sender - O remetente ('user' ou 'lumie').
 */
async function saveMessageToFirestore(text, sender) {
    const ref = getMessagesCollectionRef();
    if (!ref) {
        console.error("Tentativa de salvar mensagem sem ref do Firestore. Auth não concluída.");
        return;
    }

    try {
        await addDoc(ref, {
            text: text,
            sender: sender,
            timestamp: serverTimestamp(),
            userId: currentUserId 
        });
    } catch (error) {
        console.error("Erro ao salvar mensagem no Firestore:", error);
    }
}

// --- Funções Auxiliares de UI ---

/**
 * Formata o timestamp para HH:MM.
 * @param {Date} date - O objeto Date ou Timestamp.
 * @returns {string} Hora formatada.
 */
function formatTime(date) {
    if (!date || isNaN(date.getTime())) return "XX:XX"; 
    const h = String(date.getHours()).padStart(2,'0');
    const m = String(date.getMinutes()).padStart(2,'0');
    return `${h}:${m}`;
}

/**
 * Cria e insere uma bolha de mensagem no DOM.
 * @param {string} text - Conteúdo da mensagem.
 * @param {'user'|'lumie'} sender - Quem enviou.
 * @param {Date} timestamp - Hora da mensagem.
 */
function addMessageToDom(text, sender, timestamp = new Date()) {
    const chatHistory = document.getElementById('chat-history');
    if (!chatHistory) return;
    
    // Verifica se a mensagem já existe (previne duplicação do onSnapshot)
    // Uma forma simples é verificar se o texto e a hora são idênticos em uma mensagem recente
    const existingMessages = chatHistory.querySelectorAll('.chat-bubble');
    const timeStr = formatTime(timestamp);

    for (const msg of Array.from(existingMessages)) {
        const msgText = msg.querySelector('.bubble-text')?.textContent.trim();
        const msgTime = msg.querySelector('.msg-time')?.textContent.trim();
        if (msgText === text && msgTime === timeStr) {
            return; // Já existe, não adiciona
        }
    }

    const bubble = document.createElement('div');
    const typeClass = sender === 'user' ? 'sent' : 'received';
    
    // Estrutura do chatconversation.html
    bubble.className = `chat-bubble ${typeClass}`;
    bubble.innerHTML = `
        <div class="bubble-content">
            <div class="bubble-text">${text}</div>
            <div class="bubble-meta"><span class="msg-time">${timeStr}</span></div>
        </div>
    `;

    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        // Insere a mensagem ANTES do indicador de digitação (se ele existir)
        chatHistory.insertBefore(bubble, typingIndicator);
    } else {
        // Adiciona ao final
        chatHistory.appendChild(bubble);
    }

    // Garante o scroll para o final
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

/**
 * Mostra ou esconde o indicador de digitação da Lumie.
 * @param {boolean} show - True para mostrar, False para esconder.
 */
function showTyping(show) {
    const typingIndicator = document.getElementById('typing-indicator');
    const chatHistory = document.getElementById('chat-history');
    if (typingIndicator) {
        typingIndicator.style.display = show ? 'flex' : 'none';
        typingIndicator.setAttribute('aria-hidden', show ? 'false' : 'true');
        if (show && chatHistory) {
             chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll para ver o indicador
        }
    }
}

// --- Funções de Navegação e Carregamento de Views ---

/**
 * Carrega a view da Lista de Chats (chatlist.html).
 */
async function loadChatList() {
    if (!contentArea) return;
    try {
        const response = await fetch('screens/companies/messages/chatlist.html');
        if (!response.ok) throw new Error('Falha ao carregar lista de chats.');
        const html = await response.text();
        contentArea.innerHTML = html;
        initializeMessages(); // Reinicializa para anexar eventos à nova view
    } catch (error) {
        console.error("Erro ao carregar a lista de chats:", error);
    }
}

/**
 * Carrega a view da Conversa (chatconversation.html) e inicia o carregamento do Firestore.
 */
async function loadConversation() {
    if (!contentArea) return;
    try {
        // Desliga o listener anterior se houver
        if (unsubscribeSnapshot) {
            unsubscribeSnapshot();
            unsubscribeSnapshot = null;
        }

        const response = await fetch('screens/companies/messages/chatconversation.html');
        if (!response.ok) throw new Error('Falha ao carregar conversa.');
        const html = await response.text();
        contentArea.innerHTML = html;
        initializeMessages(); // Reinicializa para anexar eventos à nova view

        // Inicia o carregamento das mensagens após a view ser carregada E a autenticação estar pronta
        if (db && isAuthReady && currentUserId) {
            loadMessagesFromFirestore();
        } else if (db && !isAuthReady) {
             // A autenticação será concluída pelo listener onAuthStateChanged, que chamará loadMessagesFromFirestore()
        }
    } catch (error) {
        console.error("Erro ao carregar a conversa:", error);
    }
}


/**
 * Carrega e ouve mensagens do Firestore em tempo real.
 */
function loadMessagesFromFirestore() {
    const chatHistory = document.getElementById('chat-history');
    const ref = getMessagesCollectionRef();
    if (!ref || !chatHistory || !isAuthReady) {
        console.warn("Não foi possível carregar mensagens: Auth não concluída.");
        return;
    }

    // Desliga o listener anterior para evitar duplicação ou vazamento
    if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
    }
    
    // Limpa o container para a nova renderização
    chatHistory.innerHTML = '';
    
    // Adiciona o indicador de volta (ele é parte do HTML da conversa e precisa ser dinamicamente inserido)
    const typingIndicatorHTML = `<div class="chat-bubble typing" id="typing-indicator" aria-hidden="true"><span></span><span></span><span></span></div>`;
    chatHistory.insertAdjacentHTML('beforeend', typingIndicatorHTML);
    showTyping(isTyping); // Mantém o estado de digitação se a tela for recarregada

    const q = query(ref, orderBy('timestamp', 'asc'), limit(50));

    // Configura o novo listener em tempo real
    unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        // Mapeia todas as mensagens e renderiza-as de uma vez para garantir a ordem
        // Isso é mais eficiente do que limpar e re-renderizar o histórico inteiro.
        snapshot.docChanges().forEach(change => {
            const msgData = change.doc.data();
            const timestampDate = msgData.timestamp?.toDate ? msgData.timestamp.toDate() : new Date();

            if (change.type === "added") {
                // Adiciona novas mensagens
                addMessageToDom(msgData.text, msgData.sender, timestampDate);
            }
        });
        
        // Garante o scroll para o final após carregar/atualizar
        chatHistory.scrollTop = chatHistory.scrollHeight;

    }, (error) => {
        console.error("Erro ao ouvir mensagens do Firestore:", error);
    });
}


/**
 * Chama a API do Gemini para gerar uma resposta baseada na mensagem do usuário.
 */
async function getAiResponse(userMessage) {
    if (!isAuthReady || isTyping) return;

    isTyping = true;
    showTyping(true);

    const systemPrompt = "Você é Lumie, uma IA de gestão empresarial sofisticada. Seu objetivo é ajudar o usuário com relatórios, métricas de desempenho e planejamento de projetos. Responda de forma concisa e profissional, focando em como você pode auxiliar na gestão. Sua resposta deve estar em Português.";
    const userQuery = userMessage;
    const apiKey = ""; // Será fornecida pelo ambiente (Canvas)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const payload = {
                contents: [{ parts: [{ text: userQuery }] }],
                tools: [{ "google_search": {} }], // Ativa o Grounding (Google Search)
                systemInstruction: { parts: [{ text: systemPrompt }] },
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 429 && attempt < maxRetries - 1) {
                    const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue; // Tenta novamente
                }
                throw new Error(`Erro na API Gemini: ${response.statusText}`);
            }

            const result = await response.json();
            const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui processar a sua solicitação. Tente novamente.";
            
            // Salva a resposta da IA no Firestore. O onSnapshot fará a renderização.
            await saveMessageToFirestore(responseText, 'lumie');
            
            isTyping = false;
            showTyping(false);
            return; 

        } catch (error) {
            console.error("Erro na comunicação com a API Gemini:", error);
            
            if (attempt === maxRetries - 1) {
                await saveMessageToFirestore("Ocorreu um erro ao conectar com o servidor. Por favor, tente novamente mais tarde.", 'lumie');
                isTyping = false;
                showTyping(false);
            }
        }
    }
}

/**
 * Lida com o envio da mensagem do usuário (via clique ou Enter).
 */
async function handleSendMessage() {
    const messageInput = document.getElementById('chat-message-input');
    const sendBtn = document.getElementById('send-btn');
    if (!messageInput || !isAuthReady || isTyping) return;

    const message = messageInput.value.trim();
    if (message === '') return;
    
    // 1. Salva a mensagem do usuário no Firestore (o onSnapshot renderiza no DOM)
    await saveMessageToFirestore(message, 'user');
    
    // 2. Limpa o input e desabilita o botão
    messageInput.value = ''; 
    messageInput.dispatchEvent(new Event('input')); // Dispara input para atualizar ícone
    
    // 3. Inicia o fluxo de resposta da IA
    getAiResponse(message);
}


/**
 * Função principal para configurar eventos do módulo de mensagens.
 * Deve ser chamada após carregar chatlist.html OU chatconversation.html.
 */
export function initializeMessages() {
    // Tenta configurar a autenticação, mas só faz a primeira vez
    if (!db) {
        setupFirebaseAuth();
    }
    
    // === Lógica para a Lista de Chats (chatlist.html) ===
    const lumieChatButton = document.getElementById('chat-lumie');
    if (lumieChatButton) {
      // Listener para abrir a conversa
      lumieChatButton.addEventListener('click', (e) => {
        e.preventDefault();
        loadConversation();
      });
    }

    // === Lógica para a Conversa (chatconversation.html) ===
    const backButton = document.getElementById('back-to-chat-list');
    const messageInput = document.getElementById('chat-message-input');
    const sendBtn = document.getElementById('send-btn');
    const sendIcon = document.getElementById('send-icon');

    if (backButton) {
      // Listener para voltar para a lista de chats
      backButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Desliga o listener do Firestore ao fechar a conversa
        if (unsubscribeSnapshot) {
            unsubscribeSnapshot();
            unsubscribeSnapshot = null;
        }
        loadChatList();
      });
    }

    if (messageInput && sendBtn) {
        // Lógica de ativação do botão Enviar
        messageInput.addEventListener('input', () => {
            const hasText = messageInput.value.trim() !== '';
            if (sendIcon) sendIcon.textContent = hasText ? 'send' : 'mic';
            sendBtn.disabled = !hasText;
        });

        // Evento de clique no botão Enviar
        sendBtn.addEventListener('click', handleSendMessage);

        // Evento de tecla Enter
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && messageInput.value.trim() !== '') {
                e.preventDefault();
                handleSendMessage();
            }
        });
        
        // Garante que o indicador de digitação esteja escondido no início
        showTyping(false);
    }
}

// Inicializa o módulo se ele for carregado de forma síncrona/direta (mas neste projeto ele é exportado)
// Para o seu projeto, a função 'initializeMessages' é chamada dentro do 'loadConversation' e 'loadChatList' do seu script.js.
// Certifique-se de que no seu 'script.js' a importação seja feita corretamente.

// Exemplo de como você deve importar/chamar no seu script.js (se ainda não estiver fazendo):
// import { initializeMessages } from './screens/companies/messages/messages.js';
// ... dentro de loadConversation() e loadChatList(): initializeMessages();