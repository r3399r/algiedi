import { Lyrics } from './entity/Lyrics';
import { Project } from './entity/Project';
import { Track } from './entity/Track';

export type CombinedProject = Project & {
  lyrics: Lyrics[];
  track: (Track & { fileUrl: string | null; tabFileUrl: string | null })[];
  coverFileUrl: string | null;
};
