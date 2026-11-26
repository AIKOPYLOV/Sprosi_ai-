import type {FC, ReactNode} from 'react';
import {AbsoluteFill, Audio, Composition, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Hero, Mug, Phone, Room} from './Episode001Promo';
import voiceScript from './episodes/episode-002-voice.json';

const FPS = 30;
const SHOT = 4 * FPS;
const TOTAL = 10 * SHOT;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
const voice = voiceScript.lines.map((line) => line.text);

const Headline: FC<{children:ReactNode; top?:number; color?:string; size?:number}> = ({children,top=150,color='#fff3de',size=54}) => <div style={{position:'absolute',top,left:50,right:50,textAlign:'center',font:`1000 ${size}px/1.02 Arial`,letterSpacing:-1,color,textShadow:'0 5px 0 #191b22,0 12px 25px #090a0dcc',WebkitTextStroke:'1px #191b22'}}>{children}</div>;

const MiniStory: FC<{frame:number; resolution?:boolean}> = ({frame,resolution=false}) => {
  const cupLift=resolution?interpolate(frame,[0,35,90],[14,0,-8],clamp):0;
  const daughterTilt=resolution?interpolate(frame,[0,40,90],[8,0,-3],clamp):Math.sin(frame/8)*3;
  return <svg viewBox="0 0 480 620" style={{position:'absolute',top:380,right:48,width:470,height:610}}>
    <rect x="5" y="5" width="470" height="610" rx="32" fill="#f6dfbd" stroke="#171b22" strokeWidth="15"/>
    <path d="M22 350H458V460H22Z" fill="#b87e52" stroke="#171b22" strokeWidth="12"/>
    <path d="M35 382Q130 364 225 382T445 380M35 421Q130 402 225 421T445 420" fill="none" stroke="#805439" strokeWidth="5" opacity=".65"/>
    <g>
      <path d="M46 347Q60 253 90 233L148 233Q183 265 191 347Z" fill="#5e9d87" stroke="#171b22" strokeWidth="13"/>
      <path d="M92 244Q71 215 76 161Q81 99 130 92Q181 100 183 157Q186 211 156 244Z" fill="#49352e" stroke="#171b22" strokeWidth="12"/>
      <ellipse cx="130" cy="171" rx="48" ry="60" fill="#edc29c" stroke="#171b22" strokeWidth="10"/>
      <path d="M94 163Q110 149 123 163M139 163Q155 149 169 163" fill="none" stroke="#302a29" strokeWidth="7" strokeLinecap="round"/>
      <circle cx="110" cy="173" r="5" fill="#25334a"/><circle cx="153" cy="173" r="5" fill="#25334a"/>
      <path d="M117 198Q135 207 152 197" fill="none" stroke="#793d43" strokeWidth="6" strokeLinecap="round"/>
      <path d={`M174 282Q215 280 ${resolution?242:220} ${resolution?314:318}`} fill="none" stroke="#edc29c" strokeWidth="22" strokeLinecap="round"/>
    </g>
    <g transform={`rotate(${daughterTilt} 354 250)`}>
      <path d="M274 346Q286 273 315 269L393 269Q426 286 439 346Z" fill="#cf786b" stroke="#171b22" strokeWidth="13"/>
      <path d="M301 226Q288 186 302 139Q315 99 363 104Q417 105 423 154Q430 201 405 232Z" fill="#49352e" stroke="#171b22" strokeWidth="11"/>
      <ellipse cx="362" cy="202" rx="43" ry="51" fill="#f0c9a2" stroke="#171b22" strokeWidth="9"/>
      <circle cx="347" cy="199" r="5" fill="#25334a"/><circle cx="379" cy="199" r="5" fill="#25334a"/>
      {resolution?<path d="M345 219Q361 240 380 219" fill="none" stroke="#793d43" strokeWidth="6" strokeLinecap="round"/>:<path d="M346 224Q362 211 378 224" fill="none" stroke="#793d43" strokeWidth="6" strokeLinecap="round"/>}
      {resolution?<path d="M317 291Q299 269 292 255M405 291Q426 264 432 248" fill="none" stroke="#f0c9a2" strokeWidth="17" strokeLinecap="round"/>:<path d="M316 294L393 294" fill="none" stroke="#f0c9a2" strokeWidth="18" strokeLinecap="round"/>}
    </g>
    <g transform={`translate(0 ${cupLift})`}>
      <path d="M209 326Q207 314 221 314H274Q286 315 283 330L276 392Q274 403 261 403H230Q217 402 216 390Z" fill="#d8b08f" stroke="#171b22" strokeWidth="9"/>
      <path d="M278 328Q315 322 311 352Q308 376 280 371" fill="none" stroke="#171b22" strokeWidth="9"/>
      {resolution&&<path d="M247 337L253 349L267 351L257 361L260 374L247 367L235 374L237 361L227 351L241 349Z" fill="#35a99b" stroke="#17484a" strokeWidth="4"/>}
    </g>
    <path d="M265 47H431Q450 47 450 66V111Q450 130 431 130H339L316 150L319 130H265Q246 130 246 111V66Q246 47 265 47Z" fill="#fff9eb" stroke="#171b22" strokeWidth="8"/>
    <text x="348" y="99" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="25" fontWeight="900" fill="#252932">{resolution?'ЗВЁЗДОЧКА!':'НЕ ХОЧУ!'}</text>
  </svg>;
};

