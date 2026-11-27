import type {FC, ReactNode} from 'react';
import {AbsoluteFill, Audio, Composition, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import voiceScript from './episodes/episode-002-voice.json';

const FPS = 30;
const SHOT = 4 * FPS;
const TOTAL = 12 * SHOT;
type VoiceVariant = 'google' | 'elevenlabs';
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};

const captions = [
  '23:18. Смена закончилась. А сил на своё дело — нет.',
  '«10 000 подписчиков за неделю». И таких обещаний — десятки.',
  'Купил «секрет». Получил мотивацию вместо понятного плана.',
  'Снял по шаблону. 17 просмотров. Палец уже над «удалить».',
  'Но коллега пишет: «Покажешь, как убрать дубли в таблице?»',
  'У него уже есть навык. Не хватает способа объяснить его людям.',
  'На «Спроси AI» он учится собирать идею в короткую историю.',
  'Хук. Проблема. Один понятный шаг. И результат на экране.',
  'Перезаписывает. Ошибается. Снова ставит телефон на штатив.',
  'Первый полезный ролик — и первая тысяча подписчиков.',
  'Позже — 2 300. Это путь Ильи, а не обещание курса.',
  'Какой навык ты мог бы объяснить за 30 секунд? Академия «Спроси AI».',
];

const Room: FC<{frame:number;warm?:number}> = ({frame,warm=0}) => {
  const lamp = .32 + Math.sin(frame/47)*.025;
  return <svg viewBox="0 0 1080 1920" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
    <defs>
      <linearGradient id="office-wall" x2=".2" y2="1"><stop stopColor="#283442"/><stop offset=".58" stopColor="#45434a"/><stop offset="1" stopColor="#272831"/></linearGradient>
      <linearGradient id="office-window" x2="0" y2="1"><stop stopColor="#162542"/><stop offset="1" stopColor="#566681"/></linearGradient>
      <linearGradient id="desk-wood" x2="0" y2="1"><stop stopColor="#b27b4d"/><stop offset="1" stopColor="#634436"/></linearGradient>
      <radialGradient id="lamp-glow"><stop stopColor="#ffc66d" stopOpacity={lamp + warm*.22}/><stop offset="1" stopColor="#ffc66d" stopOpacity="0"/></radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#office-wall)"/>
    <rect width="1080" height="1120" fill="#d5a96b" opacity={warm*.12}/>
    <path d="M0 1370H1080V1920H0Z" fill="#25262e"/>
    <path d="M0 1460H1080M0 1620H1080M0 1780H1080" stroke="#161a21" strokeWidth="12" opacity=".68"/>
    {/* Fixed window, skyline and 23:18 wall clock */}
    <rect x="52" y="173" width="390" height="620" rx="12" fill="#151b25" stroke="#141922" strokeWidth="22"/>
    <rect x="76" y="196" width="342" height="575" fill="url(#office-window)"/>
    <circle cx="340" cy="285" r="43" fill="#f1dfb7" opacity=".9"/>
    <path d="M77 620L143 540 207 589 272 470 343 567 418 505V770H77Z" fill="#202b3c"/>
    {[95,160,223,287,350,390].map((x,i)=><g key={x} opacity=".7"><rect x={x} y={i%2?642:676} width="12" height="18" fill="#ffd77e"/><rect x={x+19} y={i%3?706:668} width="9" height="15" fill="#ffd77e"/></g>)}
    <path d="M248 197V771M78 483H418" stroke="#111822" strokeWidth="16"/>
    <circle cx="610" cy="272" r="104" fill="#e7e0d2" stroke="#171b22" strokeWidth="17"/>
    <path d="M610 272L610 202M610 272L660 290" fill="none" stroke="#283441" strokeWidth="12" strokeLinecap="round"/>
    <text x="610" y="341" textAnchor="middle" fontSize="30" fontWeight="900" fill="#35404b">23:18</text>
    {/* Office shelves, plant, coat and work table */}
    <path d="M716 510H1026L1008 550H732Z" fill="#825b44" stroke="#171b22" strokeWidth="13"/>
    {[{x:765,c:'#d58e5c'},{x:838,c:'#577f7f'},{x:916,c:'#c3a06b'}].map((p,i)=><g key={i}><path d={`M${p.x} 507Q${p.x-12} 476 ${p.x} 452Q${p.x+10} 478 ${p.x+22} 507Z`} fill={p.c} stroke="#171b22" strokeWidth="8"/><path d={`M${p.x-8} 486Q${p.x+8} 495 ${p.x+24} 482`} fill="none" stroke="#f4d69e" strokeWidth="5"/></g>)}
    <path d="M0 1128Q240 1100 520 1127T1080 1116V1260H0Z" fill="url(#desk-wood)" stroke="#171b22" strokeWidth="20"/>
    <path d="M0 1150H1080M88 1200Q220 1183 354 1200T626 1198M709 1173Q858 1188 1030 1174" fill="none" stroke="#55382d" strokeWidth="5" opacity=".48"/>
    <path d="M65 1260L43 1430H137L164 1260M919 1260L942 1430H1030L1006 1260" fill="#634532" stroke="#171b22" strokeWidth="16"/>
    {/* desk lamp stays in same place */}
    <ellipse cx="837" cy="1008" rx="270" ry="230" fill="url(#lamp-glow)"/>
    <path d="M886 1127L842 948L936 827L853 711" fill="none" stroke="#171b22" strokeWidth="24" strokeLinecap="round"/>
    <path d="M886 1127L842 948L936 827L853 711" fill="none" stroke="#d6a354" strokeWidth="13" strokeLinecap="round"/>
    <path d="M802 721L846 671L907 702L877 751Z" fill="#e6b55d" stroke="#171b22" strokeWidth="14"/>
    {/* laptop + spreadsheet */}
    <path d="M525 950L745 950L787 1116H494Z" fill="#222c37" stroke="#151b22" strokeWidth="14"/>
    <rect x="544" y="970" width="181" height="122" rx="4" fill="#b7d8cf"/>
    <path d="M544 1002H725M544 1032H725M544 1062H725M589 970V1092M635 970V1092M681 970V1092" stroke="#587f76" strokeWidth="4"/>
    <rect x="633" y="1033" width="46" height="28" fill="#e3c45e" stroke="#587f76" strokeWidth="3"/>
    <path d="M505 1117H783L808 1140H485Z" fill="#89949d" stroke="#171b22" strokeWidth="11"/>
    <rect x="90" y="1035" width="82" height="96" rx="13" fill="#ad7b58" stroke="#171b22" strokeWidth="10"/>
    <path d="M105 1043Q87 1004 104 979Q122 1006 121 1040M136 1040Q140 1001 164 991Q163 1028 146 1045" fill="#47766c" stroke="#171b22" strokeWidth="8"/>
  </svg>;
};

