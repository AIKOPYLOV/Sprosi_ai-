import {useId, type ReactNode} from 'react';
import {staticFile} from 'remotion';
import {art, cream, dark, fill, Hand, ink, mono, namedFont, Room, TableTop} from './World';
import {through} from './performance';

function Label({x,y,size=16,children,color=ink,center=false,weight=700,code=false}:{
  x:number;y:number;size?:number;children:ReactNode;color?:string;center?:boolean;weight?:number;code?:boolean
}) {
  return <text x={x} y={y} fill={color} textAnchor={center?'middle':'start'}
    fontSize={size} fontWeight={weight} fontFamily={code?mono:namedFont}>{children}</text>;
}
function Phone({children,angle=-3,x=76,y=90}:{children:ReactNode;angle?:number;x?:number;y?:number}) {
  const clip=useId().replace(/[^a-zA-Z0-9_-]/g,'')+'display';
  return <svg viewBox="0 0 540 960" style={fill}>
    <g transform={`translate(${x} ${y}) rotate(${angle} 183 312)`}>
      <rect x="13" y="19" width="366" height="624" rx="41" fill="#4e372a" opacity=".52"/>
      <rect x="-3" y="115" width="5" height="47" rx="2" fill="#363a39"/>
      <rect x="363" y="148" width="5" height="81" rx="2" fill="#2f3434"/>
      <rect width="366" height="624" rx="40" fill="#596062" stroke="#292929" strokeWidth="4"/>
      <rect x="5" y="5" width="356" height="614" rx="36" fill="#21272a" stroke="#777c77" strokeWidth="1.5"/>
      <defs><clipPath id={clip}><rect x="12" y="18" width="342" height="584" rx="26"/></clipPath></defs>
      <g clipPath={`url(#${clip})`}><svg x="12" y="18" width="342" height="584" viewBox="0 0 342 584">
        {children}
      </svg></g>
      <rect x="148" y="7" width="71" height="5.5" rx="3" fill="#131a20"/>
      <rect x="148" y="608" width="70" height="3" rx="2" fill="#9c9e96"/>
    </g>
  </svg>;
}
function Channel({number,posted=false}:{number:string;posted?:boolean}) {
  return <>
    <rect width="342" height="584" fill="#f4edda"/>
    <rect x="0" y="0" width="342" height="76" fill="#344941"/>
    <Label x={24} y={49} size={22} color="#f5eedb">Мой канал</Label>
    <circle cx="54" cy="134" r="32" fill="#dab576" stroke={ink} strokeWidth="2"/>
    <path d="M36 130l17-8 18 7v16l-18 8-17-8Zm1 0 16 8 17-9m-17 9v15" fill="#ab764c" stroke="#49372d" strokeWidth="2"/>
    <Label x={99} y={131} size={22}>Склад без дублей</Label>
    <Label x={100} y={155} size={13} color="#657268">Канал Ильи</Label>
    <path d="M25 190H317" stroke="#b8b7a8" strokeWidth="1.5"/>
    <Label x={171} y={277} size={76} center>{number}</Label>
    <Label x={171} y={309} size={19} color="#546157" center>{posted?'подписчиков':'публикаций'}</Label>
    {posted ? <>
      <Label x={25} y={366} size={18}>Последние разборы</Label>
      {[0,1,2].map((i)=><g key={i} transform={`translate(${23+i*100} 396)`}>
        <rect width="93" height="126" rx="5" fill={i===1?'#d8bb7b':'#96714b'} />
        {i===1 ? <><path d="M10 45H82M10 64H82M10 82H82M38 25V98" fill="none" stroke="#685b46" strokeWidth="2"/><rect x="40" y="46" width="38" height="16" fill="#d58e6c"/></>:
          <image x="0" y="0" width="93" height="124" preserveAspectRatio="xMidYMid slice" href={art('scanner.webp')}/>}
        <rect y="100" width="93" height="24" fill="#273537"/><Label x={8} y={116} size={10} color={cream}>{['Найти дубль','Накладная','Штрихкод'][i]}</Label>
      </g>)}
    </> : <>
      <rect x="25" y="368" width="292" height="63" rx="8" fill="#e6dfca"/>
      <Label x={40} y={407} size={16}>Черновики</Label><Label x={273} y={407} size={20}>12</Label>
      <Label x={171} y={495} size={14} center color="#687067">Здесь появится первый ролик</Label>
    </>}
  </>;
}
export function Purchase({s}:{s:number}) {
  const switchAt=through(s,[1.36,1.66],[0,1]);
  return <>
    <TableTop/>
    <Phone angle={-4+through(s,[0,.28,.45,.75],[0,0,.8,0])}>
      <Channel number="0"/>
      <g transform={`translate(${-350*switchAt},0)`}>
        <rect width="342" height="584" fill="#355149"/>
        <path d="M27 83H315V468l-8 9-8-7-9 7-8-7-8 7-9-7-8 7-9-7-8 7-8-7-8 7-9-7-8 7-9-7-8 7-9-7-8 7-8-7-9 7-8-7-9 7-8-7-9 7-8-7-8 7-9-7-8 7-9-7-8 7-8-7-8 7-9-7-8 7-8-7-8 7Z" fill="#f8efd8"/>
        <Label x={171} y={124} size={14} color="#64736a" center code>ЭЛЕКТРОННЫЙ ЧЕК</Label>
        <circle cx="171" cy="201" r={33+through(s,[.17,.39,.58],[0,4,0])} fill="#d5e4bf"/>
        <path d="m151 201 13 12 25-28" stroke="#314f42" strokeWidth="5.5" strokeLinecap="round" fill="none" strokeDasharray="64" strokeDashoffset={through(s,[0,.36],[64,0])}/>
        <Label x={171} y={285} size={39} center>Оплачено</Label>
        <path d="M54 320H288" stroke="#958976" strokeDasharray="4 5"/>
        <Label x={56} y={359} size={25}>Гайд № 3</Label>
        <Label x={56} y={391} size={18} color="#6b655b">«Как начать вести канал»</Label>
        <g transform="translate(63 418)">{[2,4,1,2,3,1,4,2,1,3,2,1,4,2,3,2,1,4,2,3,1,4,2,1,3,2,1,4].map((n,i)=><rect key={i} x={i*7.8} width={n*1.3} height="19" fill="#463d34"/>)}</g>
      </g>
    </Phone>
    <Hand x={through(s,[0,.29,.52,.84,1.3,1.54,1.77],[390,318,333,570,539,315,605])} y={through(s,[0,.29,.52,1.3,1.6],[571,512,520,535,459])} turn={12} scale={1.12}/>
  </>;
}

