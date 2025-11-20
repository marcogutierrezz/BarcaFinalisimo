// En admin-app.js, actualiza el método handleUpdateStandings:

async handleUpdateStandings() {
    try {
        console.log('🔄 Actualizando tabla de posiciones...');
        const standings = await this.standingsAPI.fetchStandingsFromAPI('PD', '2024');
        this.displayStandings(standings);
        this.showSuccess('✅ Tabla de posiciones actualizada');
    } catch (error) {
        console.error('❌ Error actualizando tabla:', error);
        this.showError('❌ Error: ' + error.message);
    }
}

// Y actualiza displayStandings para mostrar los datos:

displayStandings(standings) {
    const container = document.getElementById('standings-data');
    if (!container) return;

    if (standings && standings.data) {
        const data = standings.data;
        const lastUpdated = new Date(standings.lastUpdated).toLocaleString('es-ES');
        
        container.innerHTML = `
            <div class="standings-info">
                <h4>${data.competition.name} - Temporada 2024/25</h4>
                <p><strong>Jornada actual:</strong> ${data.season.currentMatchday}</p>
                <p><strong>Última actualización:</strong> ${lastUpdated}</p>
                <p><strong>Fuente:</strong> ${standings.source || 'firestore'}</p>
            </div>
            
            <div class="standings-table-container" style="margin-top: 1rem;">
                <table class="standings-table">
                    <thead>
                        <tr>
                            <th>Pos</th>
                            <th>Equipo</th>
                            <th>PJ</th>
                            <th>G</th>
                            <th>E</th>
                            <th>P</th>
                            <th>GF</th>
                            <th>GC</th>
                            <th>DG</th>
                            <th>Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.standings[0].table.map(team => `
                            <tr class="${team.team.name === 'FC Barcelona' ? 'highlight' : ''}">
                                <td>${team.position}</td>
                                <td>${team.team.name}</td>
                                <td>${team.playedGames}</td>
                                <td>${team.won}</td>
                                <td>${team.draw}</td>
                                <td>${team.lost}</td>
                                <td>${team.goalsFor}</td>
                                <td>${team.goalsAgainst}</td>
                                <td>${team.goalDifference}</td>
                                <td><strong>${team.points}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <button onclick="debugStandings()" class="btn" style="background: purple; font-size: 0.8rem;">
                    🐛 Debug Datos
                </button>
                <button onclick="clearStandingsData()" class="btn" style="background: orange; font-size: 0.8rem;">
                    🗑️ Limpiar Datos
                </button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="no-data-message">
                <p>No hay datos de tabla disponibles</p>
                <button onclick="window.adminApp.handleUpdateStandings()" class="btn">
                    🔄 Cargar Datos de Prueba
                </button>
            </div>
        `;
    }
}
