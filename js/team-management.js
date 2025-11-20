class TeamManagement {
    constructor() {
        this.playersCollection = firebase.firestore().collection('players');
        console.log('👥 TeamManagement inicializado con Firestore');
    }

    async addPlayer(playerData) {
        try {
            const docRef = await this.playersCollection.add({
                ...playerData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('✅ Jugador agregado a Firestore con ID:', docRef.id);
            this.showSuccess('✅ Jugador agregado exitosamente a Firestore');
            return docRef.id;
        } catch (error) {
            console.error('❌ Error agregando jugador a Firestore:', error);
            this.showError('❌ Error agregando jugador: ' + error.message);
            throw error;
        }
    }

    async getPlayers() {
        try {
            const snapshot = await this.playersCollection
                .orderBy('createdAt', 'desc')
                .get();
                
            const players = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log('📋 Jugadores obtenidos de Firestore:', players.length);
            return players;
        } catch (error) {
            console.error('❌ Error obteniendo jugadores de Firestore:', error);
            this.showError('❌ Error cargando jugadores: ' + error.message);
            return [];
        }
    }

    onPlayersUpdate(callback) {
        console.log('🔔 Suscribiéndose a cambios en tiempo real de Firestore');
        
        return this.playersCollection
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                (snapshot) => {
                    const players = snapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            name: data.name || '',
                            position: data.position || '',
                            number: data.number || 0,
                            createdAt: data.createdAt || null,
                            updatedAt: data.updatedAt || null
                        };
                    });
                    
                    console.log('🔄 Cambio detectado en Firestore:', players.length, 'jugadores');
                    
                    // Verificar que tenemos datos válidos
                    if (players && Array.isArray(players)) {
                        callback(players);
                    } else {
                        console.error('❌ Datos inválidos recibidos de Firestore');
                        callback([]);
                    }
                },
                (error) => {
                    console.error('❌ Error en suscripción a Firestore:', error);
                    this.showError('❌ Error conectando con Firestore: ' + error.message);
                    // Llamar callback con array vacío para evitar errores
                    callback([]);
                }
            );
    }

    async debugShowPlayers() {
        try {
            const players = await this.getPlayers();
            console.log('🐛 DEBUG - Jugadores en Firestore:', players);
            return players;
        } catch (error) {
            console.error('🐛 DEBUG - Error obteniendo jugadores:', error);
            return [];
        }
    }

    async forceRefresh() {
        console.log('🔄 Forzando actualización manual de jugadores...');
        try {
            const players = await this.getPlayers();
            console.log('✅ Actualización manual completada:', players.length, 'jugadores');
            return players;
        } catch (error) {
            console.error('❌ Error en actualización manual:', error);
            return [];
        }
    }

    showSuccess(message) {
        this.showStatus(message, 'status-success');
    }

    showError(message) {
        this.showStatus(message, 'status-error');
    }

    showStatus(message, className) {
        let statusElement = document.getElementById('player-status');
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'player-status';
            const playerForm = document.getElementById('player-form');
            if (playerForm) {
                playerForm.parentNode.insertBefore(statusElement, playerForm.nextSibling);
            }
        }
        
        statusElement.textContent = message;
        statusElement.className = `status-message ${className}`;
        statusElement.style.display = 'block';
        
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }

    async updatePlayer(playerId, playerData) {
        try {
            await this.playersCollection.doc(playerId).update({
                ...playerData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Jugador actualizado en Firestore:', playerId);
            this.showSuccess('✅ Jugador actualizado exitosamente');
        } catch (error) {
            console.error('❌ Error actualizando jugador:', error);
            this.showError('❌ Error actualizando jugador: ' + error.message);
            throw error;
        }
    }

    async deletePlayer(playerId) {
        try {
            await this.playersCollection.doc(playerId).delete();
            console.log('✅ Jugador eliminado de Firestore:', playerId);
            this.showSuccess('✅ Jugador eliminado exitosamente');
        } catch (error) {
            console.error('❌ Error eliminando jugador:', error);
            this.showError('❌ Error eliminando jugador: ' + error.message);
            throw error;
        }
    }

    async clearAllPlayers() {
        try {
            const snapshot = await this.playersCollection.get();
            const batch = firebase.firestore().batch();
            
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            await batch.commit();
            console.log('🗑️ Todos los jugadores eliminados');
            this.showSuccess('🗑️ Todos los jugadores eliminados');
        } catch (error) {
            console.error('❌ Error eliminando jugadores:', error);
            this.showError('❌ Error eliminando jugadores: ' + error.message);
            throw error;
        }
    }
}
