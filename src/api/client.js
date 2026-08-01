import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api'||'https://meatby-alvi-business-tracker-backend.vercel.app/api'

const client = axios.create({
  baseURL: API_BASE_URL
})
client.defaults.headers.post['Content-Type'] = 'application/json'
client.defaults.headers.put['Content-Type'] = 'application/json'

export const entriesApi = {
  list: (params = {}) => client.get('/entries', { params }).then((r) => r.data),
  getById: (id) => client.get(`/entries/${id}`).then((r) => r.data),
  create: (payload) => client.post('/entries', payload).then((r) => r.data),
  update: (id, payload) => client.put(`/entries/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/entries/${id}`).then((r) => r.data),
  summary: (params = {}) => client.get('/entries/summary', { params }).then((r) => r.data)
}

export default client
