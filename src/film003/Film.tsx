import {createContext, useContext, useEffect, useState, type FC, type ReactNode} from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, staticFile, useCurrentFrame, useDelayRender, useVideoConfig} from 'remotion';
import edit from '../episodes/episode-003-cuts.json';
import {Course, EditBay, Guide, Milestones, Posting, Purchase, Spreadsheet} from './Inserts';
import {Puppet, type Track} from './Puppet';
import {through} from './performance';
import {art, Camera, cream, dark, Desk, fill, ink, mono, namedFont, Room, Scanner, TableTop, Tripod, Walking} from './World';

type Provider='elevenlabs'|'google-public'|'google';
type Cut=typeof edit.cuts[number];
type Context={cut:Cut;f:number;fps:number;s:number;p:number;track:Track};
const ShotContext=createContext<Context|null>(null);
const useShot=()=>useContext(ShotContext)!;
const duration=edit.cuts.reduce((sum,c)=>sum+c.frames,0);
const byId=Object.fromEntries(edit.cuts.map((cut,i)=>[cut.id,{cut,from:edit.cuts.slice(0,i).reduce((s,c)=>s+c.frames,0)}]));

type ActorProps = {pose:'phone'|'explain';x:number;y:number;scale:number;back?:number;tripod?:boolean;rec?:boolean;children?:ReactNode};
function ActorShot({pose,x,y,scale,back=660,tripod=false,rec=false,children}:ActorProps) {
  const {cut,f,fps,p,track}=useShot();
  return <Camera zoom={1+through(p,[0,.92],[.025,.068])} origin="53% 40%">
    <Room zoom={scale>.8?1.25:1.08} dx={through(p,[0,1],[5,-3])}/>
    <Puppet cel={pose} x={x} y={y} scale={scale} fps={fps} frames={cut.frames} frame={f} action={cut.id} track={track}/>
    <Desk back={back}/>
    {tripod&&<Tripod x={427} y={back-119} scale={.88}/>}
    {rec&&<svg viewBox="0 0 540 960" style={fill}>
      <path d="M49 135v-27h32m381 0h30v26" fill="none" stroke="#f6e6c8" strokeWidth="2" opacity=".8"/>
      <circle cx="66" cy="130" r="5" fill="#e46651"/><text x="78" y="135" fill={cream} fontFamily={mono} fontSize="15">REC</text>
    </svg>}
    {children}
  </Camera>;
}
function ReceiptScene() {
  const {s,p}=useShot();
  return s<2.70?<Camera zoom={1.025+.035*p} origin="49% 36%"><Purchase s={s}/></Camera>:
    <ActorShot pose="phone" x={-166} y={38} scale={1.02} back={718}/>;
}
function WalkScene() {
  const {f,fps,cut}=useShot();
  return <Walking frame={f} fps={fps} frames={cut.frames}/>;
}
function BookScene() {
  const {s,p}=useShot();
  return <Camera zoom={1.01+p*.045} origin="49% 41%"><Guide s={s}/></Camera>;
}
function DuplicateScene() {
  const {s,p}=useShot();
  return <Camera zoom={1.019+through(p,[0,.5,1],[0,.04,.085])} origin="48% 44%"><Scanner s={s}/></Camera>;
}
function RecognizeScene() {
  return <ActorShot pose="phone" x={2} y={125} scale={.65} back={666}/>;
}
function BadTakeScene() {
  return <ActorShot pose="explain" x={19} y={129} scale={.63} back={664} rec/>;
}
function StopScene() {
  return <ActorShot pose="explain" x={-194} y={31} scale={1.07} back={706}/>;
}
function CourseScene() {
  const {s,p}=useShot();
  return <Camera zoom={1.012+through(p,[0,.57,.96],[0,.062,.068])} origin="49% 35%"><Course s={s}/></Camera>;
}
function EditingScene() {const {s}=useShot();return <EditBay s={s}/>;}
function NewTakeScene() {
  const {s}=useShot();
  return s<1.38?<Camera zoom={1.17} origin="47% 39%"><Scanner s={s} repeat/></Camera>:
    <ActorShot pose="explain" x={-4} y={88} scale={.71} back={677} tripod/>;
}
function RuleScene() {const {s}=useShot();return <Spreadsheet s={s}/>;}
function PublishScene() {const {s,p}=useShot();return <Camera zoom={1.015+.032*p} origin="53% 63%"><Posting s={s}/></Camera>;}

