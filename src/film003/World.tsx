import type {CSSProperties, ReactNode} from 'react';
import {Img, staticFile} from 'remotion';
import {through} from './performance';

export const art = (name:string) => staticFile('episodes/episode-003/'+name);
export const fill:CSSProperties={position:'absolute',inset:0,width:'100%',height:'100%'};
export const ink='#302722', cream='#f8edd6', dark='#1c2b31', accent='#ffcc59';
export const namedFont='FilmSans, "Arial", sans-serif';
export const mono='"DejaVu Sans Mono","Courier New",monospace';

export function Camera({zoom=1,dx=0,dy=0,origin='50% 43%',children}:{
  zoom?:number;dx?:number;dy?:number;origin?:string;children:ReactNode
}) {
  return <div style={{...fill,transformOrigin:origin,transform:`translate(${dx}px,${dy}px) scale(${zoom})`}}>{children}</div>;
}
export function Room({zoom=1,dx=0}:{zoom?:number;dx?:number}) {
  return <Img src={art('room.webp')} style={{...fill,objectFit:'cover',transform:`translateX(${dx}px) scale(${zoom})`,transformOrigin:'50% 46%'}}/>;
}
export function Desk({back=660}:{back?:number}) {
  return <svg viewBox="0 0 540 960" style={fill} aria-hidden>
    <g transform={`translate(0,${back-660})`} strokeLinejoin="round" strokeLinecap="round">
      <defs><pattern id="grain003" x="0" y="0" width="608" height="221" patternUnits="userSpaceOnUse"><image href={art('wood.webp')} x="-28" y="-116" width="660" height="356" preserveAspectRatio="none"/></pattern></defs>
      <path d="M-12 672L553 653 560 792 -16 818Z" fill="#b17a49" stroke="#382c23" strokeWidth="3.8"/>
      <path d="M-12 672L553 653 560 792 -16 818Z" fill="url(#grain003)" opacity=".53"/>
      <path d="M-10 676L550 657 548 664 -10 684Z" fill="#dca26a"/>
      <path d="M-20 711Q189 704 314 691M297 740Q441 730 570 724M-8 775Q72 768 130 770M374 779L507 771M19 720L115 717" fill="none" stroke="#8a5c38" strokeWidth="2.1" opacity=".65"/>
      <path d="M-10 818L551 792 557 989 -10 992Z" fill="#34404a" stroke="#302822" strokeWidth="3.4"/>
      <path d="M-8 815L553 789 554 810 -8 839Z" fill="#795036" stroke="#34291f" strokeWidth="2.8"/>
      <path d="M-8 834L555 807" fill="none" stroke="#ac784e" strokeWidth="1.4"/>
      <path d="M0 852L540 826V855L0 877Z" fill="#29353f"/>
    </g>
  </svg>;
}
export function TableTop() {
  return <>
    <Img src={art('wood.webp')} style={fill}/>
    <div style={{...fill,background:'linear-gradient(180deg,transparent 61%,rgba(36,30,29,.21) 78%,rgba(30,33,34,.61) 100%)'}}/>
  </>;
}

export function Walking({frame,fps,frames}:{frame:number;fps:number;frames:number}) {
  const t=frame/fps, p=frame/(frames-1);
  const phase=Math.floor(t/.103)%8;
  const h=381+13*p,w=h*.75, ground=704+14*p;
  const center=-47+p*673;
  return <>
    <Room zoom={1.18} dx={34-68*p}/>
    <div style={{position:'absolute',left:center-w*.27,top:ground-5,width:w*.54,height:15,
      borderRadius:'50%',background:'#382a24',opacity:.34,transform:'rotate(-2deg)'}}/>
    <div style={{position:'absolute',left:center-w*.5,top:ground-h*(484/512),width:w,height:h,
      backgroundImage:`url("${art('walk.webp')}")`,backgroundSize:`${w*4}px ${h*2}px`,
      backgroundPosition:`${-(phase%4)*w}px ${-Math.floor(phase/4)*h}px`}}/>
    <svg viewBox="0 0 540 960" style={fill}>
      <path d="M-12 0H17L12 960H-12Z" fill="#263138" stroke="#20272a" strokeWidth="3"
        transform={`translate(${26 - p*65} 0)`}/>
    </svg>
  </>;
}

export function Scanner({s,repeat=false}:{s:number;repeat?:boolean}) {
  const a=repeat ? .62 : .79, b=repeat ? 1.05 : 1.24;
  const flick=(t:number)=>through(s,[t-.08,t,t+.085,t+.18],[0,1,.84,0]);
  const light=Math.max(flick(a),flick(b));
  const kick=through(s,[0,a-.14,a,a+.13,a+.32,b,b+.13,b+.39,3.6],[0,-1.2,.8,-1.6,0,1.25,-1.3,.3,0]);
  return <>
    <Img src={art('scan-room.webp')} style={fill}/>
    <Img src={art('reader.webp')} style={{...fill,transform:`rotate(${kick}deg)`,transformOrigin:'91% 77%'}}/>
    <svg viewBox="0 0 540 960" style={fill}>
      <g opacity={light}>
        <path d="M270 481L137 348 369 335Z" fill="#ff5540" opacity=".31"/>
        <path d="M138 349L369 335" stroke="#ff5141" opacity=".75" strokeWidth="7"/>
        <path d="M138 349L369 335" stroke="#fff4d2" strokeWidth="2"/>
        <ellipse cx="270" cy="481" rx="8" ry="4" transform="rotate(26 270 481)" fill="#ff8d67"/>
      </g>
    </svg>
  </>;
}

export function Tripod({x=390,y=532,scale=1}:{x?:number;y?:number;scale?:number}) {
  return <svg viewBox="0 0 540 960" style={fill}>
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={ink} strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="5" cy="178" rx="65" ry="8" fill="#4f3c31" stroke="none" opacity=".35"/>
      <path d="M0 88V130M0 120L-44 169M0 120L43 172M0 122L1 177" strokeWidth="9"/>
      <path d="M0 97V118M-3 130L-38 166M5 130L37 168" stroke="#797f77" fill="none" strokeWidth="2.3"/>
      <rect x="-30" y="-17" width="61" height="110" rx="9" fill="#41474c" strokeWidth="3.5"/>
      <rect x="-25" y="-11" width="19" height="34" rx="6" fill="#2d353a" strokeWidth="1.7"/>
      <circle cx="-15.5" cy="-1" r="5" fill="#141d23" stroke="#66737a" strokeWidth="2"/>
      <circle cx="-15.5" cy="13" r="4" fill="#131d24"/>
      <path d="M-35 59V82H36V58" fill="none" strokeWidth="8"/>
    </g>
  </svg>;
}

export function Hand({x,y,turn=0,scale=1,opacity=1}:{x:number;y:number;turn?:number;scale?:number;opacity?:number}) {
  return <svg viewBox="0 0 540 960" style={{...fill,pointerEvents:'none',opacity}}>
    <g transform={`translate(${x} ${y}) rotate(${turn}) scale(${scale}) translate(-7 -29)`} stroke="#372723" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
      <path d="M269 134C244 126 217 115 199 99C188 86 176 77 157 65L111 40C96 33 81 31 68 28L28 18C17 16 9 19 7 25C4 32 9 38 19 42L77 61L102 75C92 73 83 74 79 82C76 89 81 96 88 99C81 100 80 109 85 116C89 121 97 124 103 126C100 131 105 139 114 143C131 151 151 154 168 157C181 159 197 160 207 169L251 199Z" fill="#edb082"/>
      <path d="M79 83Q87 75 98 80L129 95M86 104Q95 98 102 105L127 117M103 126Q109 120 118 125L140 135M160 76Q143 67 128 70" fill="none" stroke="#945c47" strokeWidth="1.7"/>
      <path d="M9 28Q14 21 24 24L34 27Q35 32 30 34L13 32Z" fill="#efd0ae" stroke="#a8785d" strokeWidth="1.2"/>
      <path d="M218 107L265 126L287 151L258 211L198 174Q216 151 218 107Z" fill="#4a6557"/>
      <path d="M224 114Q223 149 205 176" fill="none" stroke="#9aab91" strokeWidth="3"/>
    </g>
  </svg>;
}
