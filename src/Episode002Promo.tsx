import type {FC, ReactNode} from 'react';
import {AbsoluteFill, Audio, Composition, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Hero, Mug, Phone, Room} from './Episode001Promo';

const FPS = 30;
const SHOT = 6 * FPS;
const TOTAL = 7 * SHOT;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
const voice = [
  'У меня мастерская. А идею для ролика никак не поймать.',
  'Красивая картинка сама по себе не объясняет, чем особенная моя работа.',
  'Что заставит зрителя досмотреть?',
  'В Академии «Спроси AI» я разбираю задачу по шагам: герой, цель, препятствие и загадка.',
  'Героиня хочет показать свою чашку. Но что расскажет о ней бирюзовая метка?',
  'Каждое решение меняет следующий кадр. Так появляется история, а не просто красивая анимация.',
  'Создай ролик для своей задачи в Академии «Спроси AI». Начни с истории.'
];

const Label: FC<{children:ReactNode; top?:number; color?:string; size?:number}> = ({children,top=220,color='#fff3de',size=58}) => (
  <div style={{position:'absolute',top,left:64,right:64,textAlign:'center',font:`1000 ${size}px/1.04 Arial`,letterSpacing:-1,color,textShadow:'0 5px 0 #191b22,0 12px 25px #090a0dcc',WebkitTextStroke:'1px #191b22'}}>{children}</div>
);

