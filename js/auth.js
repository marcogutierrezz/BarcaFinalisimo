class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.userRole = 'employee';
        
        this.updateUI = this.updateUI.bind(this);
        this.checkUserRole = this.checkUserRole.bind(this);
        
        this.init();
    }

    init() {
        console.log('🔐 Inicializando sistema de autenticación...');
        
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase no está disponible');
            return;
        }
        
        firebase.auth().onAuthStateChanged((user) => {
            console.log('🔄 Cambio en estado de autenticación:', user);
            this.currentUser = user;
            this.updateUI();
            
            if (user) {
                this.checkUserRole(user.uid);
            } else {
                this.userRole = 'employee';
                this.updateUI();
            }
        });
    }

    async checkUserRole(uid) {
        try {
            console.log('👤 Verificando rol para usuario:', uid);
            
            const userDoc = await firebase.firestore()
                .collection('employees')
                .doc(uid)
                .get();
                
            if (userDoc.exists) {
                const userData = userDoc.data();
                this.userRole = userData.role || 'employee';
                console.log('✅ Rol obtenido de Firestore:', this.userRole);
            } else {
                if (this.currentUser && this.currentUser.email === 'admin@fcbarcelona.com') {
                    this.userRole = 'admin';
                    console.log('🛡️ Admin detectado por email');
                } else {
                    this.userRole = 'employee';
                    console.log('👨‍💼 Empleado por defecto');
                }
            }
        } catch (error) {
            console.error('❌ Error verificando rol:', error);
            if (this.currentUser && this.currentUser.email === 'admin@fcbarcelona.com') {
                this.userRole = 'admin';
            } else {
                this.userRole = 'employee';
            }
        }
        this.updateUI();
    }

    async registerEmployee(email, password, userData) {
        console.log('👥 Registrando nuevo empleado:', email);
        
        try {
            if (!this.isAdmin()) {
                throw new Error('Solo los administradores pueden registrar empleados');
            }

            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            
            await firebase.firestore()
                .collection('employees')
                .doc(userCredential.user.uid)
                .set({
                    ...userData,
                    role: 'employee',
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

            console.log('✅ Empleado registrado en Firestore');
            return userCredential.user;
        } catch (error) {
            console.error('❌ Error registrando empleado:', error);
            throw error;
        }
    }

    async login(email, password) {
        console.log('🔐 Intentando login con:', email);
        
        try {
            if (!email || !password) {
                throw new Error('Por favor completa todos los campos');
            }

            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log('✅ Login exitoso:', userCredential.user.email);
            return userCredential.user;
        } catch (error) {
            console.error('❌ Error en login:', error);
            
            let errorMessage = 'Error al iniciar sesión';
            switch (error.code) {
                case 'auth/invalid-email': errorMessage = 'El formato del email es incorrecto'; break;
                case 'auth/user-disabled': errorMessage = 'Esta cuenta ha sido deshabilitada'; break;
                case 'auth/user-not-found': errorMessage = 'No existe una cuenta con este email'; break;
                case 'auth/wrong-password': errorMessage = 'La contraseña es incorrecta'; break;
                case 'auth/too-many-requests': errorMessage = 'Demasiados intentos fallidos. Intenta más tarde'; break;
                default: errorMessage = error.message;
            }
            throw new Error(errorMessage);
        }
    }

    async logout() {
        try {
            await firebase.auth().signOut();
            console.log('✅ Sesión cerrada exitosamente');
        } catch (error) {
            console.error('❌ Error cerrando sesión:', error);
            throw error;
        }
    }

    isAdmin() {
        return this.userRole === 'admin';
    }

    updateUI() {
        const adminPanel = document.getElementById('admin-panel');
        const loginSection = document.getElementById('login-section');

        console.log('🎨 Actualizando UI, usuario:', this.currentUser);
        console.log('🎨 Rol del usuario:', this.userRole);

        if (this.currentUser) {
            if (loginSection) loginSection.classList.add('hidden');
            if (adminPanel) adminPanel.classList.remove('hidden');
            
            if (this.isAdmin()) {
                this.showAdminFeatures();
            } else {
                this.showEmployeeFeatures();
            }
        } else {
            if (loginSection) loginSection.classList.remove('hidden');
            if (adminPanel) adminPanel.classList.add('hidden');
        }
    }

    showAdminFeatures() {
        console.log('🛡️ Mostrando características de administrador');
        const userManagement = document.getElementById('user-management');
        if (userManagement) userManagement.classList.remove('hidden');
    }

    showEmployeeFeatures() {
        console.log('👨‍💼 Mostrando características de empleado');
        const userManagement = document.getElementById('user-management');
        if (userManagement) userManagement.classList.add('hidden');
    }
}