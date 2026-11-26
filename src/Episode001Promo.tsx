import type {FC} from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const BASE = 'episodes/episode-001/';
import voiceScript from './episodes/episode-001-voice.json';
const FPS = 30;
const SHOT = 5 * FPS;
const TOTAL = 35 * FPS;

type VoiceVariant = 'google' | 'elevenlabs';

const script = voiceScript.lines;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const Room: FC<{frame: number; night?: boolean}> = ({frame, night = false}) => {
  const sway = Math.sin(frame / 24) * 8;
  return <svg viewBox="0 0 1080 1920" style={{position: 'absolute', width: '100%', height: '100%'}}>
    <defs>
      <linearGradient id="wall" x2="0" y2="1"><stop stopColor={night ? '#172538' : '#39404d'}/><stop offset="1" stopColor={night ? '#303545' : '#66514b'}/></linearGradient>
      <radialGradient id="lamp"><stop stopColor="#f3b756" stopOpacity=".48"/><stop offset="1" stopColor="#f3b756" stopOpacity="0"/></radialGradient>
      <pattern id="grain" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="5" r="1" fill="#fff" opacity=".08"/><circle cx="11" cy="14" r="1" fill="#111" opacity=".08"/></pattern>
    </defs>
    <rect width="1080" height="1920" fill="url(#wall)"/><rect x="0" y="1140" width="1080" height="780" fill="#332e34"/>
    <path d="M0 1150H1080" stroke="#161b23" strokeWidth="28"/><path d="M0 1172H1080" stroke="#a77c54" strokeWidth="10"/>
    <rect x="72" y="200" width="364" height="420" rx="18" fill="#182033" stroke="#111720" strokeWidth="24"/>
    <rect x="95" y="224" width="318" height="370" fill="#485568"/>
    <circle cx="347" cy="305" r="90" fill="#e9b966" opacity=".82"/><path d="M96 503 Q206 430 414 508V594H96Z" fill="#263344"/>
    <ellipse cx="805" cy="630" rx="380" ry="430" fill="url(#lamp)"/>
    <path d={`M100 1070 Q300 ${1030+sway} 490 1080 T990 1065`} stroke="#a27754" strokeWidth="18" fill="none"/>
    <rect width="1080" height="1920" fill="url(#grain)"/>
  </svg>;
};

const Hero: FC<{frame: number; emotion?: 'scared'|'thinking'|'relieved'|'happy'; x?: number; scale?: number; speaking?:boolean}> = ({frame, emotion='scared', x=0, scale=1, speaking=false}) => {
  const blink = (frame % 103 > 96 && frame % 103 < 100) ? .12 : 1;
  const bob = Math.sin(frame / 6) * (emotion === 'scared' ? 8 : 4);
  const talking = speaking && Math.floor(frame / 4) % 2 === 0;
  const mouth = talking ? 'M314 558 Q335 546 356 558 Q365 575 335 587 Q305 575 314 558' : emotion === 'scared' ? 'M314 558 Q335 545 356 558 Q364 595 335 614 Q306 595 314 558' : emotion === 'happy' ? 'M284 554 Q335 607 386 554 Q335 641 284 554' : emotion === 'relieved' ? 'M292 569 Q335 595 378 569' : 'M295 570 Q335 552 375 570';
  const eyes = emotion === 'scared' || emotion === 'thinking' ? 50 : 42;
  return <div style={{position:'absolute',left:`calc(50% + ${x}px)`,bottom:95,width:670,height:1120,transform:`translateX(-50%) scale(${scale}) translateY(${bob}px)`,transformOrigin:'bottom center'}}>
    <svg viewBox="0 0 670 1120" width="100%" height="100%" style={{overflow:'visible'}}>
      <ellipse cx="335" cy="1090" rx="245" ry="30" fill="#141720" opacity=".5"/>
      <path d="M148 1090 Q150 812 214 754 L272 726 H398 L458 754 Q522 812 524 1090Z" fill="#3d6a83" stroke="#171b22" strokeWidth="19"/>
      <path d="M279 730 L335 798 393 730" fill="#f1e6d5" stroke="#171b22" strokeWidth="12"/>
      <path d="M169 918 Q77 867 105 799 Q127 750 164 790 L235 850" fill="#d9a77e" stroke="#171b22" strokeWidth="20" transform={`rotate(${Math.sin(frame/8)*8} 170 880)`}/>
      <path d="M501 920 Q591 854 565 798 Q544 754 511 795 L442 852" fill="#d9a77e" stroke="#171b22" strokeWidth="20" transform={`rotate(${-Math.sin(frame/8)*8} 500 880)`}/>
      <path d="M288 620 Q335 658 382 620 C367 665 370 690 386 726 Q335 754 284 726 C300 690 303 665 288 620Z" fill="#edc29c" stroke="#171b22" strokeWidth="17"/>
      <path d="M221 425 Q181 315 226 235 Q263 150 344 156 Q443 148 477 245 Q515 342 466 442Z" fill="#45332d" stroke="#171b22" strokeWidth="19"/>
      <ellipse cx="335" cy="479" rx="177" ry="202" fill="#edc29c" stroke="#171b22" strokeWidth="19"/>
      <path d="M166 424 Q192 222 351 208 Q450 216 501 366 Q417 306 333 318 Q242 324 166 424Z" fill="#45332d" stroke="#171b22" strokeWidth="18"/>
      <ellipse cx="272" cy="463" rx="45" ry={eyes*blink} fill="#fffdf7" stroke="#171b22" strokeWidth="10"/><ellipse cx="398" cy="463" rx="45" ry={eyes*blink} fill="#fffdf7" stroke="#171b22" strokeWidth="10"/>
      <circle cx={emotion === 'thinking' ? 285 : 279} cy="467" r="19" fill="#283d57"/><circle cx="392" cy="467" r="19" fill="#283d57"/><circle cx="285" cy="467" r="7" fill="#fff"/><circle cx="398" cy="467" r="7" fill="#fff"/>
      <path d={emotion==='scared'?'M225 398 Q269 367 307 398':'M226 407 Q267 380 306 396'} fill="none" stroke="#30241f" strokeWidth="13" strokeLinecap="round"/><path d={emotion==='scared'?'M365 398 Q405 366 444 397':'M367 397 Q407 380 445 407'} fill="none" stroke="#30241f" strokeWidth="13" strokeLinecap="round"/>
      <path d="M330 483 Q310 525 335 534" fill="none" stroke="#a8644d" strokeWidth="10" strokeLinecap="round"/>
      <path d={mouth} fill={emotion==='scared'?'#682f37':'#853d48'} stroke="#542e34" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="220" cy="541" r="21" fill="#e98c77" opacity=".45"/><circle cx="450" cy="541" r="21" fill="#e98c77" opacity=".45"/>
    </svg>
  </div>;
};

