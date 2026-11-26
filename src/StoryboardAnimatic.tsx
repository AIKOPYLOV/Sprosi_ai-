import type {FC} from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Episode, StoryBeat} from './episode-types';

type Props = {episode: Episode};
const colors: Record<StoryBeat['arc'], string> = {hook:'#9fce57','rising-action':'#e59a32',conflict:'#d94b4b',return:'#1d9f8c','renewed-rise':'#e59a32',resolution:'#a34ac7'};

export const StoryboardAnimatic: FC<Props> = ({episode}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  let elapsed = 0;
  const activeIndex = episode.beats.findIndex((beat) => {
    const end = (elapsed + beat.durationSeconds) * fps;
    const active = frame < end;
    elapsed += beat.durationSeconds;
    return active;
  });
  const index = activeIndex === -1 ? episode.beats.length - 1 : activeIndex;
  const beat = episode.beats[index];
  const startSeconds = episode.beats.slice(0, index).reduce((sum, item) => sum + item.durationSeconds, 0);
  const localFrame = Math.max(0, frame - startSeconds * fps);
  const opacity = interpolate(localFrame, [0, 12], [0, 1], {extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.out(Easing.cubic)});
  const progress = Math.min(1, frame / (episode.totalDurationSeconds * fps));
  let beatStart = 0;

  return (
    <AbsoluteFill style={{backgroundColor:'#111317',color:'#f4f0e9',fontFamily:'Arial, sans-serif',padding:72}}>
      <div style={{display:'flex',justifyContent:'space-between',color:'#b8c1a0',fontSize:28,letterSpacing:3}}><span>СПРОСИ AI · 2D</span><span>АНИМАТИК · {episode.aspectRatio}</span></div>
      <div style={{height:8,marginTop:26,backgroundColor:'#30343a',borderRadius:8}}><div style={{height:'100%',width:`${progress*100}%`,backgroundColor:colors[beat.arc],borderRadius:8}} /></div>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',opacity}}>
        <div style={{fontSize:26,color:colors[beat.arc],textTransform:'uppercase',letterSpacing:5,fontWeight:700}}>{String(index+1).padStart(2,'0')} / {episode.beats.length} · {beat.label}</div>
        <h1 style={{fontSize:68,lineHeight:1.05,margin:'24px 0 20px',maxWidth:860}}>{episode.title}</h1>
        <div style={{border:`2px solid ${colors[beat.arc]}`,borderRadius:28,padding:42,backgroundColor:'#1b1e23',minHeight:520,display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
          <div><div style={{fontSize:22,color:'#9ca3ad',textTransform:'uppercase',letterSpacing:3}}>КАДР · {beat.durationSeconds} сек</div><p style={{fontSize:38,lineHeight:1.25,marginTop:24}}>{beat.visual}</p><p style={{fontSize:30,lineHeight:1.3,color:'#c6c9cf'}}>{beat.action}</p></div>
          <div style={{display:'flex',gap:14,alignItems:'center',color:'#c1c5cc',fontSize:23}}><span style={{width:14,height:14,borderRadius:99,backgroundColor:colors[beat.arc]}} /><span>КАМЕРА: {beat.camera}</span></div>
        </div>
        {beat.choice && <div style={{display:'flex',gap:18,marginTop:22}}>{[[beat.choice.optionA,beat.choice.riskA],[beat.choice.optionB,beat.choice.riskB]].map(([option,risk],optionIndex)=><div key={optionIndex} style={{flex:1,backgroundColor:'#252930',borderRadius:18,padding:20,fontSize:25}}><b>ВАРИАНТ {optionIndex===0?'А':'Б'}</b><br />{option}<br /><span style={{color:'#d3a58a',fontSize:20}}>Риск: {risk}</span></div>)}</div>}
      </div>
      <div style={{borderTop:'1px solid #41454c',paddingTop:22,display:'flex',justifyContent:'space-between',fontSize:22,color:'#9ca3ad'}}><span>{episode.logline}</span><span>{Math.floor(frame/fps)}s</span></div>
      {episode.beats.map((item)=>{const start=beatStart;beatStart+=item.durationSeconds;return item.dialogue.filter((line)=>line.audioFile).map((line)=><Audio key={line.id} src={staticFile(line.audioFile!)} from={(start+(line.offsetSeconds??0))*fps} premountFor={fps} />);})}
    </AbsoluteFill>
  );
};

