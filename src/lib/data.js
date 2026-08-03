// All the copy + config for FUTURE lives here so it's trivial to tweak.

export const CONFIG = {
  name: "FUTURE",
  minHours: 15,
  currency: "Drops",
  slackUrl: "https://hackclub.enterprise.slack.com/archives/C0BMMC7486R",
  signupUrl: "#signup",
  hackatimeUrl: "https://hackatime.hackclub.com/",
  rudderUrl: "https://rudder.hackclub.com/",
  adminUrl: "/admin",
  flagUrl: "https://hackclub.com",
  // The umbrella program this YSWS runs under.
  archer: {
    name: "Archer",
    url: "https://hackclub.enterprise.slack.com/archives/C0BHZLZF8BX",
  },
};

// The world switcher the page recolours itself around whichever future
// you pick. `atmos` colours feed the <Sky> canvas; the CSS tokens for each
// world live in app.css under :root[data-world='...'].
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
    body: 'Something that does a real job an agent that handles your inbox, a script that runs your room, a device that saves you an hour a week.'
  },
  {
    icon: 'seed',
    title: 'Groundwork for your own future',
    body: 'A portfolio, a study system, a first product, a site that gets you hired. Build the thing that gets future-you further along.'
  },
  {
    icon: 'signal',
    title: 'A postcard from there',
    body: 'Interfaces, holograms, weird hardware, impossible dashboards. If it looks like it arrived from the world you picked, it counts.'
  }
]

export const STEPS = [
  { n: '01', title: 'Pick your future', body: 'Sign up, join the Slack, and tell us which world you are building from. Stickers ship free to a real address.' },
  { n: '02', title: 'Build it', body: 'Spend 15 hours or more making it real. Solo, or with a crew from the Slack.' },
  { n: '03', title: 'Track every hour', body: 'Log your time with Hackatime. One honest hour becomes one drop. We only count what you actually worked.' },
  { n: '04', title: 'Ship it in public', body: 'Push the repo, write a README, record a demo a stranger could follow.' },
  { n: '05', title: 'Spend your drops', body: 'We review it, you redeem drops for real hardware, shipped to your door.' }
]

export const REWARDS = [
  { code: 'F-01', cost: 5, name: 'Holo sticker set', note: 'iridescent vinyl, 5 designs' },
  { code: 'F-02', cost: 15, name: 'FUTURE tee', note: 'heavyweight organic cotton' },
  { code: 'F-03', cost: 25, name: 'Mechanical keyboard', note: '65%, hot-swap, lubed linears' },
  { code: 'F-04', cost: 40, name: 'Desk plant + planter', note: 'a real one, low maintenance' },
  { code: 'F-05', cost: 80, name: 'Raspberry Pi 5 kit', note: 'board, case, PSU, 64GB card' },
  { code: 'F-06', cost: 220, name: 'Studio headphones', note: 'closed back, flat response' },
  { code: 'F-07', cost: 500, name: 'A whole laptop', note: 'enough compute to build the rest' }
]

// Reusable <Rules> content. `mark` (optional) highlights a phrase inside `text`.
export const RULES = {
  label: 'the rules',
  title: 'Seven things we check.',
  intro:
    'Non-negotiable. Miss one and your project comes back with notes fix it and resubmit before the deadline.',
  items: [
    {
      tag: 'NEW',
      text: 'Every project is built brand-new, during the program, for the future. No reusing, reviving, or resubmitting old work.',
      mark: 'for the future'
    },
    {
      tag: 'TRACKED',
      text: 'All work is time-tracked with Hackatime, Lookout, or Lapse. Untracked hours cannot be counted.'
    },
    {
      tag: 'PUBLIC',
      text: 'Every project needs a public GitHub repo even if code is not the point. Include images, a README, and a demo anyone can try.'
    },
    {
      tag: 'HARDWARE',
      text: 'Building something physical? Track it with Lookout or Lapse, and still ship a repo with photos and a README.'
    },
    {
      tag: 'OPEN',
      text: 'Repos stay public and open-source, permanently, under a permissive license.'
    },
    {
      tag: 'IT WORKS',
      text: 'It has to actually run. Someone with zero context should be able to open your demo and use it.'
    },
    {
      tag: 'SAY IT',
      text: 'Your project page must include the words “for the future.” Yes, really we check.',
      mark: 'for the future'
    }
  ]
}

export const FAQ = [
  {
    q: 'Do I need to be good at this already?',
    a: 'No. Beginners are the point. If you can open a terminal you can finish this, and the Slack is full of people who will sit with you when something breaks.'
  },
  {
    q: 'What counts as “from the future”?',
    a: 'Anything that helps future-you, builds future-you, or looks like it arrived from the world you picked. When you are unsure, ask in Slack we lean generous.'
  },
  {
    q: 'Does my future have to be a nice one?',
    a: 'It does not. Build the utopia, the neon-soaked city, or the workshop after everything fell over. We only ask that the tech is something you would actually want to exist.'
  },
  {
    q: `What are ${CONFIG.currency}?`,
    a: `Your build hours, made spendable. One tracked hour is one drop, and drops come off the shop list below as real hardware, shipped to your door.`
  },
  {
    q: 'Is it actually free?',
    a: 'Completely. No fees, no subscription, nothing to buy. You build, we ship.'
  },
  {
    q: 'How old do I have to be?',
    a: `${CONFIG.name} is for teenagers 18 and under, like every Hack Club program. Older builders are welcome to mentor in the Slack.`
  }
]
