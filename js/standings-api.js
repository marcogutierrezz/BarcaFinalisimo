// standings-api.js - VERSIÓN CON LOCALSTORAGE COMO FALLBACK
class StandingsAPI {
    constructor() {
        this.standingsCollection = firebase.firestore().collection('standings');
        this.localStorageKey = 'fcb_standings_data';
        console.log('🏆 StandingsAPI inicializado (Firestore + localStorage)');
    }

    // Obtener datos de API externa o usar datos de prueba
    async fetchStandingsFromAPI(leagueId, season) {
        try {
            console.log('🌐 Intentando obtener datos de API para:', leagueId, season);
            
            // Datos de prueba para LaLiga
            const mockData = this.getMockLaLigaData();
            
            // Guardar en Firestore (si está disponible)
            await this.saveStandings(mockData);
            
            // También guardar en localStorage
            this.saveToLocalStorage(mockData);
            
            console.log('✅ Datos de tabla guardados en Firestore y localStorage');
            return mockData;
            
        } catch (error) {
            console.error('❌ Error fetching standings:', error);
            console.log('🔄 Usando datos locales como fallback...');
            // Fallback a datos locales
            return this.getLocalStandings();
        }
    }

    // Datos de prueba para LaLiga
    getMockLaLigaData() {
        return {
            competition: { 
                name: 'LaLiga EA Sports',
                code: 'PD',
                emblem: 'https://crests.football-data.org/PD.png'
            },
            season: { 
                currentMatchday: 12,
                startDate: '2024-08-16',
                endDate: '2025-05-25'
            },
            standings: [
                {
                    stage: 'REGULAR_SEASON',
                    type: 'TOTAL',
                    group: null,
                    table: [
                        { position: 1, team: { name: 'Real Madrid', crest: 'https://crests.football-data.org/86.png' }, playedGames: 12, won: 10, draw: 1, lost: 1, points: 31, goalsFor: 26, goalsAgainst: 10, goalDifference: 16 },
                        { position: 2, team: { name: 'FC Barcelona', crest: 'https://crests.football-data.org/81.png' }, playedGames: 12, won: 9, draw: 1, lost: 2, points: 28, goalsFor: 31, goalsAgainst: 17, goalDifference: 14 },
                        { position: 3, team: { name: 'Villarreal', crest: 'https://crests.football-data.org/94.png' }, playedGames: 12, won: 8, draw: 2, lost: 2, points: 26, goalsFor: 24, goalsAgainst: 16, goalDifference: 8 },
                        { position: 4, team: { name: 'Atlético Madrid', crest: 'https://crests.football-data.org/78.png' }, playedGames: 12, won: 7, draw: 4, lost: 1, points: 25, goalsFor: 23, goalsAgainst: 13, goalDifference: 10 },
                        { position: 5, team: { name: 'Real Betis', crest: 'https://crests.football-data.org/90.png' }, playedGames: 12, won: 5, draw: 5, lost: 2, points: 20, goalsFor: 19, goalsAgainst: 13, goalDifference: 6 },
                        { position: 6, team: { name: 'RCD Espanyol', crest: 'https://crests.football-data.org/80.png' }, playedGames: 12, won: 5, draw: 3, lost: 4, points: 18, goalsFor: 15, goalsAgainst: 15, goalDifference: 0 },
                        { position: 7, team: { name: 'Athletic Club', crest: 'https://crests.football-data.org/77.png' }, playedGames: 12, won: 5, draw: 2, lost: 5, points: 17, goalsFor: 16, goalsAgainst: 17, goalDifference: -1 },
                        { position: 8, team: { name: 'Getafe', crest: 'https://crests.football-data.org/82.png' }, playedGames: 12, won: 5, draw: 2, lost: 5, points: 17, goalsFor: 12, goalsAgainst: 19, goalDifference: -7 },
                        { position: 9, team: { name: 'Sevilla', crest: 'https://crests.football-data.org/559.png' }, playedGames: 12, won: 5, draw: 1, lost: 6, points: 16, goalsFor: 16, goalsAgainst: 17, goalDifference: -1 },
                        { position: 10, team: { name: 'Alavés', crest: 'https://crests.football-data.org/263.png' }, playedGames: 12, won: 4, draw: 3, lost: 5, points: 15, goalsFor: 11, goalsAgainst: 11, goalDifference: 0 },
                        { position: 11, team: { name: 'Elche C.F.', crest: 'https://crests.football-data.org/253.png' }, playedGames: 12, won: 3, draw: 4, lost: 5, points: 13, goalsFor: 11, goalsAgainst: 15, goalDifference: -4 },
                        { position: 12, team: { name: 'Rayo Vallecano', crest: 'https://crests.football-data.org/87.png' }, playedGames: 12, won: 3, draw: 4, lost: 5, points: 13, goalsFor: 12, goalsAgainst: 20, goalDifference: -8 },
                        { position: 13, team: { name: 'Celta de Vigo', crest: 'https://crests.football-data.org/558.png' }, playedGames: 12, won: 3, draw: 3, lost: 6, points: 12, goalsFor: 13, goalsAgainst: 16, goalDifference: -3 },
                        { position: 14, team: { name: 'Real Sociedad', crest: 'https://crests.football-data.org/92.png' }, playedGames: 12, won: 3, draw: 4, lost: 5, points: 13, goalsFor: 14, goalsAgainst: 23, goalDifference: -9 },
                        { position: 15, team: { name: 'RCD Mallorca', crest: 'https://crests.football-data.org/89.png' }, playedGames: 12, won: 3, draw: 3, lost: 6, points: 12, goalsFor: 12, goalsAgainst: 18, goalDifference: -6 },
                        { position: 16, team: { name: 'Osasuna', crest: 'https://crests.football-data.org/79.png' }, playedGames: 12, won: 3, draw: 2, lost: 7, points: 11, goalsFor: 13, goalsAgainst: 26, goalDifference: -13 },
                        { position: 17, team: { name: 'Valencia C.F.', crest: 'https://crests.football-data.org/95.png' }, playedGames: 12, won: 2, draw: 4, lost: 6, points: 10, goalsFor: 11, goalsAgainst: 20, goalDifference: -9 },
                        { position: 18, team: { name: 'Girona', crest: 'https://crests.football-data.org/298.png' }, playedGames: 12, won: 2, draw: 3, lost: 7, points: 9, goalsFor: 11, goalsAgainst: 26, goalDifference: -15 },
                        { position: 19, team: { name: 'Levante', crest: 'https://crests.football-data.org/88.png' }, playedGames: 12, won: 2, draw: 3, lost: 7, points: 9, goalsFor: 13, goalsAgainst: 27, goalDifference: -14 },
                        { position: 20, team: { name: 'Real Oviedo', crest: 'https://crests.football-data.org/263.png' }, playedGames: 12, won: 2, draw: 2, lost: 8, points: 8, goalsFor: 10, goalsAgainst: 23, goalDifference: -13 }
                    ]
                }
            ],
            lastUpdated: new Date().toISOString(),
            source: 'mock_data'
        };
    }

