class AdminApp {
    constructor() {
        this.authSystem = null;
        this.teamManager = null;
        this.calendarManager = null;
        this.standingsAPI = null;
        this.playersUnsubscribe = null;
        
        console.log('🚀 Constructor AdminApp llamado');
        this.init();
    }

    async init() {
        console.log('🔧 Inicializando aplicación Admin...');
        
        try {
            await this.waitForFirebase();
            console.log('✅ Firebase listo');
            
            this.authSystem = new AuthSystem();
            this.teamManager = new TeamManagement();
            this.calendarManager = new CalendarManagement();
            this.standingsAPI = new StandingsAPI();
            
            this.setupEventListeners();
            this.setupRealTimeUpdates();
            
            console.log('✅ Aplicación Admin inicializada correctamente');
        } catch (error) {
            console.error('❌ Error inicializando aplicación:', error);
            this.showError('Error inicializando la aplicación: ' + error.message);
        }
    }

    waitForFirebase() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50;
            
            const checkFirebase = () => {
                attempts++;
                
                if (typeof firebase !== 'undefined' && 
                    typeof firebase.auth !== 'undefined' && 
                    typeof firebase.firestore !== 'undefined') {
                    console.log('✅ Firebase completamente cargado');
                    resolve();
                    return;
                }
                
                if (attempts >= maxAttempts) {
                    reject(new Error('Firebase no se cargó correctamente'));
                    return;
                }
                
                setTimeout(checkFirebase, 200);
            };
            
