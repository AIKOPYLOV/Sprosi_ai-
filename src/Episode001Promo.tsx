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

export const Room: FC<{frame: number; night?: boolean}> = ({frame, night = false}) => {
  const glow = 0.31 + Math.sin(frame / 48) * 0.018;
  const wheelTurn = frame * 0.42;
  const dust = [
    {x: 536, y: 846, speed: 0.5, phase: 0},
    {x: 744, y: 740, speed: 0.35, phase: 29},
    {x: 423, y: 995, speed: 0.42, phase: 60},
    {x: 822, y: 919, speed: 0.29, phase: 96},
  ];
  return <svg viewBox="0 0 1080 1920" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
    <defs>
      <linearGradient id="studioWall" x1="0" y1="0" x2="1" y2="1"><stop stopColor={night?'#343846':'#55515a'}/><stop offset=".58" stopColor={night?'#554650':'#6c5148'}/><stop offset="1" stopColor="#343542"/></linearGradient>
      <linearGradient id="windowSky" x2="0" y2="1"><stop stopColor="#283b5a"/><stop offset="1" stopColor="#65718a"/></linearGradient>
      <linearGradient id="wood" x2="0" y2="1"><stop stopColor="#b77f50"/><stop offset="1" stopColor="#714a37"/></linearGradient>
      <radialGradient id="taskGlow"><stop stopColor="#ffc56d" stopOpacity={glow}/><stop offset="1" stopColor="#ffc56d" stopOpacity="0"/></radialGradient>
      <pattern id="wallDots" width="42" height="42" patternUnits="userSpaceOnUse"><circle cx="5" cy="9" r="2" fill="#f2d8b6" opacity=".13"/><circle cx="31" cy="29" r="1.5" fill="#161b22" opacity=".16"/></pattern>
      <pattern id="tableGrain" width="190" height="34" patternUnits="userSpaceOnUse"><path d="M4 8 Q56 1 116 8 T188 7 M28 25 Q85 18 164 25" fill="none" stroke="#482f2a" strokeWidth="3" opacity=".32"/></pattern>
    </defs>
    <rect width="1080" height="1920" fill="url(#studioWall)"/>
    <path d="M0 0H1080V1080H0Z" fill="url(#wallDots)"/>
    <path d="M0 1390H1080V1920H0Z" fill="#34313a"/>
    <path d="M0 1444H1080 M0 1602H1080 M0 1760H1080 M0 1915H1080" stroke="#1a1c25" strokeWidth="12" opacity=".7"/>
    <path d="M76 1448V1600 M350 1450V1600 M690 1450V1600 M965 1450V1600 M214 1607V1755 M520 1607V1755 M842 1607V1755" stroke="#71605b" strokeWidth="5" opacity=".42"/>

    {/* Blue-hour window and curtain */}
    <rect x="44" y="172" width="326" height="606" rx="14" fill="#202634" stroke="#171b22" strokeWidth="20"/>
    <rect x="65" y="193" width="284" height="564" fill="url(#windowSky)"/>
    <circle cx="281" cy="284" r="53" fill="#f0d59e" opacity=".9"/><circle cx="303" cy="267" r="51" fill="#3d4e68"/>
    <path d="M67 584 Q142 535 207 574 T348 554V756H67Z" fill="#263446" stroke="#171b22" strokeWidth="7"/>
    <path d="M93 612L142 585 189 614V692H93Z M205 598L254 564 312 600V692H205Z" fill="#3c4758" stroke="#171b22" strokeWidth="7"/>
    <path d="M65 478H349 M207 193V757" stroke="#171b22" strokeWidth="17"/>
    {[{x:116,y:269},{x:307,y:435},{x:164,y:370},{x:274,y:321},{x:96,y:425}].map((s,i)=><circle key={`star-${i}`} cx={s.x} cy={s.y} r={i===frame%5?5:3} fill="#fff1c9" opacity={i===frame%5?.95:.52}/>)}
    <path d="M43 172 Q7 248 39 360 Q11 492 47 615L70 625V183Z M370 175 Q408 261 376 394 Q403 530 369 660L349 645V181Z" fill="#765e60" stroke="#171b22" strokeWidth="12"/>
    <path d="M41 755H374L392 802H26Z" fill="#a27b62" stroke="#171b22" strokeWidth="15"/>

    {/* Shelves and pottery */}
    <path d="M398 470H955L932 511H419Z" fill="url(#wood)" stroke="#171b22" strokeWidth="15"/>
    <path d="M470 510L458 568 M882 510L900 568" stroke="#171b22" strokeWidth="13"/>
    <path d="M471 449 Q449 417 471 390 Q487 368 488 338 Q518 365 527 393 Q544 427 516 449Z" fill="#d4a27d" stroke="#171b22" strokeWidth="12"/>
    <path d="M471 410Q496 420 521 405" fill="none" stroke="#46aaa0" strokeWidth="11"/>
    <path d="M557 449 Q545 420 562 399 Q574 378 574 351 Q607 378 613 407 Q628 436 604 449Z" fill="#647f83" stroke="#171b22" strokeWidth="12"/>
    <path d="M652 449 Q639 428 655 408 Q677 394 697 409 Q713 430 696 449Z" fill="#e4b790" stroke="#171b22" strokeWidth="12"/>
    <path d="M757 449 Q742 423 760 399 Q776 371 775 337 Q814 366 820 402 Q842 433 818 449Z" fill="#bf805d" stroke="#171b22" strokeWidth="12"/>
    <path d="M762 408Q789 424 818 406" fill="none" stroke="#e0c28e" strokeWidth="9"/>
    <path d="M850 449 Q837 422 854 403 Q873 385 873 359 Q901 384 910 411 Q925 435 906 449Z" fill="#527c7d" stroke="#171b22" strokeWidth="12"/>

    <path d="M421 754H837L819 796H438Z" fill="url(#wood)" stroke="#171b22" strokeWidth="15"/>
    <path d="M474 753L463 804 M786 753L802 804" stroke="#171b22" strokeWidth="13"/>
    <path d="M480 733Q455 706 478 681Q498 657 498 631Q528 659 536 687Q552 715 526 733Z" fill="#e2b48b" stroke="#171b22" strokeWidth="12"/>
    <path d="M475 700Q502 715 534 697" fill="none" stroke="#3aa59b" strokeWidth="10"/>
    <path d="M589 731Q572 709 588 692Q605 679 605 658Q632 678 639 704Q650 721 635 731Z" fill="#667d84" stroke="#171b22" strokeWidth="11"/>
    <path d="M713 727Q696 705 714 685Q730 670 730 649Q761 675 768 703Q782 722 761 727Z" fill="#cf9870" stroke="#171b22" strokeWidth="11"/>
    <path d="M862 757Q887 730 911 757" fill="none" stroke="#171b22" strokeWidth="13"/>
    <path d="M875 755Q864 703 895 677Q930 709 918 755Z" fill="#477468" stroke="#171b22" strokeWidth="11"/>
    <path d="M892 706Q856 686 850 659 M901 698Q926 670 938 651 M895 688Q889 650 896 633" fill="none" stroke="#171b22" strokeWidth="9" strokeLinecap="round"/>

    {/* Warm articulated task lamp */}
    <ellipse cx="733" cy="895" rx="262" ry="246" fill="url(#taskGlow)"/>
    <path d="M900 1110L858 904L946 779L862 686" fill="none" stroke="#171b22" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M900 1110L858 904L946 779L862 686" fill="none" stroke="#be8a4e" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="858" cy="904" r="20" fill="#e5b65d" stroke="#171b22" strokeWidth="12"/><circle cx="946" cy="779" r="20" fill="#e5b65d" stroke="#171b22" strokeWidth="12"/>
    <path d="M811 693L853 649L916 680L886 731Z" fill="#e7ad55" stroke="#171b22" strokeWidth="15"/>
    <path d="M830 697L885 716" stroke="#fff0b7" strokeWidth="12"/>

    {/* Kiln, clay wheel, worktable */}
    <rect x="884" y="833" width="154" height="282" rx="42" fill="#555761" stroke="#171b22" strokeWidth="17"/>
    <path d="M908 867Q962 838 1015 867V1067H908Z" fill="#414552" stroke="#171b22" strokeWidth="12"/>
    <circle cx="962" cy="939" r="39" fill="#282e39" stroke="#171b22" strokeWidth="12"/><circle cx="962" cy="939" r="17" fill="#b5634d"/>
    <rect x="913" y="1081" width="94" height="34" rx="8" fill="#a16e4b" stroke="#171b22" strokeWidth="10"/><circle cx="987" cy="1098" r="8" fill="#50c3a6"/>
    <path d="M0 1132Q226 1099 490 1124T1080 1115V1254H0Z" fill="url(#wood)" stroke="#171b22" strokeWidth="21"/>
    <rect x="0" y="1131" width="1080" height="123" fill="url(#tableGrain)"/>
    <path d="M69 1252L45 1412H147L178 1252 M894 1252L921 1412H1021L1001 1252" fill="#684938" stroke="#171b22" strokeWidth="16"/>
    <path d="M0 1254H1080" stroke="#171b22" strokeWidth="14"/>
    <path d="M456 1082L504 1065L593 1089L571 1106L476 1101Z" fill="#d9c5a1" stroke="#171b22" strokeWidth="9" transform={`rotate(${Math.sin(frame/58)*0.35} 520 1080)`}/>
    <path d="M484 1090Q509 1075 535 1083T574 1085" fill="none" stroke="#875e49" strokeWidth="6"/>
    <path d="M591 1096L673 1081" stroke="#171b22" strokeWidth="10" strokeLinecap="round"/><path d="M594 1093L668 1081" stroke="#d2a15b" strokeWidth="6" strokeLinecap="round"/>
    <path d="M128 1096V1137 M153 1096V1138" stroke="#171b22" strokeWidth="11"/>
    <path d="M132 1097V1137 M157 1097V1137" stroke="#a87b54" strokeWidth="6"/>
    <ellipse cx="142" cy="1092" rx="72" ry="20" fill="#9b8775" stroke="#171b22" strokeWidth="12"/>
    <ellipse cx="142" cy="1088" rx="48" ry="12" fill="#cfbda1" stroke="#171b22" strokeWidth="8"/>
    <g transform={`rotate(${wheelTurn} 142 1088)`}>
      <path d="M94 1088H190 M142 1076V1100" stroke="#695b52" strokeWidth="5" strokeLinecap="round"/>
    </g>
    <g transform="translate(-170 0)">
      <path d="M294 1043Q309 1015 326 1042L321 1123H290Z" fill="#4c625f" stroke="#171b22" strokeWidth="11"/>
      <path d="M302 1040L293 982 M310 1040L323 974 M318 1042L345 998 M299 1038L279 1001" stroke="#171b22" strokeWidth="9" strokeLinecap="round"/>
      <path d="M292 1000L297 963 M323 1002L333 958 M344 1005L358 981 M279 1007L263 980" stroke="#dfb06b" strokeWidth="6" strokeLinecap="round"/>
    </g>
    {dust.map((p,i)=>{const y=((p.y-frame*p.speed+p.phase)%1120+1120)%1120+260;const x=p.x+Math.sin(frame/70+i)*5;return <circle key={`dust-${i}`} cx={x} cy={y} r={i%2?3:4} fill="#ffe0a1" opacity={.22+Math.sin(frame/55+i)*.035}/>})}
  </svg>;
};

