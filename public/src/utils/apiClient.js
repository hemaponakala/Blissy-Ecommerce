
import axios from 'axios';
 
const apiClient = axios.create({
  // baseURL: process.env.REACT_APP_API_BASE_URL, // optional
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
 
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        code: 'NETWORK_ERROR',
        message: error.message || 'Network error',
      });
    }
    const { status, data } = error.response;
    const message = (data && (data.message || data.error)) || `HTTP ${status}`;
    return Promise.reject({ code: `HTTP_${status}`, message, details: data });
  }
);
 
export { apiClient };

async function unwrap(promise) {
  const res = await promise;
  return res.data;
}
 
export function getRequest(url, config) {
  return unwrap(apiClient.get(url, config));
}
 
export function postRequest(url, body, config) {
  return unwrap(apiClient.post(url, body, config));
}
 
export function putRequest(url, body, config) {
  return unwrap(apiClient.put(url, body, config));
}
 
export function deleteRequest(url, config) {
  return unwrap(apiClient.delete(url, config));
}
 