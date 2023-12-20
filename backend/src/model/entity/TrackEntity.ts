import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Info, InfoEntity } from './InfoEntity';
import { User, UserEntity } from './UserEntity';

export type Track = {
  id: string;
  userId: string;
  user: User;
  infoId: string;
  info: Info;
  projectId: string | null;
  inspiredId: string | null;
  countLike: string;
  countView: string;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'track' })
export class TrackEntity implements Track {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'uuid', name: 'info_id' })
  infoId!: string;

  @ManyToOne(() => InfoEntity)
  @JoinColumn({ name: 'info_id' })
  info!: Info;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId: string | null = null;

  @Column({ type: 'uuid', name: 'inspired_id', default: null })
  inspiredId: string | null = null;

  @Column({ type: 'int', name: 'count_like' })
  countLike = '0';

  @Column({ type: 'int', name: 'count_view' })
  countView = '0';

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
