/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DatabaseHealth } from './DatabaseHealth';
import type { ExternalAPIHealth } from './ExternalAPIHealth';
import type { NatsHealth } from './NatsHealth';
import type { OutboxHealth } from './OutboxHealth';
import type { RedisHealth } from './RedisHealth';
import type { SchedulerHealth } from './SchedulerHealth';
import type { StorageHealth } from './StorageHealth';
import type { WorkerRoleHealth } from './WorkerRoleHealth';
export type SystemHealthComponents = {
    database?: DatabaseHealth;
    external_apis?: ExternalAPIHealth;
    nats?: NatsHealth;
    outbox?: OutboxHealth;
    redis?: RedisHealth;
    scheduler?: SchedulerHealth;
    storage?: StorageHealth;
    workers?: Array<WorkerRoleHealth>;
};