export function Guide({s}:{s:number}) {
  const flip=through(s,[.31,1.20],[0,1]);
  return <><TableTop/><svg viewBox="0 0 540 960" style={fill}>
    <g transform="translate(64 166) rotate(-5 207 235)">
      <path d="M13 27l401-6 7 472-409 17Z" fill="#4d3c2f" opacity=".43"/>
      <path d="M5 12l398 1 8 469-407 7Z" fill="#c39767" stroke={ink} strokeWidth="3"/>
      <path d="M1 2l394-8 13 474L0 479Z" fill="#fbedd4" stroke={ink} strokeWidth="2.3"/>
      <path d="M15 25L19 445" stroke="#c6ab8a" strokeWidth="1.4"/>
      <Label x={44} y={71} size={13} color="#867761" code>СТРАНИЦА 1 / 1</Label>
      <Label x={48} y={207} size={47}>Просто</Label><Label x={48} y={266} size={54}>начни.</Label>
      <path d="M49 292Q139 280 231 283" stroke="#bd624a" strokeWidth="7" fill="none"/>
      <Label x={48} y={407} size={18} color="#8a7a64">Конец.</Label>
      <g transform={`translate(${-5*flip} 0) scale(${Math.max(.005,1-flip)} 1)`} opacity={flip>.985?0:1}>
        <path d="M0 0l397-7 7 475L0 478Z" fill="#657b68" stroke={ink} strokeWidth="3"/>
        <path d="M21 0v476" stroke="#3a5548" strokeWidth="7"/>
        <rect x="45" y="44" width="96" height="32" rx="3" fill="#e5c277"/>
        <Label x={59} y={66} size={15} code>ГАЙД 03</Label>
        <Label x={49} y={198} size={45} color={cream}>Секрет</Label><Label x={49} y={252} size={46} color={cream}>старта</Label>
        <path d="m214 396 84-97m-46 2 48-4-7 48" stroke="#edcc83" strokeWidth="12" strokeLinecap="round" fill="none"/>
      </g>
    </g>
  </svg><Hand x={through(s,[0,.39,.74,1.26,1.65],[499,420,279,68,-292])} y={through(s,[0,.4,1.26],[625,552,535])} turn={-24} scale={.87} opacity={through(s,[1.10,1.44],[1,0])}/></>;
}

