export type ArcBeat = 'hook' | 'rising-action' | 'conflict' | 'return' | 'renewed-rise' | 'resolution';

export type DialogueLine = {
  id: string;
  characterId: string;
  text: string;
  voiceName: string;
  delivery?: string;
  offsetSeconds?: number;
  audioFile?: string;
};

export type StoryBeat = {
  id: string;
  arc: ArcBeat;
  label: string;
  durationSeconds: number;
  visual: string;
  action: string;
  camera: string;
  dialogue: DialogueLine[];
  sound: string[];
  transition: string;
  choice?: {optionA: string; riskA: string; optionB: string; riskB: string};
};

export type Episode = {
  id: string;
  title: string;
  logline: string;
  fps: number;
  totalDurationSeconds: number;
  aspectRatio: '9:16';
  audienceAction: string;
  beats: StoryBeat[];
};

