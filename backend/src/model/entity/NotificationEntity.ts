import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Lyrics, LyricsEntity } from './LyricsEntity';
import { Project, ProjectEntity } from './ProjectEntity';
import { Track, TrackEntity } from './TrackEntity';
import { User, UserEntity } from './UserEntity';

export enum NotificationType {
  ProjectStart = 'project-start',
  ProjectReject = 'project-reject',
  ProjectPublish = 'project-publish',
  ProjectUpdated = 'project-updated',
  CreationUpdated = 'creation-updated',
  CreationUploaded = 'new-creation-uploaded',
  NewParticipant = 'new-participant',
  InspiredApproved = 'inspired-approved',
  InspiredUnapproved = 'inspired-unapproved',
  PartnerReady = 'partner-ready',
  PartnerNotReady = 'partner-not-ready',
  Follow = 'follow',
  Like = 'like',
  Comment = 'comment',
}

export type Notification = {
  id: string;
  toUserId: string;
  toUser: User;
  isRead: boolean;
  type: NotificationType;
  fromUserId: string;
  fromUser: User;
  projectId: string | null;
  project: Project | null;
  lyricsId: string | null;
  trackId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'notification' })
export class NotificationEntity implements Notification {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'to_user_id' })
  toUserId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'to_user_id' })
  toUser!: User;

  @Column({ type: 'boolean', name: 'is_read' })
  isRead!: boolean;

  @Column({ type: 'varchar' })
  type!: NotificationType;

  @Column({ type: 'uuid', name: 'from_user_id' })
  fromUserId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'from_user_id' })
  fromUser!: User;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId!: string | null;

  @ManyToOne(() => ProjectEntity)
  @JoinColumn({ name: 'project_id' })
  project!: Project | null;

  @Column({ type: 'uuid', name: 'lyrics_id' })
  lyricsId!: string | null;

  @ManyToOne(() => LyricsEntity)
  @JoinColumn({ name: 'lyrics_id' })
  lyrics!: Lyrics | null;

  @Column({ type: 'uuid', name: 'track_id' })
  trackId!: string | null;

  @ManyToOne(() => TrackEntity)
  @JoinColumn({ name: 'track_id' })
  track!: Track | null;

  @Column({ type: 'timestamp', name: 'created_at', default: null })
  createdAt!: string;

  @Column({ type: 'timestamp', name: 'updated_at', default: null })
  updatedAt: string | null = null;

  @BeforeInsert()
  setDateCreated(): void {
    this.createdAt = new Date().toISOString();
  }

  @BeforeUpdate()
  setDateUpdated(): void {
    this.updatedAt = new Date().toISOString();
  }
}
