export type AudienceMode = 'single' | 'selected' | 'group' | 'stage' | 'track';
export type AudienceFilter = { mode: AudienceMode; value: string; selected: string[]; gender: 'all' | 'male' | 'female' };
export type AudienceStudent = { id: string; gender: string; authorized: boolean; groupId: string; stageId: string; trackId: string };
/** Synthetic preview selection only. Production membership and authorization remain server-owned. */
export function selectAudience<T extends AudienceStudent>(students: readonly T[], filter: AudienceFilter): T[] {
  const seen = new Set<string>();
  return students.filter(student => {
    if (!student.authorized || seen.has(student.id)) return false;
    const matches = filter.mode === 'single' ? student.id === filter.value : filter.mode === 'selected' ? filter.selected.includes(student.id) : filter.mode === 'group' ? student.groupId === filter.value : filter.mode === 'stage' ? student.stageId === filter.value : student.trackId === filter.value;
    if (!matches || (filter.gender !== 'all' && student.gender !== filter.gender)) return false;
    seen.add(student.id);
    return true;
  });
}
export function isSafeIntroVideo(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !url.port && ['www.youtube.com', 'youtube.com', 'youtu.be', 'vimeo.com', 'player.vimeo.com'].includes(url.hostname) && url.pathname !== '/';
  } catch { return false; }
}