export function Course({s}:{s:number}) {
  const press=through(s,[2.24,2.78,2.91,3.16],[0,1,.81,0]);
  return <><TableTop/><Phone angle={-2.5} y={80}>
    <rect width="342" height="584" fill="#fff"/>
    <image href={staticFile('episodes/episode-001/academy-course-mobile.png')} x="0" y="0" width="342" height="741.27" preserveAspectRatio="none"/>
    <circle cx="168" cy="274" r={9+(1-press)*22} fill="none" stroke="#ffe281" strokeWidth="3" opacity={press}/>
  </Phone><Hand x={through(s,[0,1.08,1.50,2.30,2.84,3.12,3.63],[594,535,520,430,255,292,546])} y={through(s,[0,2.17,2.84,3.57],[625,587,373,574])} turn={18} scale={1.18}/></>;
}

function Monitor({children}:{children:ReactNode}) {
  return <><Room zoom={1.35}/><svg viewBox="0 0 540 960" style={fill}>
    <path d="M-20 662L558 641 555 959H-12Z" fill="#a77950" stroke={ink} strokeWidth="4"/>
    <path d="M238 596h56l8 54 59 10v10H187v-10l45-10Z" fill="#5c6666" stroke={ink} strokeWidth="3"/>
    <rect x="13" y="155" width="515" height="458" rx="12" fill="#424947" stroke="#242a27" strokeWidth="4"/>
    <rect x="22" y="165" width="497" height="432" rx="4" fill="#e7e8da"/>
    <svg x="24" y="168" width="492" height="424" viewBox="0 0 492 424">{children}</svg>
    <circle cx="273" cy="604" r="2.2" fill="#9bb581"/>
    <path d="M74 692L415 680 483 731 35 751Z" fill="#626763" stroke={ink} strokeWidth="3"/>
    {[0,1,2].map(i=><path key={i} d={`M${78-i*7} ${701+13*i}L${418+i*12} ${688+13*i}`} stroke="#323d3c" strokeWidth="6" strokeDasharray="14 3"/>)}
    <path d="M-6 801L547 771V963H-6Z" fill="#383f44"/>
    <path d="M-6 801L547 771" stroke="#694834" strokeWidth="9"/>
  </svg></>;
}
export function EditBay({s}:{s:number}) {
  const cut=through(s,[.85,1.89],[0,1]);
  return <Monitor>
    <rect width="492" height="424" fill="#293937"/>
    <Label x={19} y={36} size={20} color={cream}>Монтаж</Label>
    <text x="473" y="35" textAnchor="end" fill="#b6c5b7" fontFamily={mono} fontSize="13">ПЕРВЫЙ РОЛИК</text>
    <svg x="23" y="54" width="446" height="220" viewBox="0 0 446 220">
      <image href={art('room.webp')} width="446" height="220" preserveAspectRatio="xMidYMid slice"/>
      <image href={art('explain.webp')} x="98" y="5" width="251" height="326"/>
      <image href={art('scanner.webp')} width="446" height="220" preserveAspectRatio="xMidYMid slice" opacity={through(s,[1.53,1.81],[0,1])}/>
    </svg>
    <Label x={23} y={305} color="#b7c5ba" size={13} code>00:00</Label>
    <g transform={`translate(${-174*cut} 0)`}>
      <rect x="23" y="323" width="168" height="57" rx="5" fill="#c99377"/>
      <Label x={35} y={358} size={17}>Приветствие</Label>
      <rect x="197" y="323" width="248" height="57" rx="5" fill="#96b6a1"/>
      <Label x={211} y={358} size={18}>Двойной скан</Label>
    </g>
    {cut>.97&&<rect x="0" y="320" width="22" height="66" fill="#293937"/>}
    <path d="M23 312v78m-6-78h12l-6 7Z" fill="#ffe4a0" stroke="#ffe4a0" strokeWidth="2.5"/>
    <g transform={`translate(${through(s,[0,.65,1.40,1.92,2.8],[180,189,81,30,99])} ${through(s,[0,.65,1.9,2.8],[403,359,356,393])})`}>
      <path d="M0 0l4 21 5-6 9 7 4-5-9-7 8-3Z" fill="#fff9e3" stroke="#252d2d" strokeWidth="1.7"/>
    </g>
  </Monitor>;
}
export function Spreadsheet({s}:{s:number}) {
  const selected=s>.39,menu=s>1.08&&s<2.62, applied=s>=2.62;
  return <Monitor>
    <rect width="492" height="424" fill="#fbf6e5"/>
    <path d="M0 0H492V52H0Z" fill="#3d6654"/>
    <Label x={17} y={34} size={18} color={cream}>Накладная · вечерняя смена</Label>
    <Label x={17} y={77} size={14}>Главная</Label>
    <rect x="107" y="58" width="239" height="28" rx="4" fill={menu?'#c8d9be':'#e6e7d8'}/>
    <Label x={116} y={78} size={13}>Условное форматирование ▾</Label>
    <path d="M0 95H492" stroke="#a1ae9c"/>
    <rect x="14" y="116" width="462" height="38" fill="#e2e5d4"/>
    <Label x={20} y={141} size={13}>№</Label><Label x={63} y={141} size={15}>Номер</Label><Label x={252} y={141} size={15}>Груз</Label>
    {['СК-208','СК-214','СК-219','СК-214'].map((v,i)=><g key={i} transform={`translate(0 ${157+i*45})`}>
      <rect x="49" width="175" height="43" fill={applied && (i===1||i===3)?'#edb099':selected?'#e0ecd6':'#fbf6e5'}/>
      <path d="M14 44H475" stroke="#c3c7b8"/>
      <Label x={18} y={28} size={13} color="#66756c" code>{i+1}</Label>
      <Label x={64} y={29} size={20} code>{v}</Label>
      <Label x={251} y={28} size={16}>{['Лампа','Кабель','Лента','Кабель'][i]}</Label>
    </g>)}
    {selected&&<rect x="49" y="156" width="176" height="181" fill="none" stroke="#40805e" strokeWidth="2.5"/>}
    {menu&&<g>
      <rect x="107" y="87" width="332" height="109" rx="4" fill="#858b78" opacity=".35"/>
      <rect x="102" y="84" width="333" height="105" rx="4" fill="#fcf6e7" stroke="#969d8b"/>
      <Label x={115} y={113} size={14}>Правила выделения ячеек</Label>
      <path d="M111 124H427" stroke="#ccd0c1"/><rect x="110" y="133" width="317" height="44" rx="3" fill="#d4e6c7"/>
      <Label x={122} y={162} size={16}>Повторяющиеся значения</Label>
    </g>}
    {applied&&<><circle cx="32" cy="380" r="9" fill="#a65742"/><Label x={51} y={386} size={17}>СК-214 встречается дважды</Label></>}
    <g transform={`translate(${through(s,[0,.4,1.14,1.45,2.54,3.25],[355,190,248,250,273,205])} ${through(s,[0,.4,1.14,1.45,2.54,3.25],[355,184,74,94,159,315])})`}>
      <path d="M0 0l4 20 5-6 8 7 3-4-8-8 7-3Z" fill="#fff" stroke="#354238" strokeWidth="1.6"/>
    </g>
  </Monitor>;
}

