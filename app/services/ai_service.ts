import Anthropic from '@anthropic-ai/sdk'

export default class AIService {
  private readonly anthropic: Anthropic

  constructor(private readonly apiKey: string) {
    this.anthropic = new Anthropic({ apiKey: this.apiKey })
  }

  public async ask(body: Anthropic.Messages.MessageCreateParamsNonStreaming) {
    const msg = await this.anthropic.messages.create(body)
    return msg
  }
}
