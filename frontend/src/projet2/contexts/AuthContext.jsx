// import React, { createContext, useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const AuthContext = createContext(null);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Chargement initial depuis localStorage
//   useEffect(() => {
//     const savedToken = localStorage.getItem('token');
//     const savedUser = localStorage.getItem('user');

//     if (savedToken && savedUser) {
//       try {
//         const parsedUser = JSON.parse(savedUser);
//         setToken(savedToken);
//         setUser(parsedUser);
//       } catch (error) {
//         console.error('Erreur parsing user from localStorage', error);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       }
//     }
//     setLoading(false);
//   }, []);

//   // Configuration globale d'Axios
//   useEffect(() => {
//     axios.defaults.baseURL = 'http://localhost:8000';

//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//       delete axios.defaults.headers.common['Authorization'];
//     }
//   }, [token]);

//   // Rafraîchir le profil si token présent
//   const refreshProfile = async () => {
//     if (!token) return;

//     try {
//       const endpoint = user?.role === 'admin' 
//         ? '/api/admin/profile' 
//         : '/api/student/profile';

//       const response = await axios.get(endpoint);

//       if (response.data.success) {
//         const profileData = response.data.data;
        
//         // Fusion des données (au cas où certaines infos viennent de la relation student)
//         const updatedUser = {
//           ...user,
//           ...profileData,
//           role: user?.role || 'student',
//           name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || profileData.name,
//         };

//         setUser(updatedUser);
//         localStorage.setItem('user', JSON.stringify(updatedUser));
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         logout(); // Token invalide ou expiré
//       }
//       console.error('Erreur lors du rafraîchissement du profil:', error);
//     }
//   };

//   // Appel au montage si token présent
//   useEffect(() => {
//     if (token && user) {
//       refreshProfile();
//     } else if (token && !user) {
//       // Cas rare : token présent mais pas d'user → on force le refresh
//       refreshProfile();
//     } else {
//       setLoading(false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);


//   useEffect(() => {
//   const savedToken = localStorage.getItem('token');
//   if (savedToken) {
//     setToken(savedToken);
//     axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
//     console.log('Token chargé et appliqué à Axios:', savedToken);
//   }
//   setLoading(false);
//    }, []);


//   // Fonction de connexion
//   const login = async (email, password, role = 'parent') => {
//     try {
//       setLoading(true);

//       const endpoint = role === 'admin' ? '/api/admin/login' : '/api/auth/login';

//       const response = await axios.post(endpoint, { email, password });

//       if (response.data.success) {
//         const { token: authToken, user: userData } = response.data.data;

//         const userWithRole = {
//           ...userData,
//           role,
//         };

//         // Stockage sécurisé
//         localStorage.setItem('token', authToken);
//         localStorage.setItem('user', JSON.stringify(userWithRole));

//         setToken(authToken);
//         setUser(userWithRole);

//         toast.success('Connexion réussie !');
//         return { success: true, user: userWithRole };
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Identifiants incorrects';
//       toast.error(message);
//       return { success: false, message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fonction de déconnexion
//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');

//     setToken(null);
//     setUser(null);

//     delete axios.defaults.headers.common['Authorization'];

//     toast.success('Déconnexion réussie');
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     isAuthenticated: !!token && !!user,
//     login,
//     logout,
//     refreshProfile,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };