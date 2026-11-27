import model from './cels.json';

export type Cel = keyof typeof model;
export type Performance = {
  lean: number; nod: number; lift: number; reach: number; wrist: number;
  brow: number; gazeX: number; gazeY: number; lid: number; mouth: number; round: number; smile:number;
};
type Point = [number, number];
const rad = Math.PI / 180;
const pad = 78;
export const celSize = (cel: Cel) => ({w: model[cel].width, h: model[cel].height, pad});

export function through(time: number, times: number[], values: number[]) {
  let i = 0;
  while (i < times.length - 1 && time > times[i + 1]) i++;
  if (i === times.length - 1) return values[i];
  const p = Math.max(0, Math.min(1, (time - times[i]) / (times[i + 1] - times[i])));
  return values[i] + (values[i + 1] - values[i]) * p * p * (3 - 2 * p);
}
function smooth(from: number, to: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - from) / (to - from)));
  return t * t * (3 - 2 * t);
}
function region(x: number, y: number, cx: number, cy: number, rx: number, ry: number) {
  return 1 - smooth(.48, 1, Math.hypot((x - cx) / rx, (y - cy) / ry));
}

// Patches live in the same drawing coordinates as the mesh. The eyes were traced
// from the cel so that eyelids, pupils and mouth travel with a turning head.
function face(ctx: CanvasRenderingContext2D, cel: Cel, p: Performance) {
  for (const eye of model[cel].eyes) {
    const cols = eye.columns;
    ctx.save();
    ctx.beginPath();
    cols.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    for (let i = cols.length - 1; i >= 0; i--) ctx.lineTo(cols[i][0],cols[i][2]);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = '#191619';
    ctx.beginPath();
    ctx.ellipse(eye.pupil[0] + p.gazeX, eye.pupil[1] + p.gazeY, eye.radius[0], eye.radius[1], .08, 0, 2 * Math.PI);
    ctx.fill();
    if (p.lid > .005) {
      const edge = (c: number[]) => c[1] - 3 + (c[2] - c[1] + 5) * p.lid;
      ctx.beginPath();
      ctx.moveTo(cols[0][0] - 3, 195);
      for (const c of cols) ctx.lineTo(c[0],edge(c));
      ctx.lineTo(cols[cols.length-1][0] + 2,195); ctx.closePath();
      ctx.fillStyle = '#f3aa77'; ctx.fill();
      ctx.beginPath(); cols.forEach((c,i) => i ? ctx.lineTo(c[0],edge(c)) : ctx.moveTo(c[0],edge(c)));
      ctx.lineWidth = 3; ctx.strokeStyle = '#2c201c'; ctx.stroke();
    }
    ctx.restore();
  }
  ctx.save();
  const phone = cel === 'phone';
  ctx.translate(phone ? 462 : 513, phone ? 389 : 390);
  ctx.rotate(phone ? -.37 : -.21);
  const open = Math.max(0, p.mouth);
  const width = (phone ? 30 : 29) * (1 - .34 * open * p.round);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 3.2;
  ctx.strokeStyle = '#211815';
  ctx.beginPath();
  if (open < .075) {
    ctx.moveTo(-width,2-p.smile*.3); ctx.quadraticCurveTo(1,-4+p.smile,width,-p.smile*.5); ctx.stroke();
  } else {
    const height = 2.4 + open * (18 + 14 * p.round);
    ctx.moveTo(-width,0);
    ctx.bezierCurveTo(-width*.6,-4,width*.64,-7,width,-2);
    ctx.bezierCurveTo(width*.68,height*1.12,-width*.54,height,-width,0);
    ctx.closePath(); ctx.fillStyle = '#532728'; ctx.fill(); ctx.stroke();
    ctx.clip();
    ctx.fillStyle = '#f5dfba';
    ctx.beginPath(); ctx.moveTo(-width-3,-6); ctx.lineTo(width+4,-8);
    ctx.lineTo(width*.7,1.6); ctx.quadraticCurveTo(1,4,-width,1); ctx.fill();
    if (height > 9) {
      ctx.fillStyle = '#c76c65'; ctx.beginPath();
      ctx.ellipse(3,height*.84,width*.57,height*.25,0,0,Math.PI*2); ctx.fill();
    }
  }
  ctx.restore();
}

function shader(gl: WebGLRenderingContext, type: number, source: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, source); gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(sh) || 'Cel shader failed');
  return sh;
}

