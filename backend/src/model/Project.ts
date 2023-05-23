import { Project } from './entity/Project';
import { ViewLyrics } from './entity/ViewLyrics';
import { ViewTrack } from './entity/ViewTrack';

export type DetailedProject = Project & {
  creation: (DetailedTrack | DetailedLyrics)[];
};

export type DetailedTrack = ViewTrack & {
  type: 'track';
  fileUrl: string | null;
  tabFileUrl: string | null;
  coverFileUrl: string | null;
};

export type DetailedLyrics = ViewLyrics & {
  type: 'lyrics';
  coverFileUrl: string | null;
};