const Mug: FC<{frame:number; x?:number; y?:number; tilt?:number; generic?:boolean}> = ({frame,x=0,y=0,tilt=0,generic=false}) => {
  const wobble = Math.sin(frame/5)*3;
  return <svg viewBox="0 0 300 320" style={{position:'absolute',width:300,height:320,left:`calc(50% + ${x}px)`,top:y,transform:`translateX(-50%) rotate(${tilt+wobble}deg)`,filter:'drop-shadow(0 18px 10px #1118)'}}>
    <path d="M196 83 Q285 65 274 145 Q266 203 206 193" fill="none" stroke="#181d24" strokeWidth="25"/>
    <path d="M196 83 Q285 65 274 145 Q266 203 206 193" fill="none" stroke={generic?'#d6d0c7':'#d9a37e'} strokeWidth="17"/>
    <path d="M54 70 Q53 51 80 51 H203 Q224 52 221 82 L208 252 Q205 278 178 280 H95 Q68 279 65 251Z" fill={generic?'#b9bec8':'#e4b790'} stroke="#171b22" strokeWidth="17"/>
    {!generic && <path d="M91 150 Q125 126 172 148 Q152 170 124 178 Q102 180 91 150Z" fill="#33a69b" stroke="#17484a" strokeWidth="7"/>}
    {generic && <path d="M92 123 Q145 109 185 124" fill="none" stroke="#eff0ee" strokeWidth="10"/>}
    <ellipse cx="139" cy="75" rx="65" ry="17" fill="#fff8e9" stroke="#171b22" strokeWidth="9"/>
  </svg>;
};

const Phone: FC<{frame:number; message:string; tilt?:number}> = ({frame,message,tilt=0}) => {
  const pop = interpolate(frame%150,[0,12],[.4,1],{...clamp,easing:Easing.out(Easing.back(1.4))});
  return <div style={{position:'absolute',right:80,top:390,width:310,height:560,borderRadius:48,border:'13px solid #131923',background:'#e9e7df',transform:`rotate(${tilt}deg) scale(${pop})`,boxShadow:'0 26px 50px #080b11aa',padding:22,boxSizing:'border-box'}}>
    <div style={{height:8,width:88,borderRadius:8,background:'#222833',margin:'0 auto 30px'}}/><div style={{font:'700 22px Arial',color:'#515766'}}>СЕГОДНЯ · 09:41</div>
    <div style={{marginTop:28,padding:20,borderRadius:20,background:'#fff',font:'600 26px/1.2 Arial',color:'#20242a'}}><b>Заказчик</b><br/>{message}</div>
    <div style={{position:'absolute',bottom:22,left:112,width:64,height:9,borderRadius:9,background:'#222833'}}/>
  </div>;
};

