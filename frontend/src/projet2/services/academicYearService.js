// services/academicYearService.js
import api from './api' // ton axios instance

export const academicYearService = {
  getAll: () => api.get('/academic-years'),
  create: (data) => api.post('/academic-years', data),
  update: (id, data) => api.put(`/academic-years/${id}`, data),
  delete: (id) => api.delete(`/academic-years/${id}`),
  duplicate: (id) => api.post(`/academic-years/${id}/duplicate`),
  setCurrent: (id) => api.post(`/academic-years/${id}/set-current`)
}
