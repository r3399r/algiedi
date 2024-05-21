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

export type Caption = {
  id: string;
  name: string;
  infoId: string;
  info: Info;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'caption' })
export class CaptionEntity implements Caption {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'uuid', name: 'info_id' })
  infoId!: string;

  @ManyToOne(() => InfoEntity)
  @JoinColumn({ name: 'info_id' })
  info!: Info;

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
