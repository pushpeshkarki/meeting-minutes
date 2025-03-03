export interface Message {
  id: string;
  content: string;
  timestamp: string;
}

export interface Transcript {
  id: string;
  text: string;
  timestamp: string;
}

export interface Block {
  id: string;
  type: string;
  content: string;
  color: string;
}

export interface Section {
  title: string;
  blocks: Block[];
}

export interface Summary {
  [key: string]: Section;
}

export interface SummaryResponse {
  title: string;
  content: string;
  timestamp: number;
  status: 'success' | 'error';
  error?: string;
  summary: Summary;
  raw_summary?: string;
}

export interface ApiResponse {
  message: string;
  num_chunks: number;
  data: any[];
}
