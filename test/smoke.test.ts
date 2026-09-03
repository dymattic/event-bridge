import { describe, expect, it } from 'vitest';
import { BUILD_ID } from '../src/shared/build-id';

describe('build-id', () => {
  it('is a non-empty string when __BUILD_ID__ is defined', () => {
    expect(typeof BUILD_ID).toBe('string');
    expect(BUILD_ID.length).toBeGreaterThan(0);
  });
});
