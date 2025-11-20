class CalendarManagement {
    constructor() {
        this.matchesCollection = firebase.firestore().collection('matches');
        console.log('📅 CalendarManagement inicializado con Firestore');
    }

    async addMatch(matchData) {
        try {
            const docRef = await this.matchesCollection.add({
                ...matchData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('✅ Partido agregado a Firestore con ID:', docRef.id);
            this.showSuccess('✅ Partido agregado exitosamente a Firestore');
            return docRef.id;
        } catch (error) {
            console.error('❌ Error agregando partido a Firestore:', error);
            this.showError('❌ Error agregando partido: ' + error.message);
            throw error;
        }
    }

    async getMatchesByDateRange(startDate, endDate) {
        try {
            const snapshot = await this.matchesCollection
                .where('date', '>=', startDate)
                .where('date', '<=', endDate)
                .orderBy('date')
                .get();
            
            const matches = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log('📋 Partidos por fecha obtenidos de Firestore:', matches.length);
            return matches;
        } catch (error) {
            console.error('❌ Error obteniendo partidos de Firestore:', error);
            this.showError('❌ Error obteniendo partidos: ' + error.message);
            throw error;
        }
    }

    async getUpcomingMatches() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const snapshot = await this.matchesCollection
                .where('date', '>=', today)
                .orderBy('date')
                .get();
            
            const matches = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log('📋 Próximos partidos obtenidos de Firestore:', matches.length);
            return matches;
        } catch (error) {
            console.error('❌ Error obteniendo próximos partidos de Firestore:', error);
            this.showError('❌ Error obteniendo próximos partidos: ' + error.message);
            throw error;
        }
    }

    onMatchesUpdate(callback) {
        console.log('🔔 Suscribiéndose a cambios en tiempo real de partidos');
        
        return this.matchesCollection
            .orderBy('date')
            .onSnapshot(
                (snapshot) => {
                    const matches = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    
                    console.log('🔄 Cambio detectado en partidos de Firestore:', matches.length, 'partidos');
                    callback(matches);
                },
                (error) => {
                    console.error('❌ Error en suscripción a partidos de Firestore:', error);
                    this.showError('❌ Error conectando con Firestore: ' + error.message);
                    callback([]);
                }
            );
    }

    showSuccess(message) {
        this.showStatus(message, 'status-success');
    }

    showError(message) {
        this.showStatus(message, 'status-error');
    }

    showStatus(message, className) {
        let statusElement = document.getElementById('match-status');
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'match-status';
            const matchForm = document.getElementById('match-form');
            if (matchForm) {
                matchForm.parentNode.insertBefore(statusElement, matchForm.nextSibling);
            }
        }
        
        statusElement.textContent = message;
        statusElement.className = `status-message ${className}`;
        statusElement.style.display = 'block';
        
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }

    async updateMatch(matchId, matchData) {
        try {
            await this.matchesCollection.doc(matchId).update(matchData);
            console.log('✅ Partido actualizado en Firestore:', matchId);
            this.showSuccess('✅ Partido actualizado exitosamente');
        } catch (error) {
            console.error('❌ Error actualizando partido:', error);
            this.showError('❌ Error actualizando partido: ' + error.message);
            throw error;
        }
    }

    async deleteMatch(matchId) {
        try {
            await this.matchesCollection.doc(matchId).delete();
            console.log('✅ Partido eliminado de Firestore:', matchId);
            this.showSuccess('✅ Partido eliminado exitosamente');
        } catch (error) {
            console.error('❌ Error eliminando partido:', error);
            this.showError('❌ Error eliminando partido: ' + error.message);
            throw error;
        }
    }
}