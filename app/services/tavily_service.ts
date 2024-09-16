import axios, { type AxiosInstance } from 'axios'

export default class TavilyService {
  private readonly tavilyAPI: AxiosInstance
  constructor(private readonly apiKey: string) {
    this.tavilyAPI = axios.create({
      baseURL: 'https://api.tavily.com',
    })
  }

  async search(query: string) {
    try {
      const response = await this.tavilyAPI.post('/search', {
        query,
        api_key: this.apiKey,
        include_answer: true,
        max_results: 10,
      })
      return response.data
    } catch (error) {
      if (error.response) console.log('tavily search error:', error.response)
      else console.log('tavily service error: ', error)
    }
  }
}
