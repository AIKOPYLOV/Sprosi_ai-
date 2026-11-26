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

const Scene: FC<{index:number}> = ({index}) => {
  const frame=useCurrentFrame();
  const globalFrame=index*SHOT+frame;
  const inX=interpolate(frame,[0,12],[160,0],{...clamp,easing:Easing.out(Easing.cubic)});
  const subtitleWords=voice[index].split(/\s+/);
  const wordsPerGroup=Math.ceil(subtitleWords.length/3);
  const activeGroup=Math.min(2,Math.floor(frame/(SHOT/3)));
  const lockup=<div style={{position:'absolute',top:138,left:95,right:95,display:'flex',alignItems:'center',justifyContent:'center',gap:15,padding:'12px 18px',borderRadius:25,background:'#171b22ed',border:'4px solid #f0c449'}}><div style={{width:54,height:54,borderRadius:'50%',background:'#f4c84e',display:'grid',placeItems:'center'}}><Img src={staticFile('episodes/episode-001/academy-mark.svg')} style={{width:34,height:32}}/></div><div style={{font:'900 27px/1.1 Arial',color:'#fff8ec'}}>АКАДЕМИЯ СПРОСИ AI<br/><span style={{fontSize:18,fontWeight:600}}>sprosi-ai-mockup.vercel.app/app/</span></div></div>;

  const shots:ReactNode[]=[
    <><Room frame={globalFrame} night/><Hero frame={globalFrame} emotion="scared" x={-35} scale={1.65} speaking/><Headline top={132} size={47} color="#ffd54e">ЗАПУСК ЧЕРЕЗ НЕДЕЛЮ</Headline></>,
    <><Room frame={globalFrame}/><Hero frame={globalFrame} emotion="thinking" x={-230} scale={.75} speaking/><Phone frame={globalFrame} message="Нужен ролик к запуску!" tilt={-2}/><div style={{position:'absolute',top:1020,left:120,right:120,padding:25,border:'6px solid #171b22',borderRadius:22,background:'#fff5df',textAlign:'center',font:'900 36px Arial',color:'#20242b'}}>ПУСТОЙ ЛИСТ СЦЕНАРИЯ</div></>,
    <><Room frame={globalFrame}/><Hero frame={globalFrame} emotion="thinking" x={-270} scale={.67} speaking/><div style={{position:'absolute',top:365,right:50,width:465,height:570,border:'15px solid #171b22',borderRadius:34,background:'linear-gradient(145deg,#bdd8d0,#f2d2a3 55%,#cf765b)',boxShadow:'0 20px 40px #10131a88',opacity:interpolate(frame,[0,12],[0,1],{...clamp,easing:Easing.out(Easing.cubic)})}}><div style={{position:'absolute',top:25,left:23,right:23,color:'#26303b',font:'900 23px Arial'}}>КРАСИВЫЙ ШАБЛОН</div><div style={{position:'absolute',top:120,left:94,transform:'scale(.9) rotate(-7deg)'}}><Mug frame={globalFrame} generic/></div><div style={{position:'absolute',bottom:25,left:20,right:20,textAlign:'center',color:'#28333a',font:'900 25px Arial'}}>НО НЕ МОЯ ИСТОРИЯ</div></div><Mug frame={globalFrame} x={230} y={1110} tilt={-6}/></>,
    <><Room frame={globalFrame} night/><Hero frame={globalFrame} emotion="scared" x={-170} scale={1.25} speaking/><div style={{position:'absolute',top:405,right:40,width:390,padding:'28px 24px',background:'#fff8e8',border:'7px solid #171b22',borderRadius:28,boxShadow:'0 18px 35px #1119',color:'#242831',font:'900 35px/1.1 Arial'}}>«Чем эта чашка особенная?»<div style={{position:'absolute',left:-18,bottom:50,width:30,height:30,background:'#fff8e8',borderLeft:'7px solid #171b22',borderBottom:'7px solid #171b22',transform:'rotate(45deg)'}}/></div><div style={{position:'absolute',top:740,left:725,width:94,height:94,borderRadius:'50%',background:'#45a99b',border:'7px solid #171b22',color:'white',display:'grid',placeItems:'center',font:'900 56px Arial'}}>К</div></>,
    <><Room frame={globalFrame} night/><Hero frame={globalFrame} emotion="thinking" x={-45} scale={1.85} speaking/><div style={{position:'absolute',top:365,right:55,font:'1000 150px Arial',color:'#ffd54e',textShadow:'0 10px 0 #171b22,0 18px 25px #111',transform:`translateY(${interpolate(frame,[0,12],[80,0],{...clamp,easing:Easing.out(Easing.cubic)})}px)`}}>?</div></>,
    <><Room frame={globalFrame}/><div style={{position:'absolute',top:320,left:365,width:640,height:1100,padding:12,boxSizing:'border-box',border:'13px solid #171b22',borderRadius:40,background:'#e9e4dc',boxShadow:'0 22px 0 #111822,0 35px 50px #10131a99',transform:`translateX(${inX}px) rotate(-1deg)`}}><div style={{position:'absolute',top:10,left:'50%',width:70,height:9,borderRadius:8,background:'#171b22',transform:'translateX(-50%)',zIndex:2}}/><Img src={staticFile('episodes/episode-001/academy-course-mobile.png')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top',borderRadius:18}}/></div><Hero frame={globalFrame} emotion="thinking" x={-355} scale={.63} speaking/><Headline top={174} color="#ffd54e" size={43}>УЧУСЬ НА СВОЕЙ ЗАДАЧЕ</Headline></>,
    <><Room frame={globalFrame} night/><Hero frame={globalFrame} emotion="thinking" x={-265} scale={.7} speaking/><div style={{position:'absolute',top:370,right:60,width:445,height:600,border:'14px solid #171b22',borderRadius:32,background:'#e5b58d',boxShadow:'0 18px 34px #1119'}}><div style={{position:'absolute',top:20,left:20,right:20,font:'900 24px Arial',color:'#29323a'}}>ЧАШКА МИРЫ</div><div style={{position:'absolute',top:100,left:104,transform:'scale(.88) rotate(-6deg)'}}><Mug frame={globalFrame}/></div><div style={{position:'absolute',bottom:22,left:22,right:22,font:'900 23px Arial',color:'#263038',textAlign:'center'}}>ЗАМЕТЬ БИРЮЗОВУЮ МЕТКУ</div></div></>,
    <><Room frame={globalFrame}/><Hero frame={globalFrame} emotion="happy" x={-275} scale={.72} speaking/><div style={{position:'absolute',top:430,right:55,display:'grid',gap:22}}>{['ЦЕЛЬ','ПРЕПЯТСТВИЕ','ЗАГАДКА'].map((label,i)=><div key={label} style={{width:400,padding:'22px 24px',borderRadius:20,background:['#e9b64c','#d77358','#52a191'][i],border:'6px solid #171b22',color:'#fff',font:'1000 38px Arial',boxShadow:'0 12px 0 #151921',transform:`translateX(${interpolate(frame,[i*5,12+i*5],[170,0],{...clamp,easing:Easing.out(Easing.cubic)})}px)`}}>{label}</div>)}</div></>,
    <><Room frame={globalFrame}/><Hero frame={globalFrame} emotion="happy" x={-215} scale={.82} speaking/><div style={{position:'absolute',top:430,right:46,width:515,height:515,transform:`translateX(${inX}px) rotate(-2deg)`,background:'#f4d9ad',border:'14px solid #171b22',borderRadius:32,boxShadow:'0 19px 40px #1119'}}><div style={{position:'absolute',top:55,left:46,transform:'scale(.73) rotate(-7deg)'}}><Mug frame={globalFrame}/></div><div style={{position:'absolute',right:18,top:30,padding:'12px 18px',background:'#fff8e9',borderRadius:20,font:'900 26px Arial',color:'#252932'}}>СВОЯ ДЕТАЛЬ</div></div><Headline top={180} color="#72e3bc" size={44}>ИСТОРИЯ УЖЕ ДВИЖЕТСЯ</Headline></>,
    <><Room frame={globalFrame}/><Hero frame={globalFrame} emotion="happy" x={-260} scale={.72} speaking/><div style={{position:'absolute',top:400,right:50,width:470,height:650,display:'grid',gridTemplateRows:'1fr 1fr 1fr',gap:12,transform:`translateX(${inX}px)`}}>{['ГЕРОЙ','ВЫБОР','РАЗГАДКА'].map((label,i)=><div key={label} style={{position:'relative',display:'grid',placeItems:'center',background:['#e9b64c','#d77358','#52a191'][i],border:'6px solid #171b22',borderRadius:22,color:'#fff',font:'1000 34px Arial',transform:`rotate(${i-1}deg)`}}>{label}{i<2&&<div style={{position:'absolute',bottom:-32,width:8,height:38,background:'#171b22'}}/>}</div>)}</div><Headline top={160} color="#72e3bc" size={43}>КАЖДОЕ ДЕЙСТВИЕ ВЕДЁТ ДАЛЬШЕ</Headline></>,
    <><Room frame={globalFrame}/><Hero frame={globalFrame} emotion="happy" x={-265} scale={.78} speaking/><Mug frame={globalFrame} x={275} y={980} tilt={-4}/>{lockup}<div style={{position:'absolute',top:1120,left:190,right:190,padding:'25px 20px',textAlign:'center',color:'#20232a',background:'#fff8e9',borderRadius:22,font:'900 34px/1.1 Arial',boxShadow:'0 12px 25px #10131a55'}}>Собери свою историю.<br/>Создай ролик в «Спроси AI».</div></>,
  ];

  const push=interpolate(frame,[0,SHOT-1],[1,1.035],{...clamp,easing:Easing.inOut(Easing.cubic)});
  return <AbsoluteFill style={{overflow:'hidden',background:'#171b24'}}>
    <div style={{position:'absolute',inset:0,scale:push,translate:`${interpolate(frame,[0,SHOT-1],[8,-6],{...clamp,easing:Easing.inOut(Easing.cubic)})}px ${interpolate(frame,[0,SHOT-1],[6,-4],{...clamp,easing:Easing.inOut(Easing.cubic)})}px`}}>{shots[index]}</div>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 70%,#11172066 84%,#111720b3 100%)',pointerEvents:'none'}}/>
    <div style={{position:'absolute',top:1530,left:62,right:62,textAlign:'center',font:'1000 42px/1.12 Arial',letterSpacing:-.4,color:'#fff8ee',WebkitTextStroke:'2.5px #151922',textShadow:'0 4px 0 #151922,0 8px 18px #090a0dcc'}}>
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