const BigText: FC<{children:string; color?:string; top?:number; size?:number; rotate?:number}> = ({children,color='#fff7e9',top=185,size=68,rotate=-2}) => {
  const f=useCurrentFrame(); const scale=interpolate(f,[0,10],[.78,1],{...clamp,easing:Easing.out(Easing.back(1.5))});
  return <div style={{position:'absolute',top,left:48,right:48,textAlign:'center',font:'1000 '+size+'px/1.02 Arial,sans-serif',letterSpacing:-2,color,textShadow:'0 8px 0 #1b1c24, 0 13px 25px #090a0dcc',WebkitTextStroke:'2px #191b22',transform:`rotate(${rotate}deg) scale(${scale})`}}>{children}</div>;
};

const Scene: FC<{index:number}> = ({index}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const global=index*SHOT+frame;
  const line=script[index];
  const speaking=line.voice==='hero' && frame>=5 && frame<line.durationFrames;
  const camera=1+Math.sin(frame/37)*.025;
  const shots=[
    <><Room frame={global} night/><Phone frame={global} message="Запуск уже через три недели. Видео будет?" tilt={4}/><Hero frame={global} emotion="scared" x={-105} speaking={speaking}/><BigText top={180} size={76} color="#ffd74f">ТРИ НЕДЕЛИ</BigText><div style={{position:'absolute',top:300,left:98,right:98,textAlign:'center',font:'900 47px Arial',color:'#fff',textShadow:'0 3px 10px #111'}}>А ВИДЕО — ПУСТО!</div></>,
    <><Room frame={global}/><div style={{position:'absolute',top:320,left:80,width:535,height:640,border:'20px solid #10151f',borderRadius:36,background:'linear-gradient(140deg,#d78545,#f3d28f 45%,#548c87)',boxShadow:'0 22px 45px #10131aaa'}}><div style={{position:'absolute',top:45,left:45,right:45,bottom:45,border:'5px solid #fff7e8aa',borderRadius:26}}/><div style={{position:'absolute',top:205,left:150,transform:'rotate(-13deg)'}}><Mug frame={global} generic/></div><div style={{position:'absolute',bottom:30,left:14,right:14,textAlign:'center',font:'900 31px Arial',color:'white'}}>ИДЕАЛЬНАЯ ЧАШКА?</div></div><div style={{position:'absolute',top:360,right:35,width:330,height:600,background:'#eee3d0',border:'17px solid #151a22',borderRadius:30,transform:'rotate(5deg)'}}><div style={{position:'absolute',top:40,left:40,font:'800 28px Arial',color:'#30333a'}}>МОЯ ЧАШКА</div><div style={{top:115,left:20,transform:'scale(.8)',position:'absolute'}}><Mug frame={global} generic={false}/></div></div><Hero frame={global} emotion="thinking" x={0} scale={.79} speaking={speaking}/><BigText top={190} size={50} color="#ffdd67">КРАСИВО. НО НЕ МОЁ.</BigText></>,
    <><Room frame={global} night/><Hero frame={global} emotion="scared" x={-190} scale={.72} speaking={speaking}/><div style={{position:'absolute',top:390,left:70,right:70,display:'flex',gap:18}}><RiskCard color="#e76355" title="ВЫЛОЖИТЬ" sub="бренд не узнать" frame={frame}/><RiskCard color="#e9b949" title="ПЕРЕДЕЛАТЬ" sub="можно не успеть" frame={frame-8}/></div><div style={{position:'absolute',top:920,left:130,right:130,textAlign:'center',font:'1000 55px Arial',color:'#fff7e9',textShadow:'0 5px 0 #121720'}}>ОБА ВАРИАНТА — С РИСКОМ</div><Mug frame={global} x={0} y={1120} tilt={-12}/></>,
    <><Room frame={global}/><div style={{position:'absolute',top:330,left:80,right:80,height:610,border:'18px solid #151a22',borderRadius:36,background:'linear-gradient(135deg,#f0b66a,#e28456,#8c4c63)',overflow:'hidden',transform:`rotate(${Math.sin(frame/10)*2}deg)`}}><div style={{position:'absolute',top:125,left:265,transform:'scale(1.1) rotate(-9deg)'}}><Mug frame={global} generic/></div><div style={{position:'absolute',left:0,right:0,bottom:30,textAlign:'center',font:'900 36px Arial',color:'white'}}>НОВИНКА · КОЛЛЕКЦИЯ</div></div><Hero frame={global} emotion={frame<66?'relieved':'thinking'} x={-115} scale={.77} speaking={speaking}/><div style={{position:'absolute',top:1010,right:110,font:'900 72px Arial',color:'#74e5b8',textShadow:'0 5px #17312d'}}>{frame<65?'ГОТОВО!':'…'}</div><Phone frame={global} message="А чем она особенная?" tilt={-3}/></>,
    <><Room frame={global} night/><Hero frame={global} emotion="thinking" x={-170} scale={.7}/><Phone frame={global} message="А чем она особенная?" tilt={-5}/><BigText top={205} size={61} color="#ffd94f">И ВОТ ВОПРОС…</BigText><div style={{position:'absolute',top:1010,left:75,right:75,padding:24,borderRadius:25,background:'#fff8e9',color:'#262931',font:'900 44px Arial',textAlign:'center',transform:`rotate(${Math.sin(frame/8)*1.5}deg)`}}>ЧЕМ ОНА ОТЛИЧАЕТСЯ?</div><Mug frame={global} x={-240} y={1130}/></>,
    <><div style={{position:'absolute',inset:0,background:'#eee9df'}}/><div style={{position:'absolute',top:70,left:55,right:55,textAlign:'center',font:'900 47px Arial',color:'#20232d'}}>РАЗОБРАЛА ПРОЦЕСС ПО ШАГАМ</div><div style={{position:'absolute',top:165,left:55,right:55,height:1120,borderRadius:32,overflow:'hidden',border:'9px solid #fff',boxShadow:'0 20px 60px #1c203033'}}><Img src={staticFile(BASE+'academy-course-mobile.png')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}}/></div><Hero frame={global} emotion="happy" x={-315} scale={.54} speaking={speaking}/><div style={{position:'absolute',left:65,right:65,bottom:145,display:'flex',gap:12}}>{['СЦЕНАРИЙ','ГЕРОИ','СЦЕНЫ','ЗВУК'].map((t,i)=><div key={t} style={{flex:1,padding:'18px 8px',borderRadius:18,background:['#e7b64d','#d87258','#56a393','#577da5'][i],color:'white',font:'900 23px Arial',textAlign:'center',transform:`translateY(${Math.sin(frame/7+i)*10}px)`}}>{t}</div>)}</div></>,
    <><Room frame={global}/><Hero frame={global} emotion="happy" x={-190} speaking={speaking}/><div style={{position:'absolute',top:350,right:45,width:430,height:560,borderRadius:36,background:'linear-gradient(135deg,#e8b58b,#f7e2bd)',border:'16px solid #171c25',transform:`rotate(${Math.sin(frame/14)*3}deg)`}}><div style={{position:'absolute',inset:18,border:'4px solid #fff8e6',borderRadius:22}}/><div style={{position:'absolute',top:115,left:65,transform:'scale(1.15) rotate(9deg)'}}><Mug frame={global}/></div><div style={{position:'absolute',bottom:25,left:20,right:20,textAlign:'center',font:'900 31px Arial',color:'#25343b'}}>СДЕЛАНО ВРУЧНУЮ</div></div><div style={{position:'absolute',top:1040,left:90,right:90,padding:28,borderRadius:25,background:'#fff8e9',color:'#252831',font:'800 36px/1.16 Arial',textAlign:'center',boxShadow:'0 14px 25px #10131a55'}}>Теперь это похоже на мой бренд.</div><div style={{position:'absolute',bottom:82,left:55,right:55,display:'flex',alignItems:'center',justifyContent:'center',gap:18}}><Img src={staticFile(BASE+'academy-mark.svg')} style={{width:72,height:65}}/><div style={{font:'900 31px Arial',color:'#fff8ec',textShadow:'0 3px 8px #151a22'}}>АКАДЕМИЯ СПРОСИ AI<br/><span style={{fontSize:24,fontWeight:600}}>sprosi-ai-mockup.vercel.app/app/</span></div></div></>,
  ];
  return <AbsoluteFill style={{overflow:'hidden',background:'#171b24'}}><div style={{position:'absolute',inset:-35,transform:`scale(${camera}) translateY(${Math.sin(frame/28)*12}px)`}}>{shots[index]}</div>
    <div style={{position:'absolute',top:45,left:36,padding:'10px 18px',borderRadius:18,background:'#171b24dd',color:'#fff4e4',font:'800 20px Arial',letterSpacing:1}}>СПРОСИ AI · {String(index+1).padStart(2,'0')}</div>
    <Caption index={index}/>
    <div style={{position:'absolute',bottom:55,left:55,right:55,height:8,borderRadius:8,background:'#ffffff55'}}><div style={{height:'100%',width:`${((index*SHOT+frame+1)/TOTAL)*100}%`,background:'#f4c84e',borderRadius:8}}/></div>
  </AbsoluteFill>;
};

