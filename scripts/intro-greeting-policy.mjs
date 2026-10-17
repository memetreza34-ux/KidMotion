/**
 * Intro text is guaranteed by the Remotion renderer, not Google Flow.
 * Existing episodes remain on their original rendering policy.
 */
export const hasFrameZeroGreetingPolicy = (episode) =>
  episode?.introVisualPolicy==='greeting-overlay-frame-zero-v1';

export function checkFrameZeroGreetingPlan({episode,scenePrompt}){
  if(!hasFrameZeroGreetingPolicy(episode))return [];
  const errors=[];
  if(episode.introOverlayText!=='HELLO!')errors.push('Frame-zero greeting must explicitly set introOverlayText to HELLO!.');
  if(episode.coverInVideo!==false || episode.scenes?.[0]?.type!=='cover' || episode.scenes[0].inVideo!==false)
    errors.push('Cover must remain outside the MP4.');
  if(episode.scenes?.[1]?.type!=='intro')errors.push('Scene 02 must be the very first rendered intro scene.');
  if(episode.nonExerciseImagePolicy?.remotionIntroGreetingException!==true)
    errors.push('Frame-zero greeting is only allowed with explicit Remotion intro exception.');
  if(!/NO BAKED TEXT/i.test(scenePrompt)||!/Remotion/i.test(scenePrompt)||!/FRAME ZERO/i.test(scenePrompt))
    errors.push('Scene 02 Google Flow prompt must explicitly forbid baked text and reserve the frame-zero Remotion greeting.');
  if(!/LEFT side/i.test(scenePrompt))errors.push('Scene 02 must reserve safe, uncluttered space for the greeting.');
  return errors;
}
