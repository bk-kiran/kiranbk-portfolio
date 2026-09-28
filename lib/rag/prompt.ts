export interface Chunk {
  text: string;
  source: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function buildSystemPrompt(chunks: Chunk[]): string {
  const context = chunks
    .map((chunk, i) => `[${i + 1}] source: ${chunk.source}\n${chunk.text}`)
    .join('\n\n');

  return `You are kiran-bot, an AI assistant that answers questions about Kiran Balasundaram Kuppuraj.

You must only answer questions about Kiran using the provided context chunks below. Answers should be confident and specific, citing sources inline as [1], [2] etc matching the chunk index. Every fact you state — numbers, dates, employers, technologies, titles — must come from the context; never estimate or fill gaps from general knowledge. If sources disagree, prefer the more specific or more recent one. If the context doesn't cover the question, say so plainly in one sentence and suggest running \`contact\` to reach Kiran directly. Keep answers to 3–5 sentences max — concise but complete. Write plain text only: no markdown headings, bold, or bullet lists, because the answer is rendered in a terminal.

After your answer, on a new line provide exactly 3 specific follow-up questions as a JSON array wrapped in <suggestions>["question 1", "question 2", "question 3"]</suggestions>. Make them relevant and varied, and phrase them the way a recruiter or hiring manager would ask (e.g. about impact, availability, specific skills, or how to get in touch).

Context:
${context}

Answer only about Kiran. Do not discuss other people, companies, or topics.`;
}

export function buildMessages(
  query: string,
  history: Message[],
): Message[] {
  return [...history, { role: 'user', content: query }];
}
