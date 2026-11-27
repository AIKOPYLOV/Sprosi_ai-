import type {FC} from 'react';
import {Composition} from 'remotion';
import template from './episodes/template.json';
import {StoryboardAnimatic} from './StoryboardAnimatic';
import {PromoCompositions} from './Episode001Promo';
import {Episode002Composition} from './Episode002Promo';
import {Pixel32DemoComposition} from './Pixel32Demo';
import type {Episode} from './episode-types';

export const RemotionRoot: FC = () => (
  <>
    <Composition
      id="StoryboardAnimatic"
      component={StoryboardAnimatic}
      durationInFrames={template.totalDurationSeconds * template.fps}
      fps={template.fps}
      width={1080}
      height={1920}
      defaultProps={{episode: template as Episode}}
    />
    <PromoCompositions />
    <Episode002Composition />
    <Pixel32DemoComposition />
  </>
);