const Ilya: FC<{frame:number; mood?:'exhausted'|'doubt'|'focus'|'hope'|'joy'; x?:number; size?:number; walk?:boolean; talk?:boolean; gesture?:'phone'|'type'|'point'|'fist'|'open'}> = ({frame,mood='focus',x=0,size=1,walk=false,talk=false,gesture='open'}) => {
  const step=walk?Math.sin(frame/3):0;
  const bob=Math.abs(step)*6+Math.sin(frame/19)*2;
  const mouthOpen=talk && Math.floor(frame/5)%2===0;
  const blink=frame%109>103&&frame%109<107?.18:1;
  const mouth=mood==='exhausted'?'M291 480Q335 468 379 480':mood==='joy'?'M286 470Q335 528 384 470Q335 545 286 470':mouthOpen?'M307 472Q335 458 363 472Q363 498 335 503Q307 498 307 472':'M302 481Q335 466 368 481';
  const arm=gesture==='phone'?`M475 710Q548 648 548 559`:gesture==='type'?`M474 729Q528 792 485 861`:gesture==='point'?`M471 706Q548 644 561 530`:gesture==='fist'?`M470 702Q534 650 524 610`:`M470 718Q555 775 548 850`;
  return <div style={{position:'absolute',left:`calc(50% + ${x}px)`,bottom:120,width:480,height:890,transform:`translateX(-50%) scale(${size}) translateY(${bob}px)`,transformOrigin:'bottom center'}}>
    <svg viewBox="0 0 650 900" width="100%" height="100%" style={{overflow:'visible'}}>
      <ellipse cx="326" cy="875" rx="225" ry="22" fill="#11151c" opacity=".44"/>
      {/* trousers and walking legs */}
      <path d="M205 680H448L431 814L407 858H333L319 777L296 858H222L211 804Z" fill="#323d4a" stroke="#171b22" strokeWidth="17"/>
      <g transform={`rotate(${step*19} 266 784)`}><path d="M218 790L304 798L292 857H219Z" fill="#303c49" stroke="#171b22" strokeWidth="11"/><path d="M219 846Q259 858 298 845L318 875H210Z" fill="#d9d2c4" stroke="#171b22" strokeWidth="11" strokeLinejoin="round"/></g>
      <g transform={`rotate(${-step*19} 383 784)`}><path d="M338 790L425 790L415 855H340Z" fill="#303c49" stroke="#171b22" strokeWidth="11"/><path d="M340 845Q380 858 421 842L442 875H331Z" fill="#d9d2c4" stroke="#171b22" strokeWidth="11" strokeLinejoin="round"/></g>
      {/* hoodie / overshirt */}
      <path d="M208 407Q233 378 279 369H374Q422 381 451 413L489 696Q329 741 168 696Z" fill="#496b61" stroke="#171b22" strokeWidth="18"/>
      <path d="M279 373L329 436L380 373L404 405L367 483L329 459L290 483L253 407Z" fill="#d5d2c6" stroke="#171b22" strokeWidth="11" strokeLinejoin="round"/>
      <path d="M329 460V695M224 534Q329 556 465 529" fill="none" stroke="#304c45" strokeWidth="8" opacity=".8"/>
      <path d="M217 450Q160 481 169 550L197 677" fill="none" stroke="#171b22" strokeWidth="76" strokeLinecap="round"/>
      <path d="M217 450Q160 481 169 550L197 677" fill="none" stroke="#496b61" strokeWidth="48" strokeLinecap="round"/>
      <path d={arm} fill="none" stroke="#171b22" strokeWidth="77" strokeLinecap="round"/>
      <path d={arm} fill="none" stroke="#496b61" strokeWidth="49" strokeLinecap="round"/>
      {/* neck and head */}
      <path d="M282 351Q329 383 377 351L386 421H274Z" fill="#c98f6d" stroke="#171b22" strokeWidth="13"/>
      <ellipse cx="329" cy="250" rx="139" ry="160" fill="#d8a17c" stroke="#171b22" strokeWidth="17"/>
      <path d="M193 248Q173 133 254 92Q343 47 421 105Q477 148 462 259Q424 214 378 201Q307 237 222 207Z" fill="#292b30" stroke="#171b22" strokeWidth="17"/>
      <path d="M205 157Q238 83 293 91M333 101Q388 83 433 131" fill="none" stroke="#44434a" strokeWidth="17" strokeLinecap="round"/>
      <path d={mood==='exhausted'?'M235 213Q267 230 298 215':'M232 208Q264 189 299 207'} fill="none" stroke="#29272a" strokeWidth="13" strokeLinecap="round"/>
      <path d={mood==='exhausted'?'M360 215Q391 231 423 214':'M358 205Q391 188 423 207'} fill="none" stroke="#29272a" strokeWidth="13" strokeLinecap="round"/>
      <ellipse cx="268" cy="238" rx="28" ry={34*blink} fill="#fffaf1" stroke="#171b22" strokeWidth="8"/><ellipse cx="392" cy="238" rx="28" ry={34*blink} fill="#fffaf1" stroke="#171b22" strokeWidth="8"/>
      <circle cx={mood==='doubt'?279:270} cy="242" r="13" fill="#334c62"/><circle cx="395" cy="242" r="13" fill="#334c62"/><circle cx="273" cy="237" r="5" fill="#fff"/><circle cx="398" cy="237" r="5" fill="#fff"/>
      <path d={mouth} fill="#7d3f45" stroke="#512c33" strokeWidth="7" strokeLinecap="round"/>
      {mood==='exhausted'&&<path d="M234 290Q266 304 297 291M362 290Q392 304 422 290" fill="none" stroke="#714d48" strokeWidth="6" opacity=".55"/>}
      {mood==='joy'&&<path d="M235 278Q266 298 297 278M362 278Q392 298 421 278" fill="none" stroke="#e48875" strokeWidth="13" strokeLinecap="round" opacity=".65"/>}
      {gesture==='phone'?<><rect x="514" y="486" width="68" height="106" rx="13" fill="#202833" stroke="#171b22" strokeWidth="10"/><rect x="523" y="500" width="50" height="74" rx="7" fill="#dce7dc"/><circle cx="548" cy="582" r="4" fill="#f2d478"/></>:null}
      {gesture==='point'?<path d="M541 530L568 486" stroke="#d8a17c" strokeWidth="19" strokeLinecap="round"/>:null}
    </svg>
  </div>;
};

