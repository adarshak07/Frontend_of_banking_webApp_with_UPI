
import api from "../api";

export const suggestionService = {
  contacts: (q, limit=10) => api.get('/suggest/contacts', { params: { q, limit } }).then(r => r.data?.data),
  operators: (q, limit=10) => api.get('/suggest/operators', { params: { q, limit } }).then(r => r.data?.data),
  plans: (operatorId) => api.get('/suggest/plans', { params: { operatorId } }).then(r => r.data?.data),
  movies: (q, limit=10) => api.get('/suggest/movies', { params: { q, limit } }).then(r => r.data?.data),
  restaurants: (q, limit=10) => api.get('/suggest/restaurants', { params: { q, limit } }).then(r => r.data?.data),
};
