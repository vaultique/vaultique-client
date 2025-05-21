import { computed, ref } from 'vue'

// TODO 补全方法
export enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
}

export const HTTP_METHOD_LIST: HTTP_METHOD[] = [HTTP_METHOD.GET, HTTP_METHOD.POST, HTTP_METHOD.PUT, HTTP_METHOD.DELETE, HTTP_METHOD.OPTIONS]

export default function useHttp() {
  const url = ref<string>('http://192.168.104.24/us-api/check/getCheckPatientList')
  const method = ref<HTTP_METHOD>(HTTP_METHOD.POST)
  const headers = ref<Record<string, string>>({
    'accept': 'application/json, text/plain, */*',
    'accept-encoding': 'gzip, deflate',
    'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
    'Content-Type': 'application/json',
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJoYnpuIiwidXBuIjoiQGhlYmluLXJvYm90cy5jb20iLCJncm91cHMiOlsiYWRtaW4iXSwibG9naW5Vc2VySWQiOiI0ZDM0NThkMS00NzkyLTYyYWItZGJmYi04NjI0ZGM2N2U4OTIiLCJpYXQiOjE3NDQzMzY2OTQsImV4cCI6MTc0NTIwMDY5NCwianRpIjoiZmZhYjQ2MTYtOWQ5OC00Mzk3LThiZGUtYTM3MGJjNmFhOTcwIn0.L95TlP6JKKiAyV7hzGJGO08vWZ4iiG96MHaMcK7-OoF5sG6hgu7VtlpIcxo5kt1Fk66gehBx-H0sce9jURsShePGTMHLfZEf8FYdepLZ58USXgbxhmoV0XdGBpiDWjM7iNkGMtXTaU5KQfI1Z4rvNNhMI5Nl4-sGw62JeEd9IaQ4NRX2xrN6e4xBi69OAJOcTUEh6tTBGMsnjx9ebTkS-1QchPvClN4Li0feUt59yC-XJ5QvyDcXjIo9eP558MYKl6o7ZIhf6LLZK8NIwkIvVWH0lId2eCYQbeoaVIqmNhTtcjuqTIyfyVQOTJ6JEMBQQIJfMkxOXRNivfHFTgK7ZQ',
    'track-id': 'WEB_b84fd05f-72ea-4a9a-982e-c9c75f76049f',
    'host': '192.168.104.24',
    'User-Agent': 'Vaultique/0.0.1',
  })
  // const body = ref<string>(JSON.stringify({ combineSearch: '', createTime: '' }))
  const body = ref<string>('')

  const response = ref('')

  const methodList: { label: string, value: string }[] = HTTP_METHOD_LIST.map(x => ({ label: x, value: x }))

  const request = computed<object>(() => {
    return {
      url: url.value,
      method: method.value,
      headers: headers.value,
      body: body.value,
    }
  })

  function setMethod(m: HTTP_METHOD): void {
    method.value = m
  }

  return { url, method, headers, body, response, methodList, request, setMethod }
}