export const Hero: FC<{frame: number; emotion?: 'scared'|'thinking'|'relieved'|'happy'; x?: number; scale?: number; speaking?:boolean; walking?:boolean; bottom?:number}> = ({frame, emotion='scared', x=0, scale=1, speaking=false, walking=false, bottom=95}) => {
  const blink = (frame % 103 > 96 && frame % 103 < 100) ? .12 : 1;
  const step = walking ? Math.sin(frame / 3) : 0;
  const bob = Math.sin(frame / 24) * (emotion === 'scared' ? 3 : 1.5) + (walking ? Math.abs(step) * 5 : 0);
  const talking = speaking && Math.floor(frame / 5) % 2 === 0;
  const mouth = talking ? 'M314 558 Q335 546 356 558 Q365 575 335 587 Q305 575 314 558' : emotion === 'scared' ? 'M314 558 Q335 545 356 558 Q364 595 335 614 Q306 595 314 558' : emotion === 'happy' ? 'M284 554 Q335 607 386 554 Q335 641 284 554' : emotion === 'relieved' ? 'M292 569 Q335 595 378 569' : 'M295 570 Q335 552 375 570';
  const eyes = emotion === 'scared' || emotion === 'thinking' ? 50 : 42;
  return <div style={{position:'absolute',left:`calc(50% + ${x}px)`,bottom,width:670,height:1120,transform:`translateX(-50%) scale(${scale}) translateY(${bob}px)`,transformOrigin:'bottom center'}}>
    <svg viewBox="0 0 670 1120" width="100%" height="100%" style={{overflow:'visible'}}>
      <ellipse cx="335" cy="1090" rx="245" ry="30" fill="#141720" opacity=".5"/>
      <path d="M148 1090 Q150 812 214 754 L272 726 H398 L458 754 Q522 812 524 1090Z" fill="#3d6a83" stroke="#171b22" strokeWidth="19"/>
      <g transform={`rotate(${step*15} 283 1008)`}><path d="M245 985H326L320 1073L285 1084L250 1072Z" fill="#303947" stroke="#171b22" strokeWidth="12"/><path d="M254 1063Q275 1072 310 1064L317 1087H248Z" fill="#e5d9c8" stroke="#171b22" strokeWidth="11" strokeLinejoin="round"/></g>
      <g transform={`rotate(${-step*15} 383 1008)`}><path d="M344 985H425L420 1072L385 1084L350 1073Z" fill="#303947" stroke="#171b22" strokeWidth="12"/><path d="M352 1064Q380 1073 411 1064L421 1087H347Z" fill="#e5d9c8" stroke="#171b22" strokeWidth="11" strokeLinejoin="round"/></g>
      <path d="M279 730 L335 798 393 730" fill="#f1e6d5" stroke="#171b22" strokeWidth="12"/>
      <path d="M169 918 Q77 867 105 799 Q127 750 164 790 L235 850" fill="#d9a77e" stroke="#171b22" strokeWidth="20" transform={`rotate(${Math.sin(frame/28)*2 + step*10} 170 880)`}/>
      <path d="M501 920 Q591 854 565 798 Q544 754 511 795 L442 852" fill="#d9a77e" stroke="#171b22" strokeWidth="20" transform={`rotate(${-Math.sin(frame/28)*2 - step*10} 500 880)`}/>
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

export const Mug: FC<{frame:number; x?:number; y?:number; tilt?:number; generic?:boolean}> = ({frame,x=0,y=0,tilt=0,generic=false}) => {
  const wobble = Math.sin(frame/38)*0.7;
  return <svg viewBox="0 0 300 320" style={{position:'absolute',width:300,height:320,left:`calc(50% + ${x}px)`,top:y,transform:`translateX(-50%) rotate(${tilt+wobble}deg)`,filter:'drop-shadow(0 18px 10px #1118)'}}>
    <path d="M196 83 Q285 65 274 145 Q266 203 206 193" fill="none" stroke="#181d24" strokeWidth="25"/>
    <path d="M196 83 Q285 65 274 145 Q266 203 206 193" fill="none" stroke={generic?'#d6d0c7':'#d9a37e'} strokeWidth="17"/>
    <path d="M54 70 Q53 51 80 51 H203 Q224 52 221 82 L208 252 Q205 278 178 280 H95 Q68 279 65 251Z" fill={generic?'#b9bec8':'#e4b790'} stroke="#171b22" strokeWidth="17"/>
    {!generic && <path d="M139 128 L148 146 L168 149 L153 163 L157 182 L139 172 L122 182 L125 163 L110 149 L130 146Z" fill="#33a69b" stroke="#17484a" strokeWidth="7"/>}
    {generic && <path d="M92 123 Q145 109 185 124" fill="none" stroke="#eff0ee" strokeWidth="10"/>}
    <ellipse cx="139" cy="75" rx="65" ry="17" fill="#fff8e9" stroke="#171b22" strokeWidth="9"/>
  </svg>;
};

export const Phone: FC<{frame:number; message:string; tilt?:number}> = ({frame,message,tilt=0}) => {
  const pop = interpolate(frame%150,[0,12],[.5,1],{...clamp,easing:Easing.out(Easing.cubic)});
  return <div style={{position:'absolute',right:80,top:390,width:310,height:560,borderRadius:48,border:'13px solid #131923',background:'#e9e7df',transform:`rotate(${tilt}deg) scale(${pop})`,boxShadow:'0 26px 50px #080b11aa',padding:22,boxSizing:'border-box'}}>
    <div style={{height:8,width:88,borderRadius:8,background:'#222833',margin:'0 auto 30px'}}/><div style={{font:'700 22px Arial',color:'#515766'}}>СЕГОДНЯ · 09:41</div>
    <div style={{marginTop:28,padding:20,borderRadius:20,background:'#fff',font:'600 26px/1.2 Arial',color:'#20242a'}}><b>Заказчик</b><br/>{message}</div>
    <div style={{position:'absolute',bottom:22,left:112,width:64,height:9,borderRadius:9,background:'#222833'}}/>
  </div>;
};

const BigText: FC<{children:string; color?:string; top?:number; size?:number; rotate?:number}> = ({children,color='#fff7e9',top=185,size=68,rotate=-2}) => {
  const f=useCurrentFrame(); const scale=interpolate(f,[0,10],[.9,1],{...clamp,easing:Easing.out(Easing.cubic)});
  return <div style={{position:'absolute',top,left:48,right:48,textAlign:'center',font:'1000 '+size+'px/1.02 Arial,sans-serif',letterSpacing:-2,color,textShadow:'0 8px 0 #1b1c24, 0 13px 25px #090a0dcc',WebkitTextStroke:'2px #191b22',transform:`rotate(${rotate}deg) scale(${scale})`}}>{children}</div>;
};

const Scene: FC<{index:number}> = ({index}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const global=index*SHOT+frame;
  const line=script[index];
  const speaking=line.voice==='hero' && frame>=5 && frame<line.durationFrames;
  const moves=[
    {zoom:[1.015,1.08],x:[10,-16],y:[12,-6]},
    {zoom:[1.04,1.085],x:[24,-20],y:[-4,12]},
    {zoom:[1.055,1.095],x:[-6,8],y:[8,-10]},
    {zoom:[1.08,1.025],x:[-8,14],y:[0,12]},
    {zoom:[1.025,1.105],x:[8,-12],y:[14,-16]},
    {zoom:[1.07,1.025],x:[0,0],y:[-12,8]},
    {zoom:[1.02,1.06],x:[-8,8],y:[6,-8]},
  ][index];
  const camera=interpolate(frame,[0,SHOT-1],moves.zoom,{...clamp,easing:Easing.inOut(Easing.cubic)});
  const cameraX=interpolate(frame,[0,SHOT-1],moves.x,{...clamp,easing:Easing.inOut(Easing.cubic)});
  const cameraY=interpolate(frame,[0,SHOT-1],moves.y,{...clamp,easing:Easing.inOut(Easing.cubic)});
  const shots=[
    <><Room frame={global} night/><Phone frame={global} message="Запуск уже через три недели. Видео будет?" tilt={4}/><Hero frame={global} emotion="scared" x={-105} speaking={speaking}/><BigText top={180} size={76} color="#ffd74f">ТРИ НЕДЕЛИ</BigText><div style={{position:'absolute',top:300,left:98,right:98,textAlign:'center',font:'900 47px Arial',color:'#fff',textShadow:'0 3px 10px #111'}}>А ВИДЕО — ПУСТО!</div></>,
    <><Room frame={global}/><div style={{position:'absolute',top:320,left:80,width:535,height:640,border:'20px solid #10151f',borderRadius:36,background:'linear-gradient(140deg,#d78545,#f3d28f 45%,#548c87)',boxShadow:'0 22px 45px #10131aaa'}}><div style={{position:'absolute',top:45,left:45,right:45,bottom:45,border:'5px solid #fff7e8aa',borderRadius:26}}/><div style={{position:'absolute',top:205,left:150,transform:'rotate(-13deg)'}}><Mug frame={global} generic/></div><div style={{position:'absolute',bottom:30,left:14,right:14,textAlign:'center',font:'900 31px Arial',color:'white'}}>ИДЕАЛЬНАЯ ЧАШКА?</div></div><div style={{position:'absolute',top:360,right:35,width:330,height:600,background:'#eee3d0',border:'17px solid #151a22',borderRadius:30,transform:'rotate(5deg)'}}><div style={{position:'absolute',top:40,left:40,font:'800 28px Arial',color:'#30333a'}}>МОЯ ЧАШКА</div><div style={{top:115,left:20,transform:'scale(.8)',position:'absolute'}}><Mug frame={global} generic={false}/></div></div><Hero frame={global} emotion="thinking" x={0} scale={.79} speaking={speaking}/><BigText top={190} size={50} color="#ffdd67">КРАСИВО. НО НЕ МОЁ.</BigText></>,
    <><Room frame={global} night/><Hero frame={global} emotion="scared" x={-190} scale={.72} speaking={speaking}/><div style={{position:'absolute',top:390,left:70,right:70,display:'flex',gap:18}}><RiskCard color="#e76355" title="ВЫЛОЖИТЬ" sub="бренд не узнать" frame={frame}/><RiskCard color="#e9b949" title="ПЕРЕДЕЛАТЬ" sub="можно не успеть" frame={frame-8}/></div><div style={{position:'absolute',top:920,left:130,right:130,textAlign:'center',font:'1000 55px Arial',color:'#fff7e9',textShadow:'0 5px 0 #121720'}}>ОБА ВАРИАНТА — С РИСКОМ</div><Mug frame={global} x={0} y={1120} tilt={-12}/></>,
    <><Room frame={global}/><div style={{position:'absolute',top:330,left:80,right:80,height:610,border:'18px solid #151a22',borderRadius:36,background:'linear-gradient(135deg,#f0b66a,#e28456,#8c4c63)',overflow:'hidden',transform:'rotate(-0.35deg)'}}><div style={{position:'absolute',top:125,left:265,transform:'scale(1.1) rotate(-9deg)'}}><Mug frame={global} generic/></div><div style={{position:'absolute',left:0,right:0,bottom:30,textAlign:'center',font:'900 36px Arial',color:'white'}}>НОВИНКА · КОЛЛЕКЦИЯ</div></div><Hero frame={global} emotion={frame<66?'relieved':'thinking'} x={-115} scale={.77} speaking={speaking}/><div style={{position:'absolute',top:1010,right:110,font:'900 72px Arial',color:'#74e5b8',textShadow:'0 5px #17312d'}}>{frame<65?'ГОТОВО!':'…'}</div><Phone frame={global} message="А чем она особенная?" tilt={-3}/></>,
    <><Room frame={global} night/><Hero frame={global} emotion="thinking" x={-170} scale={.7}/><Phone frame={global} message="А чем она особенная?" tilt={-5}/><BigText top={205} size={61} color="#ffd94f">И ВОТ ВОПРОС…</BigText><div style={{position:'absolute',top:1010,left:75,right:75,padding:24,borderRadius:25,background:'#fff8e9',color:'#262931',font:'900 44px Arial',textAlign:'center',transform:'rotate(-0.35deg)'}}>ЧЕМ ОНА ОТЛИЧАЕТСЯ?</div><Mug frame={global} x={-240} y={1130}/></>,
    <>
      <Room frame={global}/>
      <div style={{position:'absolute',top:90,left:55,right:55,textAlign:'center',font:'1000 42px Arial',letterSpacing:1,color:'#fff4dd',textShadow:'0 5px 0 #171b22,0 9px 18px #111a'}}>УЧУСЬ НА СВОЕЙ ЗАДАЧЕ</div>
      <div style={{position:'absolute',top:185,left:205,width:670,height:1190,padding:13,boxSizing:'border-box',border:'14px solid #171b22',borderRadius:38,background:'#e6ded0',boxShadow:'0 24px 0 #111822,0 35px 60px #10131a99',transform:`translateX(${interpolate(frame,[0,18],[280,0],clamp)}px) rotate(-1deg)`}}>
        <div style={{position:'absolute',top:8,left:'50%',width:76,height:9,borderRadius:8,background:'#171b22',transform:'translateX(-50%)',zIndex:2}}/>
        <Img src={staticFile(BASE+'academy-course-mobile.png')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top',borderRadius:18}}/>
      </div>
      <div style={{position:'absolute',top:415,left:95,padding:'16px 20px',borderRadius:17,background:'#f4c84e',border:'5px solid #171b22',color:'#171b22',font:'900 25px Arial',transform:`rotate(-6deg) translateX(${interpolate(frame,[0,16],[-180,0],clamp)}px)`}}>УРОК 02 · СЦЕНАРИЙ</div>
      <Hero frame={global} emotion="happy" x={-335+interpolate(frame,[0,18],[-170,0],clamp)} scale={.47} speaking={speaking}/>
      <div style={{position:'absolute',bottom:140,left:140,right:140,display:'flex',justifyContent:'center',gap:12}}>{['ИДЕЯ','СЦЕНЫ','ЗВУК'].map((t,i)=><div key={t} style={{padding:'14px 18px',borderRadius:16,background:['#e7b64d','#d87258','#56a393'][i],border:'4px solid #171b22',color:'#fff',font:'900 22px Arial',transform:`translateY(${Math.sin(frame/32+i)*2}px) rotate(${i-1}deg)`}}>{t}</div>)}</div>
    </>,
    <><Room frame={global}/><Hero frame={global} emotion="happy" x={-190} speaking={speaking}/><div style={{position:'absolute',top:350,right:45,width:430,height:560,borderRadius:36,background:'linear-gradient(135deg,#e8b58b,#f7e2bd)',border:'16px solid #171c25',transform:'rotate(0.4deg)'}}><div style={{position:'absolute',inset:18,border:'4px solid #fff8e6',borderRadius:22}}/><div style={{position:'absolute',top:115,left:65,transform:'scale(1.15) rotate(9deg)'}}><Mug frame={global}/></div><div style={{position:'absolute',bottom:25,left:20,right:20,textAlign:'center',font:'900 31px Arial',color:'#25343b'}}>СДЕЛАНО ВРУЧНУЮ</div></div><div style={{position:'absolute',top:1460,left:90,right:90,padding:28,borderRadius:25,background:'#fff8e9',color:'#252831',font:'800 36px/1.16 Arial',textAlign:'center',boxShadow:'0 14px 25px #10131a55'}}>Теперь это похоже на мой бренд.</div><div style={{position:'absolute',top:190,left:145,right:95,display:'flex',alignItems:'center',justifyContent:'center',gap:14,padding:'12px 18px',borderRadius:28,background:'#171b22e8',border:'4px solid #f0c449'}}><Img src={staticFile(BASE+'academy-mark.svg')} style={{width:54,height:50}}/><div style={{font:'900 27px Arial',color:'#fff8ec',textShadow:'0 3px 8px #151a22'}}>АКАДЕМИЯ СПРОСИ AI<br/><span style={{fontSize:19,fontWeight:600}}>sprosi-ai-mockup.vercel.app/app/</span></div></div></>,
  ];
  return <AbsoluteFill style={{overflow:'hidden',background:'#171b24'}}><div style={{position:'absolute',inset:0,transform:`scale(${camera}) translate(${cameraX}px,${cameraY}px)`,transformOrigin:'center center'}}>{shots[index]}</div>
    <div style={{position:'absolute',top:45,left:36,padding:'10px 18px',borderRadius:18,background:'#171b24dd',color:'#fff4e4',font:'800 20px Arial',letterSpacing:1}}>СПРОСИ AI · {String(index+1).padStart(2,'0')}</div>
    <Caption index={index}/>
    <div style={{position:'absolute',bottom:55,left:55,right:55,height:8,borderRadius:8,background:'#ffffff55'}}><div style={{height:'100%',width:`${((index*SHOT+frame+1)/TOTAL)*100}%`,background:'#f4c84e',borderRadius:8}}/></div>
  </AbsoluteFill>;
};

const RiskCard: FC<{color:string;title:string;sub:string;frame:number}> = ({color,title,sub,frame}) => {const y=interpolate(frame,[0,12],[140,0],clamp);return <div style={{flex:1,height:315,alignSelf:'flex-start',borderRadius:25,background:color,color:'#fff',padding:22,boxSizing:'border-box',transform:`translateY(${y}px) rotate(${frame < 12 ? 0 : title === 'ВЫЛОЖИТЬ' ? -1.2 : 1.2}deg)`,boxShadow:'0 15px 35px #111a',border:'5px solid #181d25'}}><div style={{font:'1000 40px Arial',textAlign:'center'}}>{title}</div><div style={{marginTop:25,textAlign:'center',font:'800 30px/1.1 Arial'}}>{sub}</div></div>};

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
