// Static copy for FUTURE. Anything that changes often (the shop, the FAQ,
// news, events, project types, the AI cap) comes from Stern's public API at
// runtime instead, see lib/api/stern.js. Keep this file for voice, not facts.

import { WELCOME_URL } from './api/stern.js'

export const CONFIG = {
  name: 'FUTURE',
  // fallback only; the live name comes from the API's currency payload
  currency: 'Coins',
  signupUrl: WELCOME_URL,
  welcomeUrl: WELCOME_URL,
  slackUrl: 'https://hackclub.enterprise.slack.com/archives/C0BMMC7486R',
  hackatimeUrl: 'https://hackatime.hackclub.com/',
  programUrl: 'https://stern.hackclub.com/a/future/home',
  shopUrl: 'https://stern.hackclub.com/a/future/shop',
  flagUrl: 'https://hackclub.com',
  // The umbrella program this YSWS runs under.
  archer: {
    name: 'Archer',
    url: 'https://hackclub.enterprise.slack.com/archives/C0BHZLZF8BX'
  }
}

// The world switcher: the page recolours itself around whichever future you
// pick. `atmos` colours feed the <Sky> canvas; the CSS tokens for each world
// live in app.css under :root[data-world='...'].
export const WORLDS = [
  {
    id: 'aero',
    name: 'Clean sky',
    kicker: 'the one we were promised',
    tag: 'Clear air, quiet machines, software that just works. Glossy, calm, and running on sunlight.',
    hud: 'air 0.02ppm · grid 100% solar · water potable · mood optimistic',
    atmos: { cloud: '#ffffff', haze: '#cdeeff', glow: '#fff8d4', bubble: '#ffffff' }
  },
  {
    id: 'neon',
    name: 'Neon rain',
    kicker: 'cyberpunk, but you own the stack',
    tag: 'Rain on chrome, towers above, your rig outrunning theirs. The good ending of a bad timeline.',
    hud: 'rain heavy · grid spliced · uplink ours · mood defiant',
    atmos: { cloud: '#4b3a8f', haze: '#2a1b5e', glow: '#ff7ae0', bubble: '#7cf0ff' }
  },
  {
    id: 'rust',
    name: 'Reclaimed',
    kicker: 'after the collapse, we rebuilt',
    tag: 'Salvaged parts, panels on every roof, a network that survived because someone kept patching it.',
    hud: 'solar 71% · mesh patched · seeds stored · mood stubborn',
    atmos: { cloud: '#fff1d6', haze: '#f0c391', glow: '#fff0b8', bubble: '#ffe9c4' }
  }
]

export const TRACKS = [
  {
    icon: 'tool',
    title: 'A tool from that world',
    body: 'Something that does a real job: an agent that handles your inbox, a script that runs your room, a device that saves you an hour a week.'
  },
  {
    icon: 'seed',
    title: 'Groundwork for your own future',
    body: 'A portfolio, a study system, a first product, a site that gets you hired. Build the thing that gets future-you further along.'
  },
  {
    icon: 'signal',
    title: 'A postcard from there',
    body: 'Interfaces, holograms, weird hardware, impossible dashboards. Retro-futurist, Y2K, or straight out of next year: if it looks like it arrived from a future, it counts.'
  }
]

export const STEPS = [
  {
    n: '01',
    title: 'Get onboarded',
    body: 'Sign up on Stern, pick the future you are building from, and read the welcome page. It is free and takes a few minutes.'
  },
  {
    n: '02',
    title: 'Build it',
    body: 'Make something real from that world. Solo, or with a crew from the Slack.'
  },
  {
    n: '03',
    title: 'Track your hours',
    body: 'Log your time with Hackatime and link those projects when you submit. Only tracked, non-AI hours count.'
  },
  {
    n: '04',
    title: 'Submit for review',
    body: 'An open-source repo, a live link a reviewer can actually open, then hit submit. Post devlogs while you build.'
  },
  {
    n: '05',
    title: 'Spend what you earn',
    body: 'Your approved hours are the price tag. Ship enough of them and the shop opens up.'
  }
]

// Reusable <Rules> content. `mark` (optional) highlights a phrase inside `text`.
// Live project types, the AI cap and any extra requirements come from the API
// and render alongside these.
export const RULES = {
  label: 'the rules',
  title: 'What reviewers check',
  intro: 'Non-negotiable. Miss one and your project comes back with notes. Fix it and resubmit.',
  items: [
    {
      tag: 'NEW',
      text: 'Built brand-new, during the program, for the future. No reusing or resubmitting a project you shipped elsewhere.',
      mark: 'for the future'
    },
    {
      tag: 'TRACKED',
      text: 'Every hour tracked in Hackatime and linked to the project you submit. Untracked hours cannot be counted.'
    },
    {
      tag: 'OPEN',
      text: 'A public, open-source GitHub repo with a README and images, under a permissive license, permanently.'
    },
    {
      tag: 'IT RUNS',
      text: 'A live link a reviewer can open and use. Hardware can ship schematics or a build video instead.'
    },
    {
      tag: 'YOUR WORK',
      text: 'You only get credit for your own hours, and no AI-generated text or images in the project itself.'
    },
    {
      tag: 'SAY IT',
      text: 'Your project page includes the words “for the future.” Yes, really: we check.',
      mark: 'for the future'
    }
  ]
}
