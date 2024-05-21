import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Generated,
  OneToMany,
} from 'typeorm';
import { Caption, CaptionEntity } from './CaptionEntity';

export type Info = {
  id: string;
  name: string | null;
  description: string | null;
  theme: string | null;
  genre: string | null;
  language: string | null;
  caption: Caption[];
  coverFileUri: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'info' })
export class InfoEntity implements Info {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'varchar', default: null })
  name: string | null = null;

  @Column({ type: 'varchar', default: null })
  description: string | null = null;

  @Column({ type: 'varchar', default: null })
  theme: string | null = null;

  @Column({ type: 'varchar', default: null })
  genre: string | null = null;

  @Column({ type: 'varchar', default: null })
  language: string | null = null;

  @OneToMany(() => CaptionEntity, (caption) => caption.info)
  caption!: Caption[];

  @Column({ type: 'varchar', name: 'cover_file_uri', default: null })
  coverFileUri: string | null = null;

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
