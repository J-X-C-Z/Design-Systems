import React from 'react';
const IconDownload='IconDownload',IconSettings='IconSettings',IconCloudUpload='IconCloudUpload';
const taskBoard = [
  {
    name: 'To-Do',
    value: 'todo',
    count: 12,
    badgeColor: 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 group-data-[state=active]:bg-zinc-700 group-data-[state=active]:text-zinc-100 dark:group-data-[state=active]:bg-zinc-300 dark:group-data-[state=active]:text-zinc-900',
    content:
      'Review your pending items. Outstanding tasks that need your attention soon, including project briefs, design reviews, and client follow-ups.'
  },
  {
    name: 'In Progress',
    value: 'in-progress',
    count: 4,
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 group-data-[state=active]:bg-zinc-700 group-data-[state=active]:text-zinc-100 dark:group-data-[state=active]:bg-zinc-300 dark:group-data-[state=active]:text-zinc-900',
    content:
      'Track active assignments. Work that is currently being tackled by you or your team, along with real-time status updates and collaboration notes.'
  },
  {
    name: 'Done',
    value: 'done',
    count: 28,
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 group-data-[state=active]:bg-zinc-700 group-data-[state=active]:text-zinc-100 dark:group-data-[state=active]:bg-zinc-300 dark:group-data-[state=active]:text-zinc-900',
    content:
      'View completed objectives. A historical log of finished tasks and resolved tickets that have been verified, approved, and officially closed.'
  }
];
const travelOptions = [
  {
    name: 'Stays',
    value: 'stays',
    price: 'From $80/night',
    content:
      'Find the perfect place to rest. From cozy budget hostels to five-star luxury resorts, browse thousands of accommodations worldwide to match your travel style.'
  },
  {
    name: 'Flights',
    value: 'flights',
    price: 'Deals Daily',
    content:
      'Take to the skies without breaking the bank. Compare prices across hundreds of airlines and book your next adventure with our seamless ticketing system.'
  },
  {
    name: 'Experiences',
    value: 'experiences',
    price: 'Top Rated',
    content:
      'Immerse yourself in local culture. Book guided tours, adventurous excursions, and exclusive culinary events curated by local experts.'
  }
];
const audioFeatures = [
  {
    name: 'Playlists',
    value: 'playlists',
    song: 'Midnight Drive',
    artist: 'The Midnight',
    content:
      'Curate your perfect soundtrack. Organize your favorite tracks into custom playlists for every mood, workout, or late-night drive.',
  },
  {
    name: 'Podcasts',
    value: 'podcasts',
    song: 'Tech Today',
    artist: 'Developer Chronicles',
    content:
      'Stay informed and entertained. Subscribe to top-rated tech podcasts, download episodes for offline listening, and never miss an update.',
  },
  {
    name: 'Radio',
    value: 'radio',
    song: 'Lo-Fi Chill Beats',
    artist: 'Global Station',
    content:
      'Discover new music effortlessly. Tune into algorithm-generated stations based on your listening history and favorite genres.',
  },
];
const documentation = [
  {
    name: 'Installation',
    value: 'installation',
    icon: IconDownload,
    title: 'Getting Started',
    content:
      'Our package requires Node.js v16+ and a modern package manager. Run the installation script in your terminal to automatically configure the necessary dependencies, add utility functions, and inject boilerplate code directly into your current workspace.',
  },
  {
    name: 'Configuration',
    value: 'config',
    icon: IconSettings,
    title: 'Tailoring the Setup',
    content:
      'Out of the box, our system provides sensible, secure defaults. However, you can override any setting by creating a unified config file at the root of your project. This allows you to customize the underlying themes, routing logic, and compiler options.',
  },
  {
    name: 'Deployment',
    value: 'deployment',
    icon: IconCloudUpload,
    title: 'Going Live',
    content:
      'When you are ready to ship, our CLI wraps your application into an optimized, minified production build. You can deploy it to Vercel, Netlify, or any standard Node server environment simply by passing the production build flag.',
  },
];
export const TAB_DATA={'tabs-18':taskBoard,'tabs-19':travelOptions,'tabs-20':audioFeatures,'tabs-21':documentation};