const Brand:FC=()=> <div style={{position:'absolute',top:125,left:78,right:78,display:'flex',justifyContent:'center',alignItems:'center',gap:18,padding:'16px 20px',borderRadius:24,background:'#171c25eF',border:'3px solid #f0c449',boxShadow:'0 12px 35px #1119'}}><Img src={staticFile('episodes/episode-001/academy-mark.svg')} style={{width:58,height:55,filter:'brightness(0) invert(1)'}}/><div style={{font:'900 27px/1.14 Arial',color:'#fff8ec'}}>АКАДЕМИЯ «СПРОСИ AI»<br/><span style={{fontSize:18,fontWeight:600}}>Обучение искусственному интеллекту</span></div></div>;

const DeskLaptop:FC<{frame:number;zoom?:boolean}> = ({frame,zoom=false})=><div style={{position:'absolute',left:zoom?125:455,top:zoom?480:780,width:zoom?820:315,height:zoom?540:270,transform:`rotate(${zoom?-1:-3}deg)`,filter:'drop-shadow(0 20px 20px #10141b75)'}}>
  <div style={{height:'88%',border:'14px solid #141a22',borderRadius:'26px 26px 9px 9px',background:'#b9d8cf',overflow:'hidden',boxSizing:'border-box'}}>
    <div style={{height:44,background:'#405a56',color:'#f5f1df',font:'800 22px Arial',padding:'10px 18px',boxSizing:'border-box'}}>ТАБЛИЦА · ПОИСК ДУБЛЕЙ</div>
    <div style={{padding:18,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:7}}>{['Имя','Заказ','Имя','Сумма','Аня','1024','Игорь','850','Маша','760','Игорь','850','Дима','940','Аня','1024'].map((word,i)=><div key={`${word}-${i}`} style={{background:i===10?'#f0c449':'#e6eee5',border:'2px solid #63827a',padding:'10px 4px',textAlign:'center',font:'700 20px Arial',color:'#263a38',transform:i===10?`scale(${1+Math.sin(frame/6)*.04})`:undefined}}>{word}</div>)}</div>
    <div style={{margin:'8px 22px',padding:12,background:'#fff8e6',borderRadius:10,font:'800 20px Arial',color:'#2b4540'}}>Дубликат найден → одна команда → чистая таблица ✓</div>
  </div><div style={{height:'12%',margin:'0 -20px',background:'linear-gradient(#909ba2,#46515b)',clipPath:'polygon(3% 0,97% 0,100% 100%,0 100%)',borderRadius:'0 0 25px 25px'}}/>