            checkFirebase();
        });
    }

    setupEventListeners() {
        console.log('🎯 Configurando event listeners...');
        
        // Login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Registro de empleados
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEmployeeRegistration();
            });
        }

        // Gestión de jugadores
        const playerForm = document.getElementById('player-form');
        if (playerForm) {
            playerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddPlayer();
            });
        }

        // Gestión de partidos
        const matchForm = document.getElementById('match-form');
        if (matchForm) {
            matchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddMatch();
            });
        }

        // Actualizar tabla de posiciones
        const updateStandingsBtn = document.getElementById('update-standings');
        if (updateStandingsBtn) {
            updateStandingsBtn.addEventListener('click', () => {
                this.handleUpdateStandings();
            });
        }

        // Cerrar sesión
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
    }

    setupRealTimeUpdates() {
        console.log('🔄 Configurando actualizaciones en tiempo real...');
        
        // Suscribirse a cambios en jugadores
        if (this.teamManager && this.teamManager.onPlayersUpdate) {
            this.playersUnsubscribe = this.teamManager.onPlayersUpdate((players) => {
                console.log('🔄 Actualización en tiempo real de jugadores:', players.length);
                this.displayPlayers(players);
            });
        }
    }

    async handleLogin() {
        console.log('🔐 Iniciando proceso de login...');
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (!email || !password) {
            this.showError('❌ Por favor completa todos los campos');
            return;
        }

        try {
            await this.authSystem.login(email, password);
            this.showSuccess('✅ Inicio de sesión exitoso');
            
            setTimeout(() => {
                this.loadPlayers();
                this.setupRealTimeUpdates();
            }, 1000);
            
        } catch (error) {
            console.error('❌ Error en login:', error);
            this.showError('❌ ' + error.message);
        }
    }

    async handleEmployeeRegistration() {
        const email = document.getElementById('employee-email').value;
        const password = document.getElementById('employee-password').value;
        const name = document.getElementById('employee-name').value;

        try {
            await this.authSystem.registerEmployee(email, password, { name });
            this.showSuccess('✅ Empleado registrado exitosamente');
            document.getElementById('register-form').reset();
        } catch (error) {
            this.showError('❌ ' + error.message);
        }
    }

    async handleAddPlayer() {
        const name = document.getElementById('player-name').value;
        const position = document.getElementById('player-position').value;
        const number = parseInt(document.getElementById('player-number').value);

        // Validación
        if (!name || !position || !number) {
            this.showError('❌ Por favor completa todos los campos');
            return;
        }

        try {
            await this.teamManager.addPlayer({ name, position, number });
            document.getElementById('player-form').reset();
            
            console.log('✅ Jugador agregado, esperando actualización en tiempo real...');
            
        } catch (error) {
            console.error('❌ Error en handleAddPlayer:', error);
        }
    }

    async handleAddMatch() {
        const date = document.getElementById('match-date').value;
        const opponent = document.getElementById('match-opponent').value;
        const competition = document.getElementById('match-competition').value;

        if (!date || !opponent || !competition) {
            this.showError('❌ Por favor completa todos los campos');
            return;
        }

        try {
            await this.calendarManager.addMatch({ date, opponent, competition });
            document.getElementById('match-form').reset();
            console.log('✅ Partido agregado');
        } catch (error) {
            console.error('❌ Error en handleAddMatch:', error);
        }
    }

    async handleUpdateStandings() {
        try {
            const standings = await this.standingsAPI.fetchStandingsFromAPI('PD', '2024');
            this.displayStandings(standings);
            this.showSuccess('✅ Tabla de posiciones actualizada');
        } catch (error) {
            this.showError('❌ ' + error.message);
        }
    }

    async handleLogout() {
        try {
            if (this.playersUnsubscribe) {
                this.playersUnsubscribe();
            }
            
            await this.authSystem.logout();
            this.showSuccess('✅ Sesión cerrada exitosamente');
            
            this.displayPlayers([]);
            
        } catch (error) {
            this.showError('❌ ' + error.message);
        }
    }

    async loadPlayers() {
        try {
            console.log('🔄 Cargando jugadores...');
            const players = await this.teamManager.getPlayers();
            this.displayPlayers(players);
        } catch (error) {
            console.error('❌ Error cargando jugadores:', error);
        }
    }

    displayPlayers(players) {
        const container = document.getElementById('players-list');
        if (!container) {
            console.error('❌ Contenedor de jugadores no encontrado');
            return;
        }

        console.log('🎨 Mostrando jugadores en interfaz:', players.length);

        if (players.length === 0) {
            container.innerHTML = `
                <div class="no-players-message">
                    <p>No hay jugadores registrados en Firestore</p>
                    <p><small>Agrega jugadores usando el formulario arriba</small></p>
                </div>
            `;
            return;
        }

        container.innerHTML = players.map(player => {
            let createdAt = 'Fecha no disponible';
            if (player.createdAt) {
                if (player.createdAt.toDate) {
                    createdAt = player.createdAt.toDate().toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } else if (typeof player.createdAt === 'string') {
                    createdAt = new Date(player.createdAt).toLocaleDateString('es-ES');
                }
            }

            return `
                <div class="player-card">
                    <div class="player-header">
                        <h4>${player.name}</h4>
                        <span class="player-number">#${player.number}</span>
                    </div>
                    <div class="player-details">
                        <p><strong>Posición:</strong> ${player.position}</p>
                        <p><strong>Agregado:</strong> ${createdAt}</p>
                        <p class="player-id"><small>ID: ${player.id}</small></p>
                    </div>
                </div>
            `;
        }).join('');

        console.log('✅ Jugadores mostrados en interfaz');
    }

    displayStandings(standings) {
        const container = document.getElementById('standings-data');
        if (!container) return;

        if (standings && standings.data) {
            container.innerHTML = `
                <div class="standings-info">
                    <h4>Datos de tabla cargados</h4>
                    <p>Última actualización: ${new Date().toLocaleString()}</p>
                </div>
            `;
        } else {
            container.innerHTML = '<p>No hay datos de tabla disponibles</p>';
        }
    }

    showSuccess(message) {
        this.showStatus(message, 'status-success');
    }

    showError(message) {
        this.showStatus(message, 'status-error');
    }

    showStatus(message, className) {
        let statusElement = document.getElementById('login-status');
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'login-status';
            const loginSection = document.getElementById('login-section');
            if (loginSection) {
                loginSection.appendChild(statusElement);
            }
        }
        
        statusElement.textContent = message;
        statusElement.className = `status-message ${className}`;
        statusElement.style.display = 'block';
        
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, iniciando aplicación Admin...');
    window.adminApp = new AdminApp();
});

window.addEventListener('load', () => {
    console.log('🔄 Ventana completamente cargada');
});