const RiskCard: FC<{color:string;title:string;sub:string;frame:number}> = ({color,title,sub,frame}) => {const y=interpolate(frame,[0,12],[140,0],clamp);return <div style={{flex:1,height:315,alignSelf:'flex-start',borderRadius:25,background:color,color:'#fff',padding:22,boxSizing:'border-box',transform:`translateY(${y}px) rotate(${frame%2?2:-2}deg)`,boxShadow:'0 15px 35px #111a',border:'5px solid #181d25'}}><div style={{font:'1000 40px Arial',textAlign:'center'}}>{title}</div><div style={{marginTop:25,textAlign:'center',font:'800 30px/1.1 Arial'}}>{sub}</div></div>};

const captions=['ДО ЗАПУСКА ТРИ НЕДЕЛИ. А ВИДЕО — ПУСТО.','ПЕРВЫЙ РОЛИК КРАСИВЫЙ. НО ЧАШКА — НЕ МОЯ.','ВЫЛОЖИТЬ ИЛИ ПЕРЕДЕЛАТЬ? ВЕЗДЕ РИСК.','ВРОДЕ ГОТОВО…','«А ЧЕМ ОНА ОСОБЕННАЯ?»','СЦЕНАРИЙ · ГЕРОИ · СЦЕНЫ · ЗВУК','ТВОЯ ИСТОРИЯ МОЖЕТ НАЧАТЬСЯ ЗДЕСЬ'];
const Caption: FC<{index:number}> = ({index}) => {const f=useCurrentFrame();const enter=interpolate(f,[0,8],[.8,1],{...clamp,easing:Easing.out(Easing.back(1.4))});return <div style={{position:'absolute',bottom:112,left:48,right:48,padding:'19px 24px',borderRadius:22,background:index===4?'#fff7e9':'#121720e8',color:index===4?'#20232c':'#fff9ed',font:'900 30px/1.1 Arial',textAlign:'center',boxShadow:'0 9px 25px #090b10aa',transform:`scale(${enter})`,borderBottom:'5px solid #f0c449'}}>{captions[index]}</div>};

