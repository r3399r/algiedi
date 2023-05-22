import { Project } from './entity/Project';
import { ViewLyrics } from './entity/ViewLyrics';
import { ViewTrack } from './entity/ViewTrack';

export type CombinedProject = Project & {
  lyrics: (ViewLyrics & { coverFileUrl: string | null })[];
  track: (ViewTrack & {
    fileUrl: string | null;
    tabFileUrl: string | null;
    coverFileUrl: string | null;
  })[];
};