export function Posting({s}:{s:number}) {
  const posted=s>2.19;
  return <><TableTop/><Phone angle={2} y={103}>
    <rect width="342" height="584" fill="#f2ead5"/>
    <Label x={24} y={46} size={24}>{posted?'Мой канал':'Черновик'}</Label>
    <svg x="23" y="73" width="296" height="238"><image href={art('scanner.webp')} width="296" height="238" preserveAspectRatio="xMidYMid slice"/></svg>
    <Label x={24} y={351} size={23}>Одна коробка дважды?</Label>
    <Label x={24} y={381} size={14} color="#627065">Илья · Склад без дублей</Label>
    <rect x="24" y="432" width="293" height="55" rx="13" fill={posted?'#d3e1c5':'#365846'}/>
    <Label x={171} y={467} size={20} center color={posted?'#344f40':cream}>{posted?'Вышло в канале ✓':'Опубликовать'}</Label>
    {!posted&&<Label x={171} y={531} size={16} center color="#9b5b49">Удалить черновик</Label>}
  </Phone><Hand x={through(s,[0,.42,.84,1.45,1.92,2.14,2.36,2.78],[590,385,300,297,282,267,320,599])} y={through(s,[0,.4,.83,1.45,1.98,2.16,2.78],[690,660,651,649,584,582,655])} turn={14} scale={1.06}/></>;
}
export function Milestones({s}:{s:number}) {
  const second=s>1.67;
  const move=through(s,[1.54,1.66,1.83,2.06],[0,-16,6,0]);
  return <><TableTop/><Phone y={91+move} angle={-3}>
    <Channel number={second?'2 300':'1 000'} posted/>
  </Phone>
  <svg viewBox="0 0 540 960" style={fill}>
    <g transform={`translate(${through(s,[0,.4,1.48,1.76],[3,0,0,-10])} 0) rotate(6 407 691)`}>
      <rect x="263" y="635" width="216" height="69" fill="#e3ca91" stroke="#7a6446" strokeWidth="2"/>
      <Label x={283} y={664} size={12} color="#776344" code>ЗАПИСНАЯ КНИЖКА</Label>
      <Label x={283} y={691} size={16}>{second?'Двадцатый разбор':'Спустя недели'}</Label>
    </g>
  </svg></>;
}