    // Guardar datos en Firestore
    async saveStandings(standingsData) {
        try {
            await this.standingsCollection.doc('current').set({
                data: standingsData,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                source: 'firestore'
            });
            console.log('💾 Datos de tabla guardados en Firestore');
        } catch (error) {
            console.error('❌ Error guardando en Firestore:', error);
            throw error;
        }
    }

    // Guardar en localStorage
    saveToLocalStorage(standingsData) {
        try {
            const dataToStore = {
                data: standingsData,
                lastUpdated: new Date().toISOString(),
                source: 'localStorage'
            };
            localStorage.setItem(this.localStorageKey, JSON.stringify(dataToStore));
            console.log('💾 Datos de tabla guardados en localStorage');
        } catch (error) {
            console.error('❌ Error guardando en localStorage:', error);
        }
    }

    // Obtener datos locales (Firestore + localStorage fallback)
    async getLocalStandings() {
        try {
            // Primero intentar con Firestore
            const doc = await this.standingsCollection.doc('current').get();
            if (doc.exists) {
                const firestoreData = doc.data();
                console.log('📊 Datos de tabla obtenidos de Firestore');
                // También actualizar localStorage
                this.saveToLocalStorage(firestoreData.data);
                return firestoreData;
            }
            
            // Si Firestore falla, usar localStorage
            console.log('🔄 Firestore vacío, buscando en localStorage...');
            return this.getFromLocalStorage();
            
        } catch (error) {
            console.error('❌ Error obteniendo de Firestore:', error);
            console.log('🔄 Usando localStorage como fallback...');
            return this.getFromLocalStorage();
        }
    }

    // Obtener de localStorage
    getFromLocalStorage() {
        try {
            const stored = localStorage.getItem(this.localStorageKey);
            if (stored) {
                const data = JSON.parse(stored);
                console.log('📊 Datos de tabla obtenidos de localStorage');
                return data;
            } else {
                console.log('ℹ️ No hay datos en localStorage, generando datos de prueba...');
                const mockData = this.getMockLaLigaData();
                this.saveToLocalStorage(mockData);
                return {
                    data: mockData,
                    lastUpdated: new Date().toISOString(),
                    source: 'localStorage_mock'
                };
            }
        } catch (error) {
            console.error('❌ Error obteniendo de localStorage:', error);
            // Último recurso: datos de prueba
            const mockData = this.getMockLaLigaData();
            return {
                data: mockData,
                lastUpdated: new Date().toISOString(),
                source: 'fallback_mock'
            };
        }
    }

    // Método para limpiar datos locales
    clearLocalData() {
        try {
            localStorage.removeItem(this.localStorageKey);
            console.log('🗑️ Datos locales de tabla eliminados');
        } catch (error) {
            console.error('❌ Error limpiando datos locales:', error);
        }
    }

    // Método para debug
    async debugStandings() {
        console.log('🐛 DEBUG - Estado de datos de tabla:');
        
        // Verificar Firestore
        try {
            const doc = await this.standingsCollection.doc('current').get();
            console.log('🔥 Firestore:', doc.exists ? 'TIENE DATOS' : 'VACÍO');
            if (doc.exists) {
                console.log('   Última actualización:', doc.data().lastUpdated?.toDate());
            }
        } catch (error) {
            console.log('🔥 Firestore:', 'ERROR - ' + error.message);
        }
        
        // Verificar localStorage
        const localData = localStorage.getItem(this.localStorageKey);
        console.log('💾 localStorage:', localData ? 'TIENE DATOS' : 'VACÍO');
        if (localData) {
            const parsed = JSON.parse(localData);
            console.log('   Última actualización:', parsed.lastUpdated);
        }
        
        return this.getLocalStandings();
    }
}

// Función global para debug
window.debugStandings = async function() {
    if (window.adminApp && window.adminApp.standingsAPI) {
        return await window.adminApp.standingsAPI.debugStandings();
    } else {
        console.error('🐛 DEBUG: adminApp o standingsAPI no disponibles');
        return null;
    }
};