export function buildRig(canvas: HTMLCanvasElement, image: HTMLImageElement, cel: Cel) {
  const w = image.naturalWidth, h = image.naturalHeight, W = w+pad*2, H = h+pad*2;
  const source = document.createElement('canvas');
  source.width = w; source.height = h;
  const ink = source.getContext('2d')!;
  const gl = canvas.getContext('webgl', {alpha:true, antialias:false, preserveDrawingBuffer:true,
    premultipliedAlpha:true, depth:false, stencil:false});
  const fallback = gl ? null : canvas.getContext('2d')!;
  const nx = gl ? 36 : 12, ny = gl ? 44 : 16;
  const points: Point[] = [], weights: number[][] = [], indices: number[] = [];
  const phone = cel === 'phone';
  const handPivot: Point = phone ? [w*.72,h*.69] : [w*.35,h*.72];
  const headPivot: Point = [w*(phone ? .48 : .52),h*.417];
  for (let j=0; j<=ny; j++) for (let i=0; i<=nx; i++) {
    const u=i/nx, v=j/ny;
    points.push([u*w,v*h]);
    const head=(1-smooth(.394,.55,v)) * (phone ? 1-region(u,v,.90,.51,.25,.20) : 1);
    const arm=phone ? region(u,v,.805,.575,.34,.30) : region(u,v,.205,.645,.36,.294);
    const tip=phone ? region(u,v,.84,.49,.20,.20) : region(u,v,.133,.59,.23,.19);
    const brow=region(u,v,phone ? .565 : .609,.221,.16,.067);
    weights.push([1-smooth(.38,.99,v), head, arm, tip, brow]);
    if (i<nx && j<ny) {
      const a=j*(nx+1)+i;
      indices.push(a,a+1,a+nx+1,a+1,a+nx+2,a+nx+1);
    }
  }
  const xy=new Float32Array(points.length*2);
  let paint: () => void;
  let release=()=>{};
  if (gl) {
    const vs=shader(gl,gl.VERTEX_SHADER,'attribute vec2 pos; attribute vec2 uv; varying vec2 vUV; void main(){gl_Position=vec4(pos.x*2.-1.,1.-pos.y*2.,0.,1.);vUV=uv;}');
    const fs=shader(gl,gl.FRAGMENT_SHADER,'precision mediump float; uniform sampler2D cel; varying vec2 vUV; void main(){gl_FragColor=texture2D(cel,vUV);}');
    const pr=gl.createProgram()!;
    gl.attachShader(pr,vs); gl.attachShader(pr,fs); gl.linkProgram(pr); gl.useProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS)) throw Error('Cel shader link failed');
    const vb=gl.createBuffer(), ub=gl.createBuffer(), ib=gl.createBuffer(), tex=gl.createTexture();
    const attr=(name:string,buffer:WebGLBuffer|null,data:Float32Array<ArrayBuffer>)=>{
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
      const loc=gl.getAttribLocation(pr,name); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    };
    attr('uv',ub,new Float32Array(points.flatMap(([x,y])=>[x/w,y/h]))); attr('pos',vb,xy);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
    gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
    gl.clearColor(0,0,0,0); gl.viewport(0,0,W,H);
    paint=()=>{
      gl.clear(gl.COLOR_BUFFER_BIT); gl.bindBuffer(gl.ARRAY_BUFFER,vb); gl.bufferSubData(gl.ARRAY_BUFFER,0,xy);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);
      gl.drawElements(gl.TRIANGLES, indices.length,gl.UNSIGNED_SHORT,0);
    };
    release=()=>{gl.deleteBuffer(vb);gl.deleteBuffer(ub);gl.deleteBuffer(ib);gl.deleteTexture(tex);gl.deleteProgram(pr);gl.deleteShader(vs);gl.deleteShader(fs);};
  } else {
    // The same mesh also works on a browser without WebGL.
    paint=()=>{
      const c=fallback!; c.clearRect(0,0,W,H);
      for(let k=0;k<indices.length;k+=3) {
        const [a,b,d]=indices.slice(k,k+3);
        const [x0,y0]=points[a], [x1,y1]=points[b], [x2,y2]=points[d];
        const X0=xy[2*a]*W,Y0=xy[2*a+1]*H,X1=xy[2*b]*W,Y1=xy[2*b+1]*H,X2=xy[2*d]*W,Y2=xy[2*d+1]*H;
        const det=(x1-x0)*(y2-y0)-(x2-x0)*(y1-y0);
        const A=((X1-X0)*(y2-y0)-(X2-X0)*(y1-y0))/det, C=((x1-x0)*(X2-X0)-(x2-x0)*(X1-X0))/det;
        const B=((Y1-Y0)*(y2-y0)-(Y2-Y0)*(y1-y0))/det, D=((x1-x0)*(Y2-Y0)-(x2-x0)*(Y1-Y0))/det;
        c.save(); c.beginPath(); c.moveTo(X0,Y0);c.lineTo(X1,Y1);c.lineTo(X2,Y2);c.closePath();c.clip();
        c.setTransform(A,B,C,D,X0-A*x0-C*y0,Y0-B*x0-D*y0);c.drawImage(source,0,0);c.restore();
      }
    };
  }
  return {
    draw(p:Performance) {
      ink.clearRect(0,0,w,h); ink.drawImage(image,0,0); face(ink,cel,p);
      const head=p.nod*rad, arm=p.lift*rad, hc=Math.cos(head)-1,hs=Math.sin(head),ac=Math.cos(arm)-1,as=Math.sin(arm);
      for(let n=0;n<points.length;n++) {
        const [x,y]=points[n], [body,skull,limb,tip,brow]=weights[n];
        const hx=x-headPivot[0],hy=y-headPivot[1], ax=x-handPivot[0],ay=y-handPivot[1];
        const dx=p.lean*body + skull*(hc*hx-hs*hy) + limb*(ac*ax-as*ay+p.reach);
        const dy=p.lean*.11*body + skull*(hs*hx+hc*hy) + limb*(as*ax+ac*ay) + tip*p.wrist + brow*p.brow;
        xy[2*n]=(x+dx+pad)/W; xy[2*n+1]=(y+dy+pad)/H;
      }
      paint();
    },
    release
  };
}
