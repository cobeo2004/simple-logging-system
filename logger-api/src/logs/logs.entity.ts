import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'datetime' })
  timestamp: Date;

  @Index()
  @Column()
  level: string;

  @Column()
  message: string;

  @Index()
  @Column()
  source: string;

  @Column({ type: 'simple-json', nullable: true })
  data: Record<string, any>;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  receivedAt: Date;
}
