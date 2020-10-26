import Axios, { AxiosRequestConfig } from 'axios'

export function get<T>(url: string, config?: AxiosRequestConfig) {
  return Axios.get<T>(url, {
    ...config,
    validateStatus: () => true
  })
}

export function post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
  return Axios.post<T>(url, data, {
    ...config,
    validateStatus: () => true
  })
}
