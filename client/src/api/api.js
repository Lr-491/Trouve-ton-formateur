/**
 * Configuration centrale de l'API
 * Toutes les requêtes vers le backend passent par ici
 */

const API_URL = 'http://localhost:5000/api';

/**
 * Récupère le token depuis le localStorage
 */
const getToken = () => localStorage.getItem('token');

/**
 * Headers par défaut avec token si disponible
 */
const getHeaders = (withAuth = true) => {
  const headers = { 'Content-Type': 'application/json' };
  if (withAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Fonction centrale pour toutes les requêtes
 */
const request = async (endpoint, method = 'GET', body = null, withAuth = true) => {
  const options = {
    method,
    headers: getHeaders(withAuth),
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erreur serveur');
  }

  return data;
};

//------------------------------/ Auth /------------------------------/
export const authAPI = {
  register: (body) => request('/auth/register', 'POST', body, false),
  login: (body) => request('/auth/login', 'POST', body, false),
  me: () => request('/auth/me'),
};

//------------------------------/ Formateurs /------------------------------/
export const formateurAPI = {
  search: (params) => request(`/formateurs?${new URLSearchParams(params)}`),
  getProfil: (id) => request(`/formateurs/${id}`),
  updateProfil: (id, body) => request(`/formateurs/${id}`, 'PUT', body),
};

//------------------------------/ Institutions /------------------------------/
export const institutionAPI = {
  getProfil: (id) => request(`/institutions/${id}`),
  updateProfil: (id, body) => request(`/institutions/${id}`, 'PUT', body),
};

//------------------------------/ Offres /------------------------------/
export const offreAPI = {
  create: (body) => request('/offres', 'POST', body),
  getAll: () => request('/offres', 'GET', null, false),
  getOne: (id) => request(`/offres/${id}`, 'GET', null, false),
  update: (id, body) => request(`/offres/${id}`, 'PUT', body),
  delete: (id) => request(`/offres/${id}`, 'DELETE'),
  search: (params) => request(`/offres/search?${new URLSearchParams(params)}`),
};

//------------------------------/ Candidatures /-----------------------------/
export const candidatureAPI = {
  postuler: (body) => request('/candidatures', 'POST', body),
  getMesCandidatures: () => request('/candidatures/mes-candidatures'),
  getCandidaturesOffre: (offre_id) => request(`/candidatures/offre/${offre_id}`),
  updateStatut: (id, body) => request(`/candidatures/${id}`, 'PUT', body),
};

//------------------------------/ Formations /------------------------------/
export const formationAPI = {
  create: (body) => request('/formations', 'POST', body),
  getAll: () => request('/formations', 'GET', null, false),
  getOne: (id) => request(`/formations/${id}`, 'GET', null, false),
  update: (id, body) => request(`/formations/${id}`, 'PUT', body),
  delete: (id) => request(`/formations/${id}`, 'DELETE'),
};

//------------------------------/ Messages /------------------------------/
export const messageAPI = {
  envoyer: (body) => request('/messages', 'POST', body),
  getConversation: (user_id) => request(`/messages/${user_id}`),
  getConversations: () => request('/messages/conversations'),
};

//------------------------------/ Evaluations /------------------------------//
export const evaluationAPI = {
  noter: (body) => request('/evaluations', 'POST', body),
  getEvaluations: (user_id) => request(`/evaluations/${user_id}`, 'GET', null, false),
};

//------------------------------/ Admin /------------------------------//
export const adminAPI = {
  getUsers: () => request('/admin/users'),
  deleteUser: (id) => request(`/admin/users/${id}`, 'DELETE'),
  updateRole: (id, body) => request(`/admin/users/${id}/role`, 'PUT', body),
  getOffres: () => request('/admin/offres'),
  deleteOffre: (id) => request(`/admin/offres/${id}`, 'DELETE'),
  getStats: () => request('/admin/stats'),
};