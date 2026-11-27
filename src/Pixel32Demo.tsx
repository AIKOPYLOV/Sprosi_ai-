import type {FC} from 'react';
import {AbsoluteFill, Audio, Composition, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';

const FPS = 30;
const SHOT = 2 * FPS;
const TOTAL = SHOT * 3;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

const PixelRoom:FC<{frame:number; mood?:'late'|'warm'}> = ({frame,mood='late'}) => <svg viewBox="0 0 270 480" width="1080" height="1920" style={{position:'absolute',inset:0,imageRendering:'pixelated'}} shapeRendering="crispEdges">
  <rect width="270" height="480" fill={mood==='late'?'#26344f':'#39465b'}/>
  <rect y="0" width="270" height="14" fill="#1a2439"/>
  {/* night window and simplified city lights */}
  <rect x="13" y="31" width="94" height="151" fill="#121d36" stroke="#101827" strokeWidth="7"/>
  <rect x="19" y="37" width="82" height="139" fill="#20385a"/>
  <rect x="21" y="129" width="78" height="45" fill="#182c49"/>
  <rect x="28" y="117" width="17" height="52" fill="#172841"/><rect x="50" y="105" width="18" height="64" fill="#192b47"/><rect x="75" y="122" width="21" height="47" fill="#172841"/>
  {[{x:31,y:137},{x:39,y:149},{x:55,y:120},{x:62,y:136},{x:82,y:133},{x:90,y:151},{x:43,y:83},{x:85,y:58}].map((p,i)=><rect key={i} x={p.x} y={p.y} width="3" height="4" fill={i===frame%8?'#fff0a5':'#f0bf69'} opacity={i===frame%8?1:.72}/>)}
  <rect x="53" y="32" width="5" height="145" fill="#101827"/><rect x="17" y="94" width="86" height="5" fill="#101827"/>
  <rect x="81" y="45" width="8" height="8" fill="#fff0b3"/><rect x="83" y="45" width="8" height="8" fill="#20385a"/>
  {/* wall clock, shelf, plants */}
  <rect x="160" y="35" width="49" height="43" fill="#172235"/><rect x="165" y="40" width="39" height="33" fill="#e7d4a6"/>
  <rect x="183" y="44" width="3" height="12" fill="#29354b"/><rect x="183" y="55" width="12" height="3" fill="#29354b"/>
  <rect x="142" y="101" width="113" height="6" fill="#80573f"/>
  <rect x="153" y="86" width="15" height="15" fill="#bf8055"/><rect x="173" y="78" width="18" height="23" fill="#6f8f8a"/><rect x="197" y="88" width="23" height="13" fill="#d4ad67"/>
  <rect x="230" y="224" width="17" height="31" fill="#855d48"/><rect x="228" y="215" width="9" height="14" fill="#70a48b"/><rect x="238" y="207" width="10" height="22" fill="#56866e"/><rect x="247" y="217" width="9" height="13" fill="#75a98c"/>
  {/* wall/floor separation and wood floor */}
  <rect y="281" width="270" height="199" fill="#25283a"/><rect y="281" width="270" height="8" fill="#141b29"/>
  {[300,327,354,381].map((y,i)=><g key={y}><rect x="0" y={y} width="270" height="3" fill="#171e2d"/><rect x={i%2?28:84} y={y+10} width="3" height="17" fill="#171e2d"/></g>)}
  {/* desk stays fixed across shots */}
  <rect x="21" y="255" width="234" height="14" fill="#b78052"/><rect x="21" y="255" width="234" height="4" fill="#d29a61"/><rect x="29" y="269" width="9" height="73" fill="#684837"/><rect x="238" y="269" width="9" height="73" fill="#684837"/>
  <rect x="42" y="245" width="12" height="10" fill="#d9c8a6"/><rect x="48" y="238" width="5" height="8" fill="#ebe0c8"/>
  {/* laptop with spreadsheet */}
  <rect x="127" y="204" width="82" height="55" fill="#111a29"/><rect x="131" y="208" width="74" height="44" fill="#9cc6b3"/>
  <rect x="132" y="213" width="72" height="6" fill="#568876"/>
  {[225,234,243].map(y=><rect key={y} x="132" y={y} width="72" height="1.5" fill="#5b8a78"/>)}
  {[150,168,186].map(x=><rect key={x} x={x} y="219" width="1.5" height="33" fill="#5b8a78"/>)}
  <rect x="169" y="235" width="16" height="8" fill="#efc762"/>
  <path d="M120 259H216L224 265H114Z" fill="#9aa8ae"/>
  {/* pixel task lamp */}
  <rect x="229" y="134" width="22" height="9" fill="#171d2a"/><rect x="235" y="128" width="14" height="7" fill="#f2c56e"/>
  <rect x="240" y="142" width="4" height="41" fill="#bd945b"/><rect x="222" y="180" width="22" height="4" fill="#bd945b"/><rect x="220" y="183" width="23" height="4" fill="#171d2a"/>
  {/* warm pool of light grows as he starts practicing */}
  <rect x="205" y="190" width="53" height="64" fill="#f4cb75" opacity={mood==='warm'?.11:.045}/>
</svg>;

const PixelIlya:FC<{frame:number;x:number;y:number;expression?:'tired'|'curious'|'focused'|'confident';walking?:boolean;gesture?:'phone'|'type'|'point'|'wave';scale?:number}> = ({frame,x,y,expression='tired',walking=false,gesture='phone',scale=1})=>{
  const step=walking?Math.sin(frame/3):0;
  const bob=walking?Math.abs(step)*2:Math.sin(frame/11)*.5;
  const eyeBlink=frame%86>81&&frame%86<84;
  const sx=step>0?3:0;
  return <svg viewBox="0 0 270 480" width="1080" height="1920" style={{position:'absolute',inset:0,imageRendering:'pixelated'}} shapeRendering="crispEdges"><g transform={`translate(${x} ${y+bob}) scale(${scale})`} shapeRendering="crispEdges">
    {/* short dark hair, face, ears */}
    <rect x="19" y="0" width="34" height="9" fill="#171a24"/><rect x="13" y="7" width="45" height="12" fill="#252633"/><rect x="10" y="13" width="8" height="16" fill="#252633"/><rect x="53" y="13" width="7" height="16" fill="#252633"/>
    <rect x="17" y="14" width="38" height="41" fill="#d89970"/><rect x="13" y="24" width="5" height="16" fill="#d89970"/><rect x="54" y="24" width="5" height="15" fill="#d89970"/>
    <rect x="20" y="9" width="10" height="7" fill="#171a24"/><rect x="33" y="6" width="13" height="9" fill="#171a24"/><rect x="47" y="11" width="8" height="7" fill="#171a24"/>
    {/* brows, eyes with a readable shift in expression */}
    <rect x="23" y={expression==='tired'?25:22} width="9" height="3" fill="#3c2930"/><rect x="41" y={expression==='tired'?25:22} width="9" height="3" fill="#3c2930"/>
    {eyeBlink?<><rect x="24" y="31" width="9" height="2" fill="#273247"/><rect x="41" y="31" width="9" height="2" fill="#273247"/></>:<><rect x="25" y="29" width="6" height="8" fill="#fff0d8"/><rect x="42" y="29" width="6" height="8" fill="#fff0d8"/><rect x={expression==='curious'?29:27} y="32" width="3" height="4" fill="#263850"/><rect x="43" y="32" width="3" height="4" fill="#263850"/></>}
    <rect x="35" y="36" width="3" height="7" fill="#bd785d"/>
    {expression==='tired'?<><rect x="30" y="48" width="11" height="2" fill="#793d43"/><rect x="32" y="46" width="7" height="2" fill="#793d43"/></>:expression==='confident'?<><rect x="28" y="46" width="18" height="3" fill="#793d43"/><rect x="31" y="49" width="13" height="3" fill="#793d43"/></>:<><rect x="30" y="47" width="14" height="2" fill="#793d43"/></>}
    {expression==='tired'?<><rect x="19" y="41" width="7" height="2" fill="#b66b64" opacity=".55"/><rect x="48" y="41" width="6" height="2" fill="#b66b64" opacity=".55"/></>:null}
    <rect x="29" y="54" width="16" height="10" fill="#c78363"/>
    {/* olive overshirt, collar, shoulders */}
    <rect x="12" y="62" width="50" height="59" fill="#557a68"/><rect x="5" y="69" width="64" height="14" fill="#557a68"/><rect x="17" y="62" width="12" height="12" fill="#eee2c8"/><rect x="45" y="62" width="12" height="12" fill="#eee2c8"/>
    <rect x="35" y="73" width="3" height="45" fill="#3f6256"/><rect x="24" y="91" width="24" height="3" fill="#3f6256"/><rect x="24" y="102" width="24" height="3" fill="#3f6256"/>
    {/* articulated sleeves and hands */}
    {gesture==='phone'?<><rect x="4" y="75" width="12" height="26" fill="#557a68"/><rect x="0" y="98" width="12" height="18" fill="#d89970"/><rect x="54" y="76" width="11" height="16" fill="#557a68"/><rect x="58" y="87" width="9" height="22" fill="#d89970"/><rect x="62" y="80" width="13" height="23" fill="#19212e" stroke="#0e1420" strokeWidth="2"/><rect x="65" y="83" width="7" height="14" fill="#a8c9b8"/><rect x="67" y="99" width="3" height="2" fill="#f2c56e"/></>:null}
    {gesture==='type'?<><rect x="4" y="75" width="17" height="15" fill="#557a68"/><rect x="7" y="88" width="18" height="15" fill="#d89970"/><rect x="52" y="75" width="17" height="15" fill="#557a68"/><rect x="50" y="88" width="18" height="15" fill="#d89970"/></>:null}
    {gesture==='point'?<><rect x="4" y="74" width="14" height="22" fill="#557a68"/><rect x="5" y="94" width="12" height="12" fill="#d89970"/><rect x="53" y="74" width="13" height="19" fill="#557a68"/><rect x="57" y="88" width="10" height="12" fill="#d89970"/><rect x="64" y="78" width="14" height="5" fill="#d89970"/></>:null}
    {gesture==='wave'?<><rect x="3" y="74" width="13" height="19" fill="#557a68"/><rect x="0" y="89" width="12" height="12" fill="#d89970"/><rect x="55" y="68" width="12" height="21" fill="#557a68"/><rect x="58" y="55" width="7" height="17" fill="#d89970"/><rect x="53" y="53" width="5" height="13" fill="#d89970"/><rect x="65" y="54" width="5" height="12" fill="#d89970"/></>:null}
    {/* two independently swinging legs */}
    <g transform={`translate(${sx} 0)`}><rect x="16" y="119" width="17" height="31" fill="#303d50"/><rect x="12" y="146" width="22" height="7" fill="#e5d9c5"/><rect x="9" y="151" width="25" height="6" fill="#303d50"/></g>
    <g transform={`translate(${3-sx} 0)`}><rect x="41" y="119" width="17" height="31" fill="#303d50"/><rect x="40" y="146" width="22" height="7" fill="#e5d9c5"/><rect x="39" y="151" width="25" height="6" fill="#303d50"/></g>
  </g></svg>;
};

const Caption:FC<{children:string}> = ({children})=><div style={{position:'absolute',top:1640,left:70,right:70,height:122,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',font:'900 42px/1.14 Arial,sans-serif',letterSpacing:.2,color:'#fff4d8',WebkitTextStroke:'1px #151a24',textShadow:'0 4px 0 #151a24,0 7px 15px #000b'}}>{children}</div>;

const Shot01:FC=()=>{
  const f=useCurrentFrame();
  const x=interpolate(f,[0,42,59],[-69,50,68],{...clamp,easing:Easing.out(Easing.cubic)});
  const badgeY=interpolate(f,[0,20],[110,110],clamp);
  const zoom=interpolate(f,[0,59],[1,1.035],{...clamp,easing:Easing.inOut(Easing.cubic)});
  return <AbsoluteFill style={{overflow:'hidden',background:'#182238'}}>
    <div style={{position:'absolute',inset:0,transform:`scale(${zoom})`,transformOrigin:'center'}}><PixelRoom frame={f}/>
      <div style={{position:'absolute',left:55,top:152,border:'2px solid #172235',background:'#e8d9b5',padding:'6px 10px',font:'900 14px Arial',color:'#2a3343',transform:`translateY(${badgeY}px)`}}>23:18 · СМЕНА ЗАКОНЧЕНА</div>
      <PixelIlya frame={f} x={x} y={211} expression="tired" walking gesture="phone"/>
    </div>
    <Caption>СМЕНА КОНЧИЛАСЬ. СВОЁ ДЕЛО — ПОТОМ?</Caption>
    <Progress frame={f} index={0}/>
  </AbsoluteFill>;
};

const Shot02:FC=()=>{
  const f=useCurrentFrame();
  const push=interpolate(f,[0,59],[1,1.12],{...clamp,easing:Easing.inOut(Easing.cubic)});
  const slide=interpolate(f,[0,18],[24,0],{...clamp,easing:Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{overflow:'hidden',background:'#182238'}}>
    <div style={{position:'absolute',inset:0,transform:`scale(${push}) translateX(${slide}px)`,transformOrigin:'53% 48%'}}><PixelRoom frame={f+60} mood="warm"/>
      {/* over-the-shoulder crop with a readable practical task */}
      <PixelIlya frame={f+60} x={17} y={187} expression={f<26?'curious':'focused'} gesture={f<31?'type':'point'} scale={1.28}/>
      <div style={{position:'absolute',left:490,top:760,width:470,height:384,border:'12px solid #152033',background:'#9cc6b3',boxShadow:'0 14px 0 #101722'}}>
        <div style={{height:57,background:'#4e806e',display:'flex',alignItems:'center',paddingLeft:20,color:'#f2e6c8',font:'900 22px Arial'}}>ТАБЛИЦА · ПОИСК ДУБЛЕЙ</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',padding:18,gap:8,color:'#273b3b',font:'800 24px Arial',textAlign:'center'}}>{['Имя','Заказ','Статус','Ира','1250','Готово','Лев','980','Новый','Ира','1250','Готово'].map((t,i)=><div key={i} style={{padding:'12px 3px',background:i===9&&f>24?'#efc762':'#d9eadb',border:'3px solid #628876',transform:i===9&&f>24?`scale(${1+Math.sin(f/3)*.05})`:undefined}}>{t}</div>)}</div>
        <div style={{position:'absolute',left:23,right:23,bottom:-62,padding:10,background:'#243647',border:'3px solid #111a27',color:'#f6e8c8',textAlign:'center',font:'900 20px Arial',opacity:interpolate(f,[22,32],[0,1],clamp)}}>ДУБЛЬ УБРАН ✓</div>
      </div>
      <div style={{position:'absolute',right:66,top:519,padding:'9px 16px',background:'#e8c568',border:'3px solid #172235',font:'900 18px Arial',color:'#202b3b',transform:`translateY(${interpolate(f,[0,15],[18,0],clamp)}px)`}}>УРОК → ПРАКТИКА</div>
    </div>
    <Caption>ОН УЖЕ ЗНАЕТ EXCEL. УЧИТСЯ ОБЪЯСНЯТЬ ПРОЩЕ.</Caption>
    <Progress frame={f} index={1}/>
  </AbsoluteFill>;
};

const Shot03:FC=()=>{
  const f=useCurrentFrame();
  const camera=interpolate(f,[0,59],[1.04,1.13],{...clamp,easing:Easing.inOut(Easing.cubic)});
  const arm=interpolate(f,[0,12,25,39,52,59],[0,-4,3,-3,2,0],clamp);
  const notif=interpolate(f,[34,43],[0,1],{...clamp,easing:Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{overflow:'hidden',background:'#182238'}}>
    <div style={{position:'absolute',inset:0,transform:`scale(${camera}) translateX(${interpolate(f,[0,59],[14,-11],clamp)}px)`,transformOrigin:'center'}}><PixelRoom frame={f+120} mood="warm"/>
      <PixelIlya frame={f+120} x={22} y={208} expression="confident" gesture="wave"/>
      {/* tripod-mounted phone is an authored prop, kept clear of the face */}
      <div style={{position:'absolute',right:106,top:820,width:146,height:236,border:'10px solid #111927',borderRadius:17,background:'#202c3e',boxShadow:'0 15px 0 #111722'}}>
        <div style={{position:'absolute',inset:9,background:'linear-gradient(160deg,#29455a,#547a69)'}}/>
        <div style={{position:'absolute',top:39,left:12,right:12,padding:8,background:'#f1e5c5',border:'2px solid #172235',font:'900 17px/1.05 Arial',textAlign:'center',color:'#253347'}}>ДУБЛИ В ТАБЛИЦЕ?<br/>ВОТ РЕШЕНИЕ</div>
        <div style={{position:'absolute',bottom:15,left:'50%',transform:'translateX(-50%)',width:17,height:17,borderRadius:'50%',background:f<35?'#d55351':'#65c292'}}/>
      </div>
      <div style={{position:'absolute',right:164,top:1044,width:7,height:223,background:'#b7bcc2'}}/><div style={{position:'absolute',right:112,top:1215,width:105,height:7,background:'#b7bcc2',transform:'rotate(-56deg)',transformOrigin:'right'}}/><div style={{position:'absolute',right:170,top:1216,width:105,height:7,background:'#b7bcc2',transform:'rotate(56deg)',transformOrigin:'left'}}/>
      <div style={{position:'absolute',left:510,top:618,padding:'11px 15px',border:'3px solid #152033',background:'#223b40',color:'#eaf0d3',font:'900 19px Arial',opacity:notif,transform:`translateY(${interpolate(f,[34,44],[12,0],clamp)}px)`}}>ОПУБЛИКОВАНО ✓</div>
      <div style={{position:'absolute',left:524,top:685,color:'#f6d574',font:'900 23px Arial',opacity:notif}}>+ первый зритель</div>
      <div style={{position:'absolute',left:522,top:750,color:'#d9e8d7',font:'700 19px Arial'}}>короткий совет · Excel</div>
      <div style={{position:'absolute',left:525,top:800,width:163,height:5,background:'#58706a'}}><div style={{width:`${interpolate(f,[0,59],[0,100],clamp)}%`,height:5,background:'#efc762'}}/></div>
    </div>
    <Caption>ОН ПЕРЕСТАЁТ ЖДАТЬ. И ЗАПИСЫВАЕТ ПЕРВЫЙ СОВЕТ.</Caption>
    <Progress frame={f} index={2}/>
  </AbsoluteFill>;
};

const Progress:FC<{frame:number;index:number}> = ({frame,index})=><div style={{position:'absolute',left:66,right:66,bottom:48,height:6,background:'#ffffff44'}}><div style={{height:6,width:`${((index*SHOT+frame+1)/TOTAL)*100}%`,background:'#f1c764'}}/></div>;

const Sound:FC=()=> <>
  <Sequence from={0} durationInFrames={FPS}><Audio src={staticFile('audio/episode-001/sfx/notification.wav')} volume={0.35}/></Sequence>
  <Sequence from={SHOT-4} durationInFrames={28}><Audio src={staticFile('audio/episode-001/sfx/whoosh.wav')} volume={0.22}/></Sequence>
  <Sequence from={SHOT+24} durationInFrames={15}><Audio src={staticFile('audio/episode-001/sfx/tick.wav')} volume={0.22}/></Sequence>
  <Sequence from={2*SHOT-3} durationInFrames={32}><Audio src={staticFile('audio/episode-001/sfx/whoosh.wav')} volume={0.18}/></Sequence>
  <Sequence from={2*SHOT+34} durationInFrames={22}><Audio src={staticFile('audio/episode-001/sfx/resolution.wav')} volume={0.22}/></Sequence>
</>;

export const Pixel32Demo:FC=()=> <AbsoluteFill style={{background:'#182238'}}>
  <Sequence from={0} durationInFrames={SHOT} premountFor={FPS}><Shot01/></Sequence>
  <Sequence from={SHOT} durationInFrames={SHOT} premountFor={FPS}><Shot02/></Sequence>
  <Sequence from={2*SHOT} durationInFrames={SHOT} premountFor={FPS}><Shot03/></Sequence>
  <Sound/>
</AbsoluteFill>;

export const Pixel32DemoComposition:FC=()=> <Composition id="SprosiPixel32MotionTest" component={Pixel32Demo} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920}/>;
