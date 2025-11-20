class StandingsAPI {
    constructor() {
        this.standingsCollection = firebase.firestore().collection('standings');
        console.log('🏆 StandingsAPI inicializado con Firestore');
    }

    async fetchStandingsFromAPI(leagueId, season) {
        try {
            console.log('🌐 Intentando obtener datos de API para:', leagueId, season);
            
            const mockData = {
                competition: { name: 'La Liga' },
                season: { currentMatchday: 12 },
                standings: [
                    {
                        table: [
                            { position: 1, team: { name: 'Real Madrid' }, points: 31 },
                            { position: 2, team: { name: 'FC Barcelona' }, points: 28 },
                        ]
                    }
                ]
            };
            
            await this.saveStandings(mockData);
            return mockData;
        } catch (error) {
            console.error('❌ Error fetching standings:', error);
            return this.getLocalStandings();
        }
    }

    async saveStandings(standingsData) {
        try {
            await this.standingsCollection.doc('current').set({
                data: standingsData,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('💾 Datos de tabla guardados en Firestore');
        } catch (error) {
            console.error('❌ Error guardando datos:', error);
            throw error;
        }
    }

    async getLocalStandings() {
        try {
            const doc = await this.standingsCollection.doc('current').get();
            if (doc.exists) {
                console.log('📊 Datos de tabla obtenidos de Firestore');
                return doc.data();
            }
            console.log('ℹ️ No hay datos de tabla en Firestore');
            return null;
        } catch (error) {
            console.error('❌ Error obteniendo datos locales:', error);
            throw error;
        }
    }
}