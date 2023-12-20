import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Status } from 'src/model/constant/Project';
import { Info, InfoEntity } from './InfoEntity';

export type Project = {
  id: string;
  status: Status;
  infoId: string;
  info: Info;
  countLike: string;
  countView: string;
  startedAt: string | null;
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'project' })
export class ProjectEntity implements Project {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  status!: Status;

  @Column({ type: 'uuid', name: 'info_id' })
  infoId!: string;

  @ManyToOne(() => InfoEntity)
  @JoinColumn({ name: 'info_id' })
  info!: Info;

  @Column({ type: 'int', name: 'count_like' })
  countLike = '0';

  @Column({ type: 'int', name: 'count_view' })
  countView = '0';

  @Column({ type: 'timestamp', name: 'started_at', default: null })
  startedAt!: string;

  @Column({ type: 'timestamp', name: 'published_at', default: null })
  publishedAt!: string;

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
