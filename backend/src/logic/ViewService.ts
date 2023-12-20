import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { LyricsAccess } from 'src/access/LyricsAccess';
import { ProjectAccess } from 'src/access/ProjectAccess';
import { TrackAccess } from 'src/access/TrackAccess';
import { ViewCreationExploreAccess } from 'src/access/ViewCreationExploreAccess';
import { Type } from 'src/model/constant/Creation';
import { bn } from 'src/util/bignumber';

/**
 * Service class for View
 */
@injectable()
export class ViewService {
  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(ViewCreationExploreAccess)
  private readonly viewCreationExploreAccess!: ViewCreationExploreAccess;

  @inject(ProjectAccess)
  private readonly projectAccess!: ProjectAccess;

  @inject(LyricsAccess)
  private readonly lyricsAccess!: LyricsAccess;

  @inject(TrackAccess)
  private readonly trackAccess!: TrackAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async beingViewed(id: string) {
    // validate
    const vc = await this.viewCreationExploreAccess.findOneByIdOrFail(id);
    const count = bn(vc.countView).plus(1).toString();

    if (vc.type === Type.Lyrics) {
      const lyrics = await this.lyricsAccess.findOneOrFailById(id);
      lyrics.countView = count;
      await this.lyricsAccess.save(lyrics);
    } else if (vc.type === Type.Track) {
      const track = await this.trackAccess.findOneOrFailById(id);
      track.countView = count;
      await this.trackAccess.save(track);
    } else if (vc.type === Type.Song) {
      const project = await this.projectAccess.findOneOrFailById(id);
      project.countView = count;
      await this.projectAccess.save(project);
    }
  }
}