export const PromoFilm: FC<{voiceVariant:VoiceVariant}> = ({voiceVariant}) => {
  return <AbsoluteFill style={{backgroundColor:'#171b24'}}>
    {Array.from({length:7},(_,i)=><Sequence key={i} from={i*SHOT} durationInFrames={SHOT} premountFor={10}><Scene index={i}/></Sequence>)}
    {script.map((line,i)=><Sequence key={line.id} from={i*SHOT+5} durationInFrames={SHOT-5}><Audio src={staticFile(`audio/episode-001/${voiceVariant}/${line.id}.mp3`)} volume={1}/></Sequence>)}
    <Sequence from={0}><Audio src={staticFile('audio/episode-001/sfx/notification.wav')} volume={0.5}/></Sequence>
    <Sequence from={4*FPS}><Audio src={staticFile('audio/episode-001/sfx/notification.wav')} volume={0.38}/></Sequence>
    {[1,2,3,4,5].map((i)=><Sequence key={`whoosh-${i}`} from={i*SHOT-5}><Audio src={staticFile('audio/episode-001/sfx/whoosh.wav')} volume={0.45}/></Sequence>)}
    <Sequence from={2*SHOT}><Audio src={staticFile('audio/episode-001/sfx/impact.wav')} volume={0.4}/></Sequence>
    <Sequence from={3*SHOT+2}><Audio src={staticFile('audio/episode-001/sfx/tick.wav')} volume={0.38}/></Sequence>
    <Sequence from={4*SHOT}><Audio src={staticFile('audio/episode-001/sfx/notification.wav')} volume={0.5}/></Sequence>
    <Sequence from={6*SHOT}><Audio src={staticFile('audio/episode-001/sfx/resolution.wav')} volume={0.3}/></Sequence>
  </AbsoluteFill>;
};

export const PromoCompositions: FC = () => <>
  <Composition id="SprosiAcademyPromoGoogle" component={PromoFilm} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{voiceVariant:'google'}}/>
  <Composition id="SprosiAcademyPromoElevenLabs" component={PromoFilm} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{voiceVariant:'elevenlabs'}}/>
</>;
