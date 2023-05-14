import { Lyrics } from 'src/model/entity/Lyrics';
import { Project } from 'src/model/entity/Project';
import { Track } from 'src/model/entity/Track';

export type GetProjectResponse = (Project & {
  lyrics: Lyrics[];
  track: (Track & { fileUrl: string | null; tabFileUrl: string | null })[];
  coverFileUrl: string | null;
})[];
