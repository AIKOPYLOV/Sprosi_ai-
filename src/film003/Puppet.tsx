import {useLayoutEffect, useMemo, useRef} from 'react';
import {staticFile, useDelayRender} from 'remotion';
import {buildRig, celSize, through, type Cel, type Performance} from './performance';

export type Track = {level: number[]; vowel: number[]; split: number; start: number; end: number};
type Key = [number, number, number, number, number, number, number];
// Fraction of shot, torso lean, head angle, forearm angle, reach, wrist height, brow.
// The eyes lead the turn; the elbow anticipates the tap and the wrist settles last.
const keys: Record<string, Key[]> = {
  buy: [[0,0,1,0,0,0,3],[.15,6,5,-9,-8,-8,2],[.26,9,6,2,3,8,-4],[.38,4,2,-4,-3,-3,-6],[.62,-17,-7,8,2,16,-8],[1,-12,8,11,0,18,4]],
  twice: [[0,-12,8,10,-2,12,8],[.17,2,-4,-11,-7,-19,-10],[.38,10,-7,-15,-4,-24,-7],[.69,19,2,7,10,5,0],[1,27,6,19,18,23,1]],
  intro: [[0,-4,-4,-8,-6,10,-4],[.19,12,-1,13,12,-17,-8],[.41,19,2,21,19,-6,-4],[.70,6,-4,9,3,0,0],[1,-8,1,-8,-5,21,5]],
  stop: [[0,8,1,4,6,0,0],[.14,-27,-8,-21,-16,14,-9],[.33,-22,-4,-16,-10,9,-5],[.62,-7,8,-4,2,23,8],[1,2,4,1,5,11,3]],
  course: [[0,-5,7,8,3,6,4],[.21,8,0,-8,-4,-8,-7],[.62,16,-4,-15,-8,-18,-6],[.77,20,1,2,5,4,-1],[1,11,0,-5,3,-4,0]],
  demo: [[0,-7,-2,-8,-9,9,-4],[.16,13,3,18,19,-18,-6],[.36,10,-3,10,7,-5,-3],[.49,21,4,23,20,-21,-5],[.73,6,-4,1,8,-7,-6],[1,13,3,12,13,-12,-2]],
  publish: [[0,-12,6,7,2,10,5],[.2,-4,4,-7,-6,-8,-9],[.46,-18,-6,-13,-11,-23,-6],[.66,19,7,11,15,9,0],[.78,7,-3,0,2,-4,-8],[1,4,-1,-4,1,-8,-4]],
  found: [[0,-8,7,6,3,11,4],[.15,9,-7,-15,-10,-18,-13],[.42,22,-4,-12,-3,-22,-8],[.7,16,3,-7,3,-11,0],[1,10,-1,-5,1,-12,-3]],
  question: [[0,4,2,2,0,9,-2],[.26,14,-5,18,16,-15,-8],[.65,6,4,9,8,-7,-4],[1,2,-1,-2,1,1,0]]
};
function performance(action: string, t: number, frame: number, fps: number, track?: Track): Performance {
  const curve = keys[action] ?? keys.demo;
  const times=curve.map(k=>k[0]), at=(index: number)=>through(t,times,curve.map(k=>k[index]));
  const blinkAt=action==='stop' ? [.13,.73] : action==='found' ? [.08,.59] : [.32,.84];
  let lid=0;
  for(const when of blinkAt) {
    const d=(t-when)*(track?.level.length ?? 82)/fps;
    if(d>=0 && d<.16) lid=Math.max(lid,through(d,[0,.052,.092,.16],[0,.99,.95,0]));
  }
  const get = (a: number[] | undefined, f: number) => (a?.[Math.max(0,Math.min((a?.length??1)-1,f))]??0)/100;
  const speaking=action !== 'found' && !!track;
  const level=speaking ? .19*get(track?.level,frame-1)+.71*get(track?.level,frame)+.1*get(track?.level,frame+1) : 0;
  const look=through(t,[0,.13,.17,.56,.60,.88],[0,0,-8,-8,1,-.5]);
  return {lean:at(1)+1.4*Math.sin(frame/fps*2.3),nod:at(2)+level*.8,lift:at(3),
    reach:at(4),wrist:at(5),brow:at(6),gazeX:look,gazeY:through(t,[0,.15,.19,.6,.65],[1,1,-3,-3,1]),
    lid,mouth:level,round:get(track?.vowel,frame),smile:action==='found'?through(t,[0,.24,.5,1],[0,2,15,12]):action==='question'?8:0};
}

type Props = {cel:Cel;action:string;x:number;y:number;scale:number;frame:number;frames:number;fps:number;track?:Track};
export function Puppet({cel,action,x,y,scale,frame,frames,fps,track}:Props) {
  const canvas=useRef<HTMLCanvasElement>(null);
  const rig=useRef<ReturnType<typeof buildRig> | null>(null);
  const {delayRender,continueRender,cancelRender}=useDelayRender();
  const pose=useMemo(()=>performance(action,frame/Math.max(1,frames-1),frame,fps,track),[action,frame,frames,fps,track]);
  const current=useRef(pose);
  current.current=pose;
  useLayoutEffect(()=>{
    const wait=delayRender('Loading character cel '+cel);
    let alive=true, finished=false;
    const done=()=>{if(!finished){continueRender(wait);finished=true;}};
    const img=new Image();
    img.onload=()=>{
      if(!alive) return;
      try {rig.current=buildRig(canvas.current!,img,cel);rig.current.draw(current.current);done();}
      catch(e){cancelRender(e instanceof Error?e:new Error(String(e)));}
    };
    img.onerror=()=>cancelRender(new Error('Missing acting cel '+cel));
    img.src=staticFile('episodes/episode-003/'+cel+'.webp');
    return ()=>{alive=false;rig.current?.release();rig.current=null;done();};
  },[cel,delayRender,continueRender,cancelRender]);
  useLayoutEffect(()=>{rig.current?.draw(pose);},[pose]);
  const {w,h,pad}=celSize(cel);
  return <canvas ref={canvas} width={w+2*pad} height={h+2*pad} style={{position:'absolute',
    left:x-pad*scale,top:y-pad*scale,width:(w+2*pad)*scale,height:(h+2*pad)*scale}}/>;
}
