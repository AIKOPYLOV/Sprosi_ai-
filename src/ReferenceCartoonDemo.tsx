import {AbsoluteFill, Composition, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

function Drawing({image}:{image:string}) {
  const frame=useCurrentFrame(), {fps}=useVideoConfig();
  return <AbsoluteFill style={{overflow:'hidden'}}><Img src={staticFile(image)} style={{
    width:'100%',height:'100%',objectFit:'cover',transformOrigin:'52% 43%',transform:`scale(${1+.046*frame/(3*fps)})`}}/></AbsoluteFill>;
}
function ReferenceStrip() {
  const {fps}=useVideoConfig();
  return <AbsoluteFill>
    <Sequence durationInFrames={3*fps}><Drawing image="reference-cartoon-keyframe.png"/></Sequence>
    <Sequence from={3*fps} durationInFrames={3*fps} premountFor={fps}><Drawing image="reference-cartoon-learning.png"/></Sequence>
    <Sequence from={6*fps} durationInFrames={3*fps} premountFor={fps}><Drawing image="reference-cartoon-recording.png"/></Sequence>
  </AbsoluteFill>;
}
export const ReferenceCartoonDemoComposition=()=> <Composition id="SprosiReference2DCartoonDemo" component={ReferenceStrip} width={1080} height={1920} fps={30} durationInFrames={270}/>;