function VoiceMessage() {
  const {f,track,p}=useShot();
  const inView=through(p,[0,.12],[0,1]);
  return <svg viewBox="0 0 540 960" style={{...fill,opacity:inView}}>
    <g transform={`translate(45 ${87-12*(1-inView)}) rotate(-2)`}>
      <path d="M13 7H240Q253 7 253 21v51q0 13-14 13H36L18 97V85h-5Q0 85 0 72V21Q0 7 13 7Z" fill="#f7eed7" stroke={ink} strokeWidth="2.4"/>
      <text x="17" y="34" fontSize="15" fontFamily={namedFont} fill="#3f594b">Лена · голосовое</text>
      <circle cx="29" cy="59" r="12" fill="#435f51"/><path d="M26 53l9 6-9 6Z" fill={cream}/>
      {Array.from({length:36},(_,i)=>{
        const v=track.level[Math.min(track.level.length-1,Math.floor(i*track.level.length/36))]??0;
        const h=4+v*.20;
        return <rect key={i} x={52+i*4.8} y={59-h*.5} width="2.8" height={h} rx="1.4"
          fill={i/36 < f/track.level.length?'#51785c':'#b9baa3'}/>;
      })}
    </g>
  </svg>;
}
function AnswerScene() {
  return <ActorShot pose="phone" x={-38} y={154} scale={.67} back={675}><VoiceMessage/></ActorShot>;
}
function SavedScene() {const {s}=useShot();return <Milestones s={s}/>;}
function EndingScene() {
  const {s}=useShot();
  if(s<.88) return <ActorShot pose="explain" x={-155} y={54} scale={.98} back={695}/>;
  const land=through(s,[.88,1.21,1.43],[-90,4,0]);
  return <><TableTop/><svg viewBox="0 0 540 960" style={fill}>
    <g transform={`translate(43,${200+land}) rotate(-3 220 200)`}>
      <path d="M9 15l446 2-4 410-445 4Z" fill="#4f3b2a" opacity=".44"/>
      <path d="M0 0l448 2-3 411-446 3Z" fill="#f5ead0" stroke="#523f30" strokeWidth="2.4"/>
      <path d="M0 14L449 17M1 395L445 394" stroke="#bda990" strokeWidth="1.4" strokeDasharray="5 5"/>
      <image href={staticFile('brand/academy-mark.svg')} x="29" y="49" width="66" height="61"/>
      <text x="117" y="77" fontFamily={namedFont} fontSize="18" fill="#665f50">Академия</text>
      <text x="115" y="115" fontFamily={namedFont} fontSize="40" fontWeight="700" fill={dark}>Спроси AI</text>
      <path d="M29 150H415" stroke="#b9ad97" strokeWidth="1.6"/>
      <text x="29" y="210" fontFamily={namedFont} fontSize="33" fontWeight="700" fill={ink}>AI для брендов</text>
      <text x="30" y="248" fontFamily={namedFont} fontSize="19" fill="#625f50">Видео, аватары и озвучка</text>
      <rect x="28" y="279" width="387" height="57" rx="7" fill="#365746"/>
      <text x="48" y="315" fontFamily={namedFont} fontSize="22" fill={cream}>Открыть каталог курсов</text>
      <path d="M376 308h21m-8-8 9 8-9 8" stroke={cream} strokeWidth="2.2" fill="none"/>
      <text x="29" y="369" fontFamily={mono} fontSize="15" fill="#55564c">sprosi-ai-mockup.vercel.app/app/</text>
    </g>
  </svg></>;
}