const Scene: FC<{index:number}> = ({index}) => {
  const frame=useCurrentFrame();
  const globalFrame=index*SHOT+frame;
  const inX=interpolate(frame,[0,12],[160,0],{...clamp,easing:Easing.out(Easing.cubic)});
  const subtitleWords=voice[index].split(/\s+/);
  const wordsPerGroup=Math.ceil(subtitleWords.length/3);
  const activeGroup=Math.min(2,Math.floor(frame/(SHOT/3)));
  const lockup=<div style={{position:'absolute',top:138,left:95,right:95,display:'flex',alignItems:'center',justifyContent:'center',gap:15,padding:'12px 18px',borderRadius:25,background:'#171b22ed',border:'4px solid #f0c449'}}><div style={{width:54,height:54,borderRadius:'50%',background:'#f4c84e',display:'grid',placeItems:'center'}}><Img src={staticFile('episodes/episode-001/academy-mark.svg')} style={{width:34,height:32}}/></div><div style={{font:'900 27px/1.1 Arial',color:'#fff8ec'}}>АКАДЕМИЯ СПРОСИ AI<br/><span style={{fontSize:18,fontWeight:600}}>sprosi-ai-mockup.vercel.app/app/</span></div></div>;

  const shots:ReactNode[]=[
    <><Room frame={globalFrame} night/><Hero frame={globalFrame} emotion="scared" x={-35} scale={1.65} speaking/><Headline top={132} size={47} color="#ffd54e">ЗАКАЗОВ ПОКА НЕТ</Headline></>,
    <><Room frame={globalFrame}/><Hero frame={globalFrame} emotion="thinking" x={-330+interpolate(frame,[0,SHOT-1],[0,135],clamp)} scale={.72} speaking walking={true} bottom={380}/><Mug frame={globalFrame} x={255} y={1050} tilt={-4} hiddenMark/><svg viewBox="0 0 300 540" style={{position:'absolute',right:105,top:555,width:300,height:540,overflow:'visible'}}><rect x="80" y="0" width="140" height="250" rx="28" fill="#e7e6df" stroke="#171b22" strokeWidth="18"/><rect x="96" y="37" width="108" height="175" rx="10" fill="#b9d0d0" stroke="#343944" strokeWidth="6"/><circle cx="150" cy="229" r="7" fill="#171b22"/><path d="M150 250V370 M150 355L53 515 M150 355L250 515 M150 355L150 520" fill="none" stroke="#171b22" strokeWidth="19" strokeLinecap="round"/><path d="M150 250V370 M150 355L53 515 M150 355L250 515 M150 355L150 520" fill="none" stroke="#bd8a4f" strokeWidth="8" strokeLinecap="round"/><path d="M53 515H250" stroke="#171b22" strokeWidth="13" strokeLinecap="round"/></svg></>,
    <><Room frame={globalFrame}/><Hero frame={globalFrame} emotion="thinking" x={-390+interpolate(frame,[0,SHOT-1],[0,120],clamp)} scale={.7} speaking walking={true} bottom={380}/><div style={{position:'absolute',top:365,right:50,width:465,height:570,border:'15px solid #171b22',borderRadius:34,background:'linear-gradient(145deg,#bdd8d0,#f2d2a3 55%,#cf765b)',boxShadow:'0 20px 40px #10131a88',opacity:interpolate(frame,[0,12],[0,1],{...clamp,easing:Easing.out(Easing.cubic)})}}><div style={{position:'absolute',top:25,left:23,right:23,color:'#26303b',font:'900 23px Arial'}}>ПРОБНЫЙ КАДР</div><div style={{position:'absolute',top:120,left:94,transform:'scale(.9) rotate(-7deg)'}}><Mug frame={globalFrame} generic/></div><div style={{position:'absolute',bottom:25,left:20,right:20,textAlign:'center',color:'#28333a',font:'900 25px Arial'}}>ПРОСТО ЧАШКА</div></div><Mug frame={globalFrame} x={245} y={1110} tilt={-6} hiddenMark/></>,
    <><Room frame={globalFrame} night/><Hero frame={globalFrame} emotion="scared" x={-170} scale={1.25} speaking/><div style={{position:'absolute',top:405,right:40,width:390,padding:'28px 24px',background:'#fff8e8',border:'7px solid #171b22',borderRadius:28,boxShadow:'0 18px 35px #1119',color:'#242831',font:'900 35px/1.1 Arial'}}>«Чем эта чашка особенная?»<div style={{position:'absolute',left:-18,bottom:50,width:30,height:30,background:'#fff8e8',borderLeft:'7px solid #171b22',borderBottom:'7px solid #171b22',transform:'rotate(45deg)'}}/></div><div style={{position:'absolute',top:740,left:725,width:94,height:94,borderRadius:'50%',background:'#45a99b',border:'7px solid #171b22',color:'white',display:'grid',placeItems:'center',font:'900 56px Arial'}}>К</div></>,
    <><Room frame={globalFrame} night/><Hero frame={globalFrame} emotion="thinking" x={-210} scale={.72} speaking walking={true} bottom={380}/><Mug frame={globalFrame} x={265} y={1000} tilt={interpolate(frame,[0,60,119],[-18,15,-5],clamp)} hiddenMark/><div style={{position:'absolute',top:425,right:55,width:410,height:210,display:'grid',placeItems:'center',borderRadius:28,background:'#fff5dc',border:'8px solid #171b22',color:'#242831',font:'1000 36px Arial',boxShadow:'0 17px 30px #1119'}}>КРУЧУ. МЕНЯЮ СВЕТ.</div></>,
    <><Room frame={globalFrame}/><div style={{position:'absolute',top:320,left:365,width:640,height:1100,padding:12,boxSizing:'border-box',border:'13px solid #171b22',borderRadius:40,background:'#e9e4dc',boxShadow:'0 22px 0 #111822,0 35px 50px #10131a99',transform:`translateX(${inX}px) rotate(-1deg)`}}><div style={{position:'absolute',top:10,left:'50%',width:70,height:9,borderRadius:8,background:'#171b22',transform:'translateX(-50%)',zIndex:2}}/><Img src={staticFile('episodes/episode-001/academy-course-mobile.png')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top',borderRadius:18}}/></div><Hero frame={globalFrame} emotion="thinking" x={-355+interpolate(frame,[0,SHOT-1],[0,70],clamp)} scale={.63} speaking walking={true} bottom={380}/><Headline top={174} color="#ffd54e" size={43}>УЧУСЬ НА СВОЕЙ ЗАДАЧЕ</Headline></>,
    <><Room frame={globalFrame} night/><Hero frame={globalFrame} emotion="thinking" x={-325+interpolate(frame,[0,SHOT-1],[0,110],clamp)} scale={.7} speaking walking={true} bottom={380}/><div style={{position:'absolute',top:370,right:60,width:445,height:600,border:'14px solid #171b22',borderRadius:32,background:'#e5b58d',boxShadow:'0 18px 34px #1119'}}><div style={{position:'absolute',top:20,left:20,right:20,font:'900 24px Arial',color:'#29323a'}}>ЗВЁЗДОЧКА НА ДНЕ</div><div style={{position:'absolute',top:100,left:104,transform:'scale(.88) rotate(-6deg)'}}><Mug frame={globalFrame}/></div><div style={{position:'absolute',bottom:22,left:22,right:22,font:'900 23px Arial',color:'#263038',textAlign:'center'}}>ДОЖДИСЬ РАЗГАДКИ</div></div></>,
    <><Room frame={globalFrame}/><Hero frame={globalFrame} emotion="thinking" x={-325+interpolate(frame,[0,SHOT-1],[0,110],clamp)} scale={.7} speaking walking={true} bottom={380}/><MiniStory frame={globalFrame}/></>,
    <><Room frame={globalFrame}/><Hero frame={globalFrame} emotion="happy" x={-215} scale={.82} speaking walking={true} bottom={380}/><div style={{position:'absolute',top:430,right:46,width:515,height:515,transform:`translateX(${inX}px) rotate(-2deg)`,background:'#f4d9ad',border:'14px solid #171b22',borderRadius:32,boxShadow:'0 19px 40px #1119'}}><div style={{position:'absolute',top:55,left:46,transform:'scale(.73) rotate(-7deg)'}}><Mug frame={globalFrame} tilt={180}/></div><div style={{position:'absolute',right:18,top:30,padding:'12px 18px',background:'#fff8e9',borderRadius:20,font:'900 26px Arial',color:'#252932'}}>НАЙДЕНА!</div></div><Headline top={180} color="#72e3bc" size={44}>ВОТ И РАЗГАДКА</Headline></>,
    <><Room frame={globalFrame}/><Hero frame={globalFrame} emotion="happy" x={-260} scale={.72} speaking walking={true} bottom={380}/><MiniStory frame={globalFrame} resolution/></>,
    <><Room frame={globalFrame}/><Hero frame={globalFrame} emotion="happy" x={-335+interpolate(frame,[0,SHOT-1],[0,125],clamp)} scale={.78} speaking walking={true} bottom={380}/><Mug frame={globalFrame} x={275} y={980} tilt={-4}/>{lockup}<div style={{position:'absolute',top:1120,left:190,right:190,padding:'25px 20px',textAlign:'center',color:'#20232a',background:'#fff8e9',borderRadius:22,font:'900 34px/1.1 Arial',boxShadow:'0 12px 25px #10131a55'}}>Учись создавать такие истории.<br/>В Академии «Спроси AI».</div></>,
  ];

  const push=interpolate(frame,[0,SHOT-1],[1,1.035],{...clamp,easing:Easing.inOut(Easing.cubic)});
  return <AbsoluteFill style={{overflow:'hidden',background:'#171b24'}}>
    <div style={{position:'absolute',inset:0,scale:push,translate:`${interpolate(frame,[0,SHOT-1],[8,-6],{...clamp,easing:Easing.inOut(Easing.cubic)})}px ${interpolate(frame,[0,SHOT-1],[6,-4],{...clamp,easing:Easing.inOut(Easing.cubic)})}px`}}>{shots[index]}</div>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 70%,#11172066 84%,#111720b3 100%)',pointerEvents:'none'}}/>
    <div style={{position:'absolute',top:1530,left:62,right:62,textAlign:'center',font:'900 48px/1.12 Arial, sans-serif',letterSpacing:-.4,color:'#fff8ee',WebkitTextStroke:'1.5px #151922',textShadow:'0 3px 8px #090a0dcc'}}>
      {subtitleWords.map((word,i)=>{const group=Math.floor(i/wordsPerGroup);const active=group===activeGroup;const tick=frame%Math.ceil(SHOT/3);return <span key={`${i}-${word}`} style={{display:'inline-block',marginRight:'.22em',color:active?'#ffd54e':'#fff8ee',translate:`0 ${active?interpolate(tick,[0,5],[5,0],{...clamp,easing:Easing.out(Easing.cubic)}):0}px`}}>{word}</span>;})}
    </div>
  </AbsoluteFill>;
};

export const Episode002Promo: FC = () => <>
  {Array.from({length:10},(_,index)=><Sequence key={index} from={index*SHOT} durationInFrames={SHOT} premountFor={FPS}><Scene index={index}/></Sequence>)}
  {voiceScript.lines.map((line)=><Sequence key={line.id} from={line.fromFrame} durationInFrames={SHOT} premountFor={FPS}><Audio src={staticFile(`audio/episode-002/edge/${line.id}.mp3`)} volume={0.96}/></Sequence>)}
  {[2,4,6,8].map((index)=><Sequence key={`whoosh-${index}`} from={index*SHOT-8} premountFor={FPS}><Audio src={staticFile('audio/episode-001/sfx/whoosh.wav')} volume={0.22}/></Sequence>)}
  <Sequence from={0} premountFor={FPS}><Audio src={staticFile('audio/episode-001/sfx/notification.wav')} volume={0.38}/></Sequence>
  <Sequence from={4*SHOT} premountFor={FPS}><Audio src={staticFile('audio/episode-001/sfx/tick.wav')} volume={0.22}/></Sequence>
  <Sequence from={9*SHOT} premountFor={FPS}><Audio src={staticFile('audio/episode-001/sfx/resolution.wav')} volume={0.25}/></Sequence>
</>;

export const Episode002Composition: FC = () => <Composition id="SprosiAcademyStoryPromo" component={Episode002Promo} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920}/>;