</div>;

const Phone:FC<{frame:number;variant:'hype'|'bad'|'message'|'post'|'count';count?:string}> = ({frame,variant,count=''})=>{
  const shake=variant==='hype'?Math.sin(frame*1.7)*3:0;
  return <div style={{position:'absolute',right:variant==='message'?70:95,top:variant==='hype'?360:variant==='count'?405:470,width:variant==='hype'?420:390,height:variant==='hype'?730:675,border:'16px solid #151a22',borderRadius:48,background:'#e7e5dd',boxShadow:'0 24px 45px #10131b99',transform:`rotate(${variant==='hype'?3:-2}deg) translateY(${variant==='hype'?shake:0}px)`,overflow:'hidden'}}>
    <div style={{height:44,margin:'0 24px',borderBottom:'5px solid #343b45',display:'flex',justifyContent:'space-between',alignItems:'center',color:'#303943',font:'800 19px Arial'}}><span>◉  23:18</span><span>▮▮▮  84%</span></div>
    {variant==='hype'&&<><div style={{margin:24,padding:20,borderRadius:24,background:'#38215d',color:'#fff',font:'1000 33px/1.08 Arial',textAlign:'center',boxShadow:'0 8px 0 #201438'}}>10 000<br/>ПОДПИСЧИКОВ<br/><span style={{color:'#ffe456'}}>ЗА 7 ДНЕЙ!</span></div><div style={{display:'flex',justifyContent:'center',gap:18}}><div style={{width:112,height:112,borderRadius:'50%',background:'#e1a241',border:'7px solid white',display:'grid',placeItems:'center',font:'900 38px Arial'}}>?</div><div style={{width:112,height:112,borderRadius:'50%',background:'#43b5ad',border:'7px solid white',display:'grid',placeItems:'center',font:'900 38px Arial'}}>★</div></div><div style={{margin:22,padding:16,background:'#fff',borderRadius:18,color:'#49356c',font:'900 26px/1.15 Arial',textAlign:'center'}}>Секретный метод<br/>Только сегодня −80%</div><div style={{textAlign:'center',font:'900 22px Arial',color:'#5b5960'}}>ЛИСТАТЬ ДАЛЬШЕ ↗</div></>}
    {variant==='bad'&&<><div style={{margin:24,padding:18,background:'#f5f2e9',borderRadius:20,color:'#333b44',font:'900 27px Arial'}}>Курс «Секрет успеха»</div><div style={{margin:'0 24px',height:240,borderRadius:20,background:'linear-gradient(145deg,#bfa2cb,#f2d27c)',display:'grid',placeItems:'center',font:'1000 50px Arial',color:'#fff',textShadow:'0 3px 8px #333'}}>ВЕРЬ В СЕБЯ!</div><div style={{margin:24,padding:20,borderRadius:18,background:'#fff',color:'#4b525a',font:'700 23px/1.2 Arial'}}>Модуль 1: мышление миллионера<br/><br/>Модуль 2: мышление победителя</div><div style={{textAlign:'center',font:'900 25px Arial',color:'#cf594e'}}>ГДЕ ПОНЯТНЫЙ ПЛАН?</div></>}
    {variant==='message'&&<><div style={{margin:22,padding:18,borderRadius:20,background:'#fff',color:'#47515c',font:'800 21px Arial'}}>Коллега · 23:19</div><div style={{margin:20,padding:22,borderRadius:'22px 22px 22px 4px',background:'#5b927f',color:'#fff',font:'900 29px/1.18 Arial'}}>Илья, покажешь, как убрать дубли из таблицы? Ты же вчера за минуту сделал.</div><div style={{margin:20,padding:18,borderRadius:18,background:'#fff',color:'#35414b',font:'700 23px Arial'}}>👍 Спасибо, выручил!</div><div style={{position:'absolute',bottom:30,left:22,right:22,padding:16,borderRadius:18,background:'#d4ddd6',font:'700 20px Arial',color:'#48534f'}}>Ответить…</div></>}
    {variant==='post'&&<><div style={{margin:18,padding:15,borderRadius:17,background:'#fff',font:'800 22px Arial',color:'#33413d'}}>МОЙ ПЕРВЫЙ ПОЛЕЗНЫЙ РОЛИК</div><div style={{margin:'0 18px',height:340,borderRadius:19,background:'#203346',position:'relative',overflow:'hidden'}}><div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#213953,#476958)'}}/><div style={{position:'absolute',left:34,right:34,top:55,padding:18,borderRadius:14,background:'#e9f1dc',font:'900 26px/1.1 Arial',color:'#243b37'}}>ДУБЛИ В ТАБЛИЦЕ?<br/>ВОТ РЕШЕНИЕ →</div><div style={{position:'absolute',left:48,right:48,bottom:45,height:110,background:'#a6c8b9',border:'7px solid #17232d',borderRadius:12}}/><div style={{position:'absolute',left:90,top:138,font:'1000 60px Arial',color:'#ffe071'}}>▶</div></div><div style={{margin:18,padding:15,background:'#fff',borderRadius:15,font:'800 21px Arial',color:'#33413d'}}>Просмотры: 17 → 1 204<br/>Сохранения: 86</div></>}
    {variant==='count'&&<><div style={{margin:22,padding:18,borderRadius:18,background:'#fff',font:'900 23px Arial',color:'#3d4651'}}>ПОДПИСЧИКИ</div><div style={{margin:'50px 10px',textAlign:'center',font:'1000 82px/1 Arial',letterSpacing:-4,color:'#24343c',textShadow:'0 4px 0 #fff'}}>{count}</div><div style={{margin:'0 32px',padding:18,borderRadius:16,background:'#56a58b',color:'#fff',font:'900 25px Arial',textAlign:'center'}}>+ новые зрители</div><div style={{margin:28,textAlign:'center',font:'700 20px Arial',color:'#47535c'}}>полезные ролики Ильи</div></>}
  </div>;
};

const InfluencerPanels:FC<{frame:number}> = ({frame})=><div style={{position:'absolute',top:440,left:40,right:35,height:560,display:'flex',gap:15,alignItems:'center',transform:`translateX(${interpolate(frame,[0,12],[170,0],{...clamp,easing:Easing.out(Easing.cubic)})}px)`}}>
  {['10K ЗА НЕДЕЛЮ','СЕКРЕТНЫЙ МЕТОД','БЕЗ ОПЫТА!'].map((label,i)=><div key={label} style={{flex:1,height:470-i%2*55,border:'10px solid #151a22',borderRadius:28,background:['linear-gradient(145deg,#552965,#e45467) ','linear-gradient(145deg,#176d78,#50c9a6)','linear-gradient(145deg,#d45745,#e6a735)'][i],boxShadow:'0 16px 27px #1119',transform:`rotate(${i-1}deg) translateY(${Math.sin(frame/5+i)*8}px)`,position:'relative',overflow:'hidden'}}>
    <div style={{position:'absolute',top:30,left:20,right:20,textAlign:'center',font:'1000 25px/1 Arial',color:'#fff',textShadow:'0 3px #151a22'}}>{label}</div>
    <div style={{position:'absolute',top:106,left:'50%',width:152,height:152,borderRadius:'50%',transform:'translateX(-50%)',background:['#dca27d','#e9c090','#b78368'][i],border:'8px solid #171b22'}}><div style={{position:'absolute',top:62,left:29,width:15,height:20,borderRadius:'50%',background:'#202a31'}}/><div style={{position:'absolute',top:62,right:29,width:15,height:20,borderRadius:'50%',background:'#202a31'}}/><div style={{position:'absolute',top:101,left:49,width:40,height:17,borderBottom:'7px solid #7c3c46',borderRadius:'50%'}}/><div style={{position:'absolute',top:-20,left:0,right:0,height:50,background:'#22232b',borderRadius:'50%'}}/></div>
    <div style={{position:'absolute',bottom:28,left:16,right:16,padding:12,borderRadius:14,background:'#fff1d7',color:'#2e2734',font:'1000 20px Arial',textAlign:'center'}}>{i===1?'−80% СЕЙЧАС':'ЖМИ СЮДА!'}</div>
  </div>)}
</div>;

const StudyBoard:FC<{frame:number}> = ({frame})=><div style={{position:'absolute',right:32,top:375,width:440,height:750,border:'14px solid #171b22',borderRadius:31,background:'#f5e5c5',boxShadow:'0 22px 42px #1119',padding:22,boxSizing:'border-box',transform:`rotate(2deg) translateY(${interpolate(frame,[0,16],[120,0],clamp)}px)`}}>
  <div style={{font:'1000 28px Arial',color:'#27343d',borderBottom:'4px solid #b98d58',paddingBottom:12}}>МОЙ ПЛАН РОЛИКА</div>
  {[['1','Проблема: дубли'],['2','Хук: «Опять ошибка?»'],['3','Покажи один приём'],['4','До / после в таблице'],['5','Спроси: было полезно?']].map((x,i)=><div key={x[0]} style={{display:'flex',gap:11,alignItems:'center',marginTop:25,transform:`translateX(${frame>20&&i===2?Math.sin(frame/5)*3:0}px)`}}><div style={{width:39,height:39,borderRadius:'50%',background:i<Math.floor(frame/20)?'#5c9c81':'#e8ba55',display:'grid',placeItems:'center',font:'900 22px Arial',color:'#fff',border:'3px solid #27323a'}}>{x[0]}</div><div style={{font:'800 20px/1.08 Arial',color:'#29333b'}}>{x[1]}</div></div>)}
  <div style={{position:'absolute',bottom:20,left:20,right:20,height:190,borderRadius:18,overflow:'hidden',border:'5px solid #26333a'}}><Img src={staticFile('episodes/episode-001/academy-course-mobile.png')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}}/></div>