const Scene: FC<{index:number}> = ({index}) => {
  const frame = useCurrentFrame();
  const absoluteFrame = index*SHOT+frame;
  const enter = interpolate(frame,[0,18],[180,0],{...clamp,easing:Easing.out(Easing.cubic)});
  const soften = interpolate(frame,[0,14],[0,1],{...clamp,easing:Easing.out(Easing.cubic)});
  const brandLockup = <div style={{position:'absolute',top:190,left:115,right:115,display:'flex',alignItems:'center',justifyContent:'center',gap:16,padding:'14px 20px',borderRadius:28,background:'#171b22ed',border:'4px solid #f0c449'}}><div style={{width:60,height:60,borderRadius:'50%',background:'#f4c84e',display:'grid',placeItems:'center'}}><Img src={staticFile('episodes/episode-001/academy-mark.svg')} style={{width:38,height:36}}/></div><div style={{font:'900 28px/1.1 Arial',color:'#fff8ec',textShadow:'0 3px 8px #151a22'}}>АКАДЕМИЯ СПРОСИ AI<br/><span style={{fontSize:19,fontWeight:600}}>sprosi-ai-mockup.vercel.app/app/</span></div></div>;

  const scenes: ReactNode[] = [
    <><Room frame={absoluteFrame} night/><Phone frame={absoluteFrame} message="Нужен ролик к запуску!" tilt={-3}/><Hero frame={absoluteFrame} emotion="scared" x={-135}/><Label top={185} color="#ffd54e" size={66}>С ЧЕГО НАЧАТЬ?</Label><div style={{position:'absolute',top:315,left:125,right:125,textAlign:'center',font:'800 35px Arial',color:'#fff8ec',textShadow:'0 3px 12px #111'}}>Идея есть. Истории пока нет.</div></>,
    <><Room frame={absoluteFrame}/><Hero frame={absoluteFrame} emotion="thinking" x={-195} scale={.76}/><div style={{position:'absolute',top:365,right:54,width:490,height:570,border:'16px solid #171b22',borderRadius:36,background:'linear-gradient(145deg,#bdd8d0,#f2d2a3 55%,#cf765b)',boxShadow:'0 20px 40px #10131a88',opacity:soften}}><div style={{position:'absolute',top:28,left:28,right:28,color:'#26303b',font:'900 24px Arial'}}>КРАСИВАЯ КАРТИНКА</div><div style={{position:'absolute',top:135,left:100,transform:'scale(.95) rotate(-8deg)'}}><Mug frame={absoluteFrame} generic/></div><div style={{position:'absolute',bottom:28,left:20,right:20,textAlign:'center',color:'#28333a',font:'900 28px Arial'}}>НО НЕ МОЯ ИСТОРИЯ</div></div><Mug frame={absoluteFrame} x={-250} y={1150}/><Label top={205} size={46}>КРАСИВО — ЕЩЁ НЕ ЗНАЧИТ ИНТЕРЕСНО</Label></>,
    <><Room frame={absoluteFrame} night/><Hero frame={absoluteFrame} emotion="thinking" x={-190} scale={.78}/><div style={{position:'absolute',top:470,right:95,width:360,height:360,borderRadius:'50%',background:'#f0c449',border:'13px solid #171b22',display:'grid',placeItems:'center',font:'1000 220px Arial',color:'#242832',transform:`translateY(${interpolate(frame,[0,18],[100,0],{...clamp,easing:Easing.out(Easing.cubic)})}px)`,boxShadow:'0 18px 0 #141821'}}>?</div><Label top={190} color="#ffd54e">ЧТО ЗАСТАВИТ ДОСМОТРЕТЬ?</Label><div style={{position:'absolute',top:940,left:95,right:95,display:'flex',gap:15,justifyContent:'center'}}>{['ГЕРОЙ','ЦЕЛЬ','ПРЕПЯТСТВИЕ'].map((v,i)=><div key={v} style={{padding:'17px 19px',borderRadius:17,background:['#e9b64c','#d77358','#52a191'][i],border:'4px solid #171b22',color:'white',font:'900 23px Arial',transform:`translateY(${interpolate(frame,[10+i*4,24+i*4],[75,0],{...clamp,easing:Easing.out(Easing.cubic)})}px)`}}>{v}</div>)}</div></>,
    <><Room frame={absoluteFrame}/><div style={{position:'absolute',top:230,left:190,width:700,height:1280,padding:14,boxSizing:'border-box',border:'14px solid #171b22',borderRadius:42,background:'#e9e4dc',boxShadow:'0 24px 0 #111822,0 35px 60px #10131a99',transform:`translateX(${enter}px) rotate(-1deg)`}}><div style={{position:'absolute',top:12,left:'50%',width:78,height:10,borderRadius:8,background:'#171b22',transform:'translateX(-50%)',zIndex:2}}/><Img src={staticFile('episodes/episode-001/academy-course-mobile.png')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top',borderRadius:20}}/></div><Hero frame={absoluteFrame} emotion="thinking" x={-370} scale={.48}/><Label top={118} color="#ffd54e" size={43}>УЧУСЬ НА СВОЕЙ ЗАДАЧЕ</Label><div style={{position:'absolute',top:1510,left:100,right:100,textAlign:'center',font:'900 29px Arial',color:'#fff8eb',textShadow:'0 4px 9px #111'}}>Сценарий · герои · сцены · звук</div></>,
    <><Room frame={absoluteFrame} night/><Hero frame={absoluteFrame} emotion="thinking" x={-210} scale={.72}/><div style={{position:'absolute',top:395,right:50,width:420,height:575,border:'15px solid #171b22',borderRadius:38,background:'#e6b98d',boxShadow:'0 18px 40px #111a'}}><div style={{position:'absolute',top:27,left:26,right:26,font:'900 25px Arial',color:'#29323a'}}>ПОЧЕМУ ОНА ОСОБЕННАЯ?</div><div style={{position:'absolute',top:135,left:55,transform:'scale(1.1) rotate(-6deg)'}}><Mug frame={absoluteFrame}/></div><div style={{position:'absolute',bottom:28,left:20,right:20,textAlign:'center',font:'900 27px Arial',color:'#263038'}}>НАЙДИ ДЕТАЛЬ</div><div style={{position:'absolute',top:142,left:145,width:28,height:28,borderRadius:'50%',background:'#34b5a0',opacity:interpolate(frame,[0,20],[0,1],clamp),boxShadow:'0 0 0 12px #34b5a044'}}/></div><Label top={210} size={49}>А ЧТО СКРЫВАЕТ МЕТКА?</Label><div style={{position:'absolute',top:1050,left:105,right:105,textAlign:'center',font:'800 32px Arial',color:'#fff8ed',textShadow:'0 3px 10px #111'}}>Одна деталь становится загадкой.</div></>,
    <><Room frame={absoluteFrame}/><Hero frame={absoluteFrame} emotion="happy" x={-250} scale={.7}/><div style={{position:'absolute',top:390,right:48,width:455,height:550,borderRadius:34,background:'linear-gradient(135deg,#f3d5a4,#e6b287)',border:'15px solid #171b22',transform:'rotate(1deg)',boxShadow:'0 18px 35px #1118'}}><div style={{position:'absolute',inset:18,border:'4px solid #fff8e6',borderRadius:20}}/><div style={{position:'absolute',top:103,left:92,transform:'scale(1.08) rotate(-8deg)'}}><Mug frame={absoluteFrame}/></div><div style={{position:'absolute',bottom:25,left:18,right:18,textAlign:'center',font:'900 28px Arial',color:'#26353a'}}>ТЕПЕРЬ ЭТО ЕЁ ИСТОРИЯ</div></div><div style={{position:'absolute',top:1000,left:95,right:95,display:'flex',justifyContent:'center',gap:12}}>{['КАДР 1','КАДР 2','КАДР 3'].map((t,i)=><div key={t} style={{padding:'13px 16px',background:['#e9b64c','#d77358','#52a191'][i],border:'4px solid #171b22',borderRadius:14,color:'white',font:'900 22px Arial',transform:`translateY(${Math.sin(frame/34+i)*2}px)`}}>{t}</div>)}</div><Label top={200} color="#72e3bc" size={45}>КАЖДОЕ РЕШЕНИЕ ВЕДЁТ ДАЛЬШЕ</Label></>,
    <><Room frame={absoluteFrame}/><Hero frame={absoluteFrame} emotion="happy" x={-190} scale={.82}/><Mug frame={absoluteFrame} x={190} y={950} tilt={-4}/>{brandLockup}<div style={{position:'absolute',top:1410,left:100,right:100,padding:'22px 24px',borderRadius:25,background:'#fff8e9',color:'#262931',font:'900 34px/1.12 Arial',textAlign:'center',boxShadow:'0 12px 25px #10131a55'}}>Создай ролик для своей задачи.<br/>Начни с истории.</div></>,
  ];

  return <AbsoluteFill style={{overflow:'hidden',background:'#171b24'}}>
    <div style={{position:'absolute',inset:0,transform:`scale(${interpolate(frame,[0,SHOT-1],[1.02,1.055],{...clamp,easing:Easing.inOut(Easing.cubic)})}) translate(${interpolate(frame,[0,SHOT-1],[10,-8],{...clamp,easing:Easing.inOut(Easing.cubic)})}px,${interpolate(frame,[0,SHOT-1],[10,-6],{...clamp,easing:Easing.inOut(Easing.cubic)})}px)`}}>{scenes[index]}</div>
    <div style={{position:'absolute',top:45,left:36,padding:'10px 18px',borderRadius:18,background:'#171b24dd',color:'#fff4e4',font:'800 20px Arial',letterSpacing:1}}>СПРОСИ AI · {String(index+1).padStart(2,'0')}</div>
    <div style={{position:'absolute',bottom:112,left:48,right:48,padding:'19px 24px',borderRadius:22,background:index===2?'#fff7e9':'#121720e8',color:index===2?'#20232c':'#fff9ed',font:'900 27px/1.12 Arial',textAlign:'center',boxShadow:'0 9px 25px #090b10aa',borderBottom:'5px solid #f0c449'}}>{voice[index]}</div>
    <div style={{position:'absolute',bottom:55,left:55,right:55,height:8,borderRadius:8,background:'#ffffff55'}}><div style={{height:'100%',width:`${((index*SHOT+frame+1)/TOTAL)*100}%`,background:'#f4c84e',borderRadius:8}}/></div>
  </AbsoluteFill>;
};

export const Episode002Promo: FC = () => <>
  {Array.from({length:7},(_,index)=><Sequence key={index} from={index*SHOT} durationInFrames={SHOT} premountFor={FPS}><Scene index={index}/></Sequence>)}
  {[1,2,3,4,5,6].map((index)=><Sequence key={`whoosh-${index}`} from={index*SHOT-10} premountFor={FPS}><Audio src={staticFile('audio/episode-001/sfx/whoosh.wav')} volume={0.25}/></Sequence>)}
  <Sequence from={0} premountFor={FPS}><Audio src={staticFile('audio/episode-001/sfx/notification.wav')} volume={0.45}/></Sequence>
  <Sequence from={2*SHOT} premountFor={FPS}><Audio src={staticFile('audio/episode-001/sfx/tick.wav')} volume={0.3}/></Sequence>
  <Sequence from={6*SHOT} premountFor={FPS}><Audio src={staticFile('audio/episode-001/sfx/resolution.wav')} volume={0.28}/></Sequence>
</>;

export const Episode002Composition: FC = () => <Composition id="SprosiAcademyStoryPromo" component={Episode002Promo} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920}/>;
