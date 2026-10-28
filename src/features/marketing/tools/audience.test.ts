import { describe, expect, it } from 'vitest';
import { marketingStudents } from '../fixtures';
import { isSafeIntroVideo, selectAudience, type AudienceFilter } from './audience';
const base: AudienceFilter = { mode: 'single', value: 'sample-a', selected: [], gender: 'all' };
describe('synthetic notification audience', () => {
  it.each([
    ['single', 'sample-a', [], ['sample-a']],
    ['selected', '', ['sample-a', 'sample-b', 'sample-a', 'sample-outside'], ['sample-a', 'sample-b']],
    ['group', 'group-a', [], ['sample-a', 'sample-b', 'sample-e']],
    ['stage', 'stage-b', [], ['sample-c', 'sample-d', 'sample-e']],
    ['track', 'start', [], ['sample-a', 'sample-b', 'sample-e']],
  ] as const)('selects %s without unauthorized recipients', (mode, value, selected, expected) => {
    expect(selectAudience(marketingStudents, { ...base, mode, value, selected: [...selected] }).map(s => s.id)).toEqual(expected);
  });
  it('intersects gender and excludes unknown without inference', () => {
    expect(selectAudience(marketingStudents, { ...base, mode: 'group', value: 'group-a', gender: 'female' }).map(s => s.id)).toEqual(['sample-b']);
    expect(selectAudience(marketingStudents, { ...base, mode: 'stage', value: 'stage-b', gender: 'male' }).map(s => s.id)).toEqual(['sample-c']);
  });
  it('deduplicates repeated source records', () => { expect(selectAudience([...marketingStudents, marketingStudents[0]], base)).toHaveLength(1); });
});
describe('video URL boundary', () => {
  it.each(['javascript:alert(1)', 'http://youtube.com/watch?v=x', 'https://youtube.com.evil.test/watch?v=x', '<iframe src="x">', 'https://name:pass@youtube.com/watch?v=x', 'https://youtube.com/'])('rejects %s', url => expect(isSafeIntroVideo(url)).toBe(false));
  it('accepts a known https provider without embedding it', () => expect(isSafeIntroVideo('https://www.youtube.com/watch?v=sample')).toBe(true));
});