</div>;

const PhoneTripod:FC<{frame:number}> = ({frame})=><div style={{position:'absolute',right:75,top:450,width:200,height:650,transform:`rotate(${Math.sin(frame/17)*1.5}deg)`}}><div style={{position:'absolute',left:25,top:0,width:150,height:265,border:'12px solid #171b22',borderRadius:27,background:'#252f39',boxShadow:'0 15px 25px #1119'}}><div style={{position:'absolute',inset:12,borderRadius:12,background:'linear-gradient(145deg,#23404d,#6b967a)'}}/><div style={{position:'absolute',top:80,left:25,right:25,padding:12,background:'#fff3d8',color:'#23333b',font:'900 19px Arial',textAlign:'center'}}>ДУБЛИ?<br/>РЕШЕНИЕ ЗА 10 СЕК.</div><div style={{position:'absolute',bottom:15,left:55,width:22,height:22,borderRadius:'50%',background:'#d7524a'}}/></div><path d="M100 264V427M100 391L21 624M100 391L180 624M100 391V627" fill="none" stroke="#171b22" strokeWidth="17" strokeLinecap="round"/><path d="M100 270V420M100 391L27 612M100 391L173 612M100 391V618" fill="none" stroke="#9aa4a6" strokeWidth="7" strokeLinecap="round"/><path d="M24 624H177" stroke="#171b22" strokeWidth="12" strokeLinecap="round"/><div style={{position:'absolute',top:650,left:20,right:20,textAlign:'center',font:'900 19px Arial',color:'#f8ecd3'}}>СВЕТ · КАДР · ПОВТОР</div></div>;

