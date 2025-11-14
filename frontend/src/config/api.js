const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

export const apiClient = {
  baseURL: API_BASE_URL,

  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`)
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error(`GET ${endpoint}:`, error)
      throw error
    }
  },

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error(`POST ${endpoint}:`, error)
      throw error
    }
  },

  async postFormData(endpoint, formData) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error(`POST ${endpoint}:`, error)
      throw error
    }
  },

  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error(`DELETE ${endpoint}:`, error)
      throw error
    }
  },
}
