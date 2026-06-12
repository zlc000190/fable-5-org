/**
 * Demo videos used as placeholder content when the user has not generated any
 * videos yet. Mirrors the showcase clips from the hailuo homepage config so
 * the gallery never looks empty on first visit.
 *
 * Self-hosted under `/videos/` so the homepage doesn't depend on the
 * `img-template-ai-video.16781678.xyz` CDN (slow / unreliable from CN).
 */

export interface SampleVideo {
  id: string;
  prompt: string;
  videoUrl: string;
  /** Source image for image-to-video samples — when present, used for the bridge demo. */
  originalImage?: string;
  /** First-frame poster so the player shows an image before the MP4 loads. */
  posterUrl: string;
  model: string;
}

const VIDEOS = '/videos';
const POSTERS = '/videos/posters';

/**
 * Featured image-to-video demo used on the homepage Studio block to teach the
 * Image → Animate workflow. Clicking "Try this workflow" loads `originalImage`
 * into the video form (via the bridge) and renders this video on the right.
 */
export const FEATURED_WORKFLOW_DEMO: SampleVideo & { originalImage: string } = {
  id: 'sample-woman-doodle',
  prompt: 'Make the changes happen instantly.',
  originalImage: `${VIDEOS}/woman-city-doodle.jpg`,
  videoUrl: `${VIDEOS}/woman-city-doodle.mp4`,
  posterUrl: `${POSTERS}/woman-city-doodle.jpg`,
  model: 'hailuo',
};

export const SAMPLE_VIDEOS: SampleVideo[] = [
  FEATURED_WORKFLOW_DEMO,
  {
    id: 'sample-gondola',
    prompt: 'Weathered gondolier in flooded Venice, golden hour',
    originalImage: `${VIDEOS}/gondola.jpg`,
    videoUrl: `${VIDEOS}/gondola.mp4`,
    posterUrl: `${POSTERS}/gondola.jpg`,
    model: 'hailuo',
  },
  {
    id: 'sample-macpaint',
    prompt: 'Rotate the shoe, keep everything else still',
    originalImage: `${VIDEOS}/macpaint.png`,
    videoUrl: `${VIDEOS}/macpaint.mp4`,
    posterUrl: `${POSTERS}/macpaint.jpg`,
    model: 'hailuo',
  },
  {
    id: 'sample-dog-olympics',
    prompt: 'A dog speed climbs up a climbing wall at the olympics',
    // Text-to-video clip: use its first frame as the paired start image so the
    // gallery still shows an input image ↔ output video on the animate page.
    originalImage: `${POSTERS}/dog-olympics.jpg`,
    videoUrl: `${VIDEOS}/dog-olympics.mp4`,
    posterUrl: `${POSTERS}/dog-olympics.jpg`,
    model: 'hailuo',
  },
  {
    id: 'sample-sun-bicycle',
    prompt:
      'The sun rises slowly between tall buildings. Ground-level follow shot of bicycle tires',
    originalImage: `${POSTERS}/sun-rises-bicycle.jpg`,
    videoUrl: `${VIDEOS}/sun-rises-bicycle.mp4`,
    posterUrl: `${POSTERS}/sun-rises-bicycle.jpg`,
    model: 'hailuo',
  },
  {
    id: 'sample-pirate-ship',
    prompt: 'Pirate ship sailing into a storm with lightning and high waves',
    originalImage: `${POSTERS}/pirate-ship.jpg`,
    videoUrl: `${VIDEOS}/pirate-ship.mp4`,
    posterUrl: `${POSTERS}/pirate-ship.jpg`,
    model: 'hailuo',
  },
  {
    id: 'sample-snow-leopard',
    prompt: 'A snow leopard walking through a snowy forest, cinematic 8k',
    originalImage: `${POSTERS}/snow-leopard.jpg`,
    videoUrl: `${VIDEOS}/snow-leopard.mp4`,
    posterUrl: `${POSTERS}/snow-leopard.jpg`,
    model: 'hailuo',
  },
];