const Scene:FC<{index:number}> = ({index})=>{
  const frame=useCurrentFrame();
  const global=index*SHOT+frame;
  const zoom=interpolate(frame,[0,SHOT-1],[index%2?1.035:1.015,index%2?1.085:1.07],ease);
  const tx=interpolate(frame,[0,SHOT-1],[index%2?18:-12,index%2?-17:13],ease);
  const ty=interpolate(frame,[0,SHOT-1],[10,-8],ease);
  const line=voiceScript.lines[index];
  const talk=frame>=3&&frame<92;
  const shots:ReactNode[]=[
    <><Room frame={global}/><Ilya frame={frame} mood="exhausted" x={-115} size={1.12} gesture="phone"/><div style={{position:'absolute',top:232,left:487,padding:'11px 18px',borderRadius:18,background:'#171b22',color:'#f7e6c8',font:'900 27px Arial'}}>СМЕНА ЗАКОНЧЕНА</div><div style={{position:'absolute',top:925,left:63,width:405,height:100,padding:17,background:'#e9dfcf',border:'8px solid #171b22',borderRadius:19,transform:'rotate(-4deg)',font:'900 25px Arial',color:'#34353a'}}>СЧЁТ: 0 ₽<br/>ЭНЕРГИЯ: 2%</div></>,
    <><Room frame={global}/><Ilya frame={frame} mood="doubt" x={-294} size={.72} walk/><InfluencerPanels frame={frame}/><Phone frame={frame} variant="hype"/><div style={{position:'absolute',top:1240,left:80,right:80,textAlign:'center',font:'1000 44px Arial',color:'#ffe071',textShadow:'0 5px #171b22'}}>ВСЕ ОБЕЩАЮТ БЫСТРО</div></>,
    <><Room frame={global}/><Ilya frame={frame} mood="exhausted" x={-245} size={.85} gesture="phone"/><Phone frame={frame} variant="bad"/><div style={{position:'absolute',top:1210,left:52,right:52,textAlign:'center',font:'1000 38px Arial',color:'#f4c96c',textShadow:'0 4px #171b22'}}>МНОГО ГРОМКИХ СЛОВ.<br/>НИ ОДНОГО ПОНЯТНОГО ШАГА.</div></>,
    <><Room frame={global}/><Ilya frame={frame} mood="doubt" x={-238} size={.88} gesture="type"/><DeskLaptop frame={frame}/><div style={{position:'absolute',top:400,right:62,width:350,height:435,border:'12px solid #171b22',borderRadius:28,background:'linear-gradient(145deg,#596b7b,#28313d)',boxShadow:'0 18px 35px #1119'}}><div style={{margin:26,padding:16,background:'#f1e9d7',borderRadius:15,color:'#30353c',font:'900 24px/1.15 Arial'}}>«5 формул Excel, которые изменят твою жизнь»</div><div style={{margin:'0 20px',height:147,background:'#a5d1c1',border:'7px solid #171b22',borderRadius:14,display:'grid',placeItems:'center',font:'900 26px Arial',color:'#243a37'}}>17 ПРОСМОТРОВ</div><div style={{textAlign:'center',marginTop:20,font:'900 26px Arial',color:'#ffe5aa'}}>УДАЛИТЬ?  ✕</div></div><div style={{position:'absolute',top:1110,right:140,font:'1000 48px Arial',color:'#e66558'}}>17</div></>,
    <><Room frame={global}/><Ilya frame={frame} mood="doubt" x={-250} size={.9} gesture="phone"/><Phone frame={frame} variant="message"/><div style={{position:'absolute',top:1190,left:50,right:50,textAlign:'center',font:'1000 36px/1.1 Arial',color:'#ffe071',textShadow:'0 4px #171b22'}}>ЕГО СПРОСИЛИ ИМЕННО О ТОМ,<br/>ЧТО ОН УМЕЕТ</div></>,
    <><Room frame={global} warm={.12}/><Ilya frame={frame} mood="focus" x={-255} size={.88} gesture="point"/><DeskLaptop frame={frame} zoom/><div style={{position:'absolute',top:310,left:62,width:380,padding:18,borderRadius:17,background:'#e9d49f',border:'5px solid #171b22',font:'900 25px Arial',color:'#28353d',transform:'rotate(-4deg)'}}>ОН УЖЕ МОЖЕТ ПОМОЧЬ.<br/>НАДО НАУЧИТЬСЯ ОБЪЯСНЯТЬ.</div><div style={{position:'absolute',top:1050,left:170,font:'900 30px Arial',color:'#fff2d5',textShadow:'0 4px #171b22'}}>ОТ ОШИБКИ → К ПОНЯТНОМУ РЕШЕНИЮ</div></>,
    <><Room frame={global} warm={.28}/><Ilya frame={frame} mood="hope" x={-270} size={.77} walk gesture="point"/><StudyBoard frame={frame}/></>,
    <><Room frame={global} warm={.4}/><Ilya frame={frame} mood="focus" x={-240} size={.78} talk={talk} gesture="point"/><DeskLaptop frame={frame} zoom/><div style={{position:'absolute',top:340,left:80,display:'flex',flexDirection:'column',gap:17}}>{['ХУК: «ОПЯТЬ ДУБЛИ?»','ПОКАЖИ ОДИН ПРИЁМ','СРАВНИ ДО И ПОСЛЕ'].map((t,i)=><div key={t} style={{padding:'15px 20px',border:'4px solid #171b22',borderRadius:14,background:['#edbd58','#d7735b','#59a08a'][i],color:'#fff',font:'900 23px Arial',transform:`translateX(${interpolate(frame,[0,14],[i%2?-190:190,0],clamp)}px) rotate(${i-1}deg)`}}>{t}</div>)}</div><div style={{position:'absolute',top:1135,left:135,right:135,textAlign:'center',font:'900 30px Arial',color:'#fff1d5',textShadow:'0 4px #171b22'}}>ОДИН НАВЫК. ОДНА МАЛЕНЬКАЯ ПОБЕДА.</div></>,
    <><Room frame={global} warm={.56}/><Ilya frame={frame} mood="focus" x={-260} size={.78} walk talk={talk} gesture="type"/><DeskLaptop frame={frame}/><PhoneTripod frame={frame}/><div style={{position:'absolute',top:290,left:95,padding:16,background:'#e7bd64',border:'4px solid #171b22',borderRadius:15,font:'900 25px Arial',transform:`rotate(-4deg) translateX(${interpolate(frame,[0,10],[-160,0],clamp)}px)`}}>ДУБЛЬ 3 · ЕЩЁ РАЗ</div></>,
    <><Room frame={global} warm={.75}/><Ilya frame={frame} mood="joy" x={-265} size={.78} walk gesture="fist"/><Phone frame={frame} variant="count" count="1 000"/><div style={{position:'absolute',top:1190,left:60,right:60,textAlign:'center',font:'1000 42px Arial',color:'#ffe071',textShadow:'0 5px #171b22'}}>ТЕПЕРЬ ТЫСЯЧА ЛЮДЕЙ ЖДЁТ СЛЕДУЮЩИЙ СОВЕТ</div><div style={{position:'absolute',top:1360,left:95,right:95,textAlign:'center',font:'700 24px Arial',color:'#fff4dd'}}>Не удача за ночь — регулярная практика.</div></>,
    <><Room frame={global} warm={.9}/><Ilya frame={frame} mood="joy" x={-280} size={.73} gesture="open"/><Phone frame={frame} variant="count" count="2 300"/><div style={{position:'absolute',top:1160,left:52,right:52,padding:18,borderRadius:15,background:'#1c262de8',color:'#fff2dc',font:'800 25px/1.2 Arial',textAlign:'center'}}>«Илья, покажи ещё приём с таблицами!»<br/><span style={{color:'#f3ce68'}}>Это личный путь героя. Результаты у всех разные.</span></div></>,
    <><Room frame={global} warm={1}/><Ilya frame={frame} mood="hope" x={-315} size={.8} walk gesture="point"/><div style={{position:'absolute',top:390,right:45,width:490,height:590,border:'12px solid #171b22',borderRadius:30,background:'linear-gradient(145deg,#23313a,#486959)',boxShadow:'0 20px 38px #1119',overflow:'hidden'}}><Img src={staticFile('episodes/episode-001/academy-course-mobile.png')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}}/></div><Brand/><div style={{position:'absolute',top:1085,left:52,right:52,padding:'22px 24px',borderRadius:19,background:'#f1c956',border:'5px solid #171b22',color:'#232831',font:'1000 32px/1.1 Arial',textAlign:'center',boxShadow:'0 10px 24px #1119'}}>КАКОЙ НАВЫК ТЫ МОГ БЫ ПОКАЗАТЬ?</div></>,
  ];
  const words=captions[index].split(/\s+/);
  const groupSize=Math.ceil(words.length/3);
  const group=Math.min(2,Math.floor(frame/(SHOT/3)));
  return <AbsoluteFill style={{overflow:'hidden',background:'#171b24'}}>
    <div style={{position:'absolute',inset:0,transform:`scale(${zoom}) translate(${tx}px,${ty}px)`,transformOrigin:'center center'}}>{shots[index]}</div>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#11172020 0%,transparent 43%,#10151a28 70%,#10151ae8 100%)',pointerEvents:'none'}}/>
    <div style={{position:'absolute',top:48,left:46,padding:'10px 15px',borderRadius:14,background:'#171c25db',color:'#fff5df',font:'800 19px Arial',letterSpacing:1}}>СПРОСИ AI · {String(index+1).padStart(2,'0')}</div>
    <div style={{position:'absolute',bottom:138,left:48,right:48,textAlign:'center',font:'900 39px/1.13 Arial,sans-serif',letterSpacing:-.35,color:'#fff9ed',WebkitTextStroke:'1px #151922',textShadow:'0 3px 7px #090a0dcc'}}>{words.map((word,i)=>{const active=Math.floor(i/groupSize)===group;return <span key={`${i}-${word}`} style={{display:'inline-block',marginRight:'.2em',color:active?'#ffda70':'#fff9ed',transform:`translateY(${active&&frame%40<8?interpolate(frame%40,[0,7],[5,0],{...clamp,easing:Easing.out(Easing.cubic)}):0}px)`}}>{word}</span>})}</div>
    <div style={{position:'absolute',bottom:69,left:65,right:65,height:5,borderRadius:5,background:'#ffffff55'}}><div style={{height:'100%',width:`${((index*SHOT+frame+1)/(TOTAL))*100}%`,borderRadius:5,background:'#f0c449'}}/></div>
  </AbsoluteFill>;
};