function Caption() {
  const {cut,track,f}=useShot();
  if(f<track.start || f>=track.end) return null;
  const text=cut.captions[f<track.split?0:1];
  return <div style={{position:'absolute',left:40,right:53,top:758,height:100,display:'flex',alignItems:'center',justifyContent:'center',
    fontFamily:namedFont,fontWeight:700,fontSize:25,lineHeight:1.19,textAlign:'center',color:'#fff7e4',
    WebkitTextStroke:'3.6px #242421',paintOrder:'stroke fill',textShadow:'0px 2px 1px #242421',textWrap:'balance'}}>{text}</div>;
}
function Plate({cut,track,children}:{cut:Cut;track:Track;children:ReactNode}) {
  const f=useCurrentFrame(), {fps,width}=useVideoConfig();
  return <ShotContext.Provider value={{cut,f,fps,s:f/fps,p:f/Math.max(1,cut.frames-1),track}}>
    <div style={{position:'absolute',top:0,left:0,width:540,height:960,transformOrigin:'0 0',transform:`scale(${width/540})`,overflow:'hidden',background:'#334344',fontFamily:namedFont}}>
      {children}
      <div style={{...fill,background:'linear-gradient(to bottom, transparent 74%, rgba(20,27,29,.02) 78%, rgba(20,27,29,.18) 92%, rgba(20,27,29,.21))',pointerEvents:'none'}}/>
      <Caption/>
    </div>
  </ShotContext.Provider>;
}
function Reel({provider}:{provider:Provider}) {
  const [timing,setTiming]=useState<Record<string,Track>|null>(null);
  const {fps}=useVideoConfig();
  const {delayRender,continueRender,cancelRender}=useDelayRender();
  const folder='audio/episode-003/'+provider+'/';
  useEffect(()=>{
    const wait=delayRender('Loading night-shift dialogue and drawings');
    let alive=true,done=false;
    const finish=()=>{if(!done){done=true;continueRender(wait);}};
    const loadImage=(url:string)=>new Promise<void>((ok,err)=>{const im=new Image();im.onload=()=>ok();im.onerror=()=>err(Error('Missing art '+url));im.src=url;});
    const font = new FontFace('FilmSans',`url("${art('captions.ttf')}")`,{weight:'700'});
    const sources=['room.webp','wood.webp','walk.webp','scanner.webp','scan-room.webp','reader.webp','phone.webp','explain.webp'].map(art);
    Promise.all([
      fetch(staticFile(folder+'acting.json')).then(r=>{if(!r.ok)throw Error('Run mix-episode-003.py for '+provider);return r.json() as Promise<Record<string,Track>>;}),
      font.load().then(f=>document.fonts.add(f)),
      ...[...sources,staticFile('episodes/episode-001/academy-course-mobile.png'),staticFile('brand/academy-mark.svg')].map(loadImage)
    ]).then(([data])=>{if(alive)setTiming(data as Record<string,Track>);finish();})
      .catch(e=>{if(alive)cancelRender(e);});
    return ()=>{alive=false;finish();};
  },[folder,provider,delayRender,continueRender,cancelRender]);
  if(!timing) return null;
  const shot=(id:string,inside:ReactNode)=>{
    const {cut,from}=byId[id];
    return <Sequence name={id} from={from} durationInFrames={cut.frames} premountFor={fps}>
      <Plate cut={cut} track={timing[id]}>{inside}</Plate>
    </Sequence>;
  };
  return <AbsoluteFill style={{background:'#334344'}}>
    {shot('buy',<ReceiptScene/>)}{shot('shift',<WalkScene/>)}{shot('secret',<BookScene/>)}
    {shot('box',<DuplicateScene/>)}{shot('twice',<RecognizeScene/>)}{shot('intro',<BadTakeScene/>)}
    {shot('stop',<StopScene/>)}{shot('course',<CourseScene/>)}{shot('recut',<EditingScene/>)}
    {shot('demo',<NewTakeScene/>)}{shot('rule',<RuleScene/>)}{shot('publish',<PublishScene/>)}
    {shot('found',<AnswerScene/>)}{shot('reply',<SavedScene/>)}{shot('question',<EndingScene/>)}
    <Audio src={staticFile(folder+'mix.wav')}/>
  </AbsoluteFill>;
}
export const FilmCompositions:FC=()=> <>
  <Composition id="NightShiftElevenLabs" component={Reel} defaultProps={{provider:'elevenlabs' as Provider}} width={1080} height={1920} fps={edit.fps} durationInFrames={duration}/>
  <Composition id="NightShiftGoogle" component={Reel} defaultProps={{provider:'google-public' as Provider}} width={1080} height={1920} fps={edit.fps} durationInFrames={duration}/>
  <Composition id="NightShiftGemini" component={Reel} defaultProps={{provider:'google' as Provider}} width={1080} height={1920} fps={edit.fps} durationInFrames={duration}/>
</>;
