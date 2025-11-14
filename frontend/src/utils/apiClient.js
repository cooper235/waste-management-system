import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Response interceptor for standardized error handling
apiClient.interceptors.response.use(
  (response) => {
    // Ensure response has expected structure
    if (!response.data) {
      return {
        success: false,
        message: "Empty response from server",
        data: null,
      }
    }
    return response.data
  },
  (error) => {
    const errorResponse = {
      success: false,
      message: "An error occurred",
      data: null,
      status: error.response?.status,
    }

    if (error.response) {
      errorResponse.message = error.response.data?.message || `Server error: ${error.response.status}`
      errorResponse.errors = error.response.data?.errors
    } else if (error.request) {
      errorResponse.message = "No response from server. Please check your connection."
    } else {
      errorResponse.message = error.message || "An unexpected error occurred"
    }

    return Promise.reject(errorResponse)
  },
)

// API methods with error handling
export const api = {
  // Bins
  getBins: () => apiClient.get("/api/bins"),
  getBinById: (id) => apiClient.get(`/api/bins/${id}`),
  createBin: (data) => apiClient.post("/api/bins", data),
  updateBin: (id, data) => apiClient.put(`/api/bins/${id}`, data),
  deleteBin: (id) => apiClient.delete(`/api/bins/${id}`),

  // Feedback
  submitFeedback: (data) => apiClient.post("/api/feedback", data),
  getFeedback: (params) => apiClient.get("/api/feedback", { params }),
  deleteFeedback: (id) => apiClient.delete(`/api/feedback/${id}`),
  getFeedbackStats: () => apiClient.get("/api/feedback/stats"),

  // Analytics
  getDashboardSummary: () => apiClient.get("/api/analytics/dashboard/summary"),
  getAnalytics: (params) => apiClient.get("/api/analytics", { params }),

  // Images
  uploadImage: (formData) =>
    apiClient.post("/api/images/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getImages: () => apiClient.get("/api/images"),
  deleteImage: (id) => apiClient.delete(`/api/images/${id}`),

  // Pending Actions
  getPendingActions: () => apiClient.get("/api/pending-actions"),
  createPendingAction: (data) => apiClient.post("/api/pending-actions", data),
  deletePendingAction: (id) => apiClient.delete(`/api/pending-actions/${id}`),

  // Team
  getTeamMembers: () => apiClient.get("/api/team"),

  // Waste Data
  getWasteDataByDate: (date) => apiClient.get(`/api/waste-data/date/${date}`),

  // Health Check
  healthCheck: () => apiClient.get("/api/health"),
}

export default apiClient