export const Episode002Promo:FC<{voiceVariant:VoiceVariant}> = ({voiceVariant})=><AbsoluteFill style={{background:'#171b24'}}>
  {Array.from({length:12},(_,index)=><Sequence key={`shot-${index}`} from={index*SHOT} durationInFrames={SHOT} premountFor={FPS}><Scene index={index}/></Sequence>)}
  {voiceScript.lines.map((line,index)=><Sequence key={line.id} from={index*SHOT+3} durationInFrames={SHOT-3}><Audio src={staticFile(`audio/episode-002/${voiceVariant}/${line.id}.mp3`)} volume={0.96}/></Sequence>)}
  <Sequence from={0}><Audio src={staticFile('audio/episode-001/sfx/notification.wav')} volume={0.38}/></Sequence>
  {[1,2,3,4,5,6,7,8,9,10,11].map((i)=><Sequence key={`swish-${i}`} from={i*SHOT-7}><Audio src={staticFile('audio/episode-001/sfx/whoosh.wav')} volume={i===4||i===6||i===9?0.2:0.15}/></Sequence>)}
  <Sequence from={2*SHOT+14}><Audio src={staticFile('audio/episode-001/sfx/impact.wav')} volume={0.28}/></Sequence>
  <Sequence from={8*SHOT}><Audio src={staticFile('audio/episode-001/sfx/tick.wav')} volume={0.27}/></Sequence>
  <Sequence from={9*SHOT+9}><Audio src={staticFile('audio/episode-001/sfx/resolution.wav')} volume={0.3}/></Sequence>
</AbsoluteFill>;

export const Episode002Composition:FC=()=> <>
  <Composition id="SprosiAcademyStoryPromoGemini" component={Episode002Promo} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{voiceVariant:'google'}}/>
  <Composition id="SprosiAcademyStoryPromoElevenLabs" component={Episode002Promo} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{voiceVariant:'elevenlabs'}}/>
</>;
