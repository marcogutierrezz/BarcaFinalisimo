const firebaseConfig = {
    apiKey: "AIzaSyCgsBVl7mEzcPjiTCsGcOyxs_PljYI1lqA",
    authDomain: "web1-2c593.firebaseapp.com",
    projectId: "web1-2c593",
    storageBucket: "web1-2c593.firebasestorage.app",
    messagingSenderId: "829936667234",
    appId: "1:829936667234:web:e83c0a0a67f110b24bdf3b",
    measurementId: "G-FDH3EXEJZ0"
};

console.log('🔥 Iniciando configuración de Firebase...');

console.log('🔍 Diagnóstico Firebase:');
console.log('  - Firebase disponible:', typeof firebase !== 'undefined');
console.log('  - Firestore disponible:', typeof firebase !== 'undefined' && typeof firebase.firestore !== 'undefined');
console.log('  - Auth disponible:', typeof firebase !== 'undefined' && typeof firebase.auth !== 'undefined');

try {
    if (typeof firebase === 'undefined') {
        throw new Error('Firebase no está cargado. Revisa los scripts.');
    }

    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
        console.log('✅ Firebase inicializado correctamente');
    } else {
        console.log('ℹ️ Firebase ya estaba inicializado');
    }

    let auth, db;
    
    if (typeof firebase.auth !== 'undefined') {
        auth = firebase.auth();
        console.log('✅ Auth service inicializado');
    } else {
        throw new Error('Auth service no disponible');
    }
    
    if (typeof firebase.firestore !== 'undefined') {
        db = firebase.firestore();
        
        db.settings({
            cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
        });
        
        db.enablePersistence()
            .then(() => {
                console.log('✅ Persistencia offline habilitada');
            })
            .catch((err) => {
                console.warn('⚠️ Persistencia offline no disponible:', err.code);
            });
            
        console.log('✅ Firestore service inicializado');
    } else {
        throw new Error('Firestore service no disponible');
    }

    console.log('🎉 Todos los servicios de Firebase inicializados correctamente');

} catch (error) {
    console.error('❌ ERROR CRÍTICO en configuración Firebase:', error);
    console.error('💡 SOLUCIÓN: Verifica que:');
    console.error('   1. Los scripts de Firebase estén cargados');
    console.error('   2. La base de datos Firestore exista');
    console.error('   3. Las reglas de seguridad permitan acceso');
}