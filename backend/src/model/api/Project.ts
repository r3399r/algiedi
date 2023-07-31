import { DetailedProject } from 'src/model/Project';
import { Chat } from './Ws';

export type GetProjectResponse = DetailedProject[];

export type PutProjectRequest = {
  name?: string;
  description?: string;
  theme?: string;
  genre?: string;
  language?: string;
  caption?: string;
};

export type PostProjectIdOriginalRequest =
  | {
      type: 'track';
      file: string;
      tabFile: string | null;
    }
  | {
      type: 'lyrics';
      lyrics: string;
    };

export type PutProjectIdCoverRequest = {
  file: string;
};

export type GetProjectIdChatResponse = Chat[];
