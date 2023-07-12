import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { Status } from 'src/model/constant/Project';

export type Project = {
  id: string;
  status: Status;
  infoId: string | null;
  startedAt: string | null;
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

  @Column({ type: 'uuid', name: 'info_id', default: null })
  infoId: string | null = null;

  @Column({ type: 'timestamp', name: 'started_at', default: null })
  startedAt!: string;

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
