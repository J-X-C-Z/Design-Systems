const IconGitMerge='IconGitMerge',IconGitCommit='IconGitCommit',IconGitBranch='IconGitBranch';
const changelog = [
  {
    name: 'Version 4.0',
    value: 'v4',
    icon: IconGitMerge,
    date: 'Today',
    features: [
      'Introduced a brand new dark mode theme engine with dynamic contrast adjustments.',
      'Completely rewrote the client-side routing system resulting in 40% faster page loads.',
      'Added comprehensive multi-language support (i18n) spanning 15+ new locales.',
      'Officially deprecated the legacy API endpoints and retired v1 documentation.',
    ],
  },
  {
    name: 'Version 3.2',
    value: 'v3.2',
    icon: IconGitCommit,
    date: 'Last Month',
    features: [
      'Resolved a critical memory leak that occurred during prolonged websocket connections.',
      'Optimized our image pipeline to leverage next-gen formats like WebP and AVIF.',
      'Added a new dashboard widget allowing administrators to export user analytics to CSV.',
    ],
  },
  {
    name: 'Version 3.0',
    value: 'v3',
    icon: IconGitBranch,
    date: 'August 2023',
    features: [
      'Executed a major structural overhaul of the database schema to handle extreme scale.',
      'Released the very first public beta of our highly requested mobile application.',
      'Introduced true end-to-end encryption for all peer-to-peer direct messages.',
    ],
  },
];
const inbox = [
  {
    name: 'Mentions',
    value: 'mentions',
    count: 3,
    items: [
      {
        user: '@marcus_dev',
        time: '10m ago',
        text: 'Mentioned you in #frontend-team: "Could you review the new dropdown semantics?"',
      },
      {
        user: '@sarah',
        time: '1h ago',
        text: 'Mentioned you in PR #405: "Fixed the alignment issue here, what do you think?"',
      },
      {
        user: '@design_bot',
        time: '2h ago',
        text: 'Tagged you in Figma: "New assets uploaded for the dashboard redesign"',
      },
    ],
  },
  {
    name: 'Direct',
    value: 'direct',
    count: 1,
    items: [
      {
        user: '@alex_boss',
        time: '5m ago',
        text: '"Hey, do you have a minute for a quick sync before the client meeting?"',
      },
    ],
  },
  {
    name: 'System',
    value: 'system',
    count: 2,
    items: [
      {
        user: 'Security',
        time: 'Yesterday',
        text: 'New login detected from unusual location. Please review your active sessions.',
      },
      {
        user: 'Billing',
        time: '2 days ago',
        text: 'Your upcoming invoice is available. No action is required.',
      },
    ],
  },
];
const performanceOverview = [
  {
    name: 'Traffic',
    value: 'traffic',
    stats: [
      { label: 'Unique Visitors', value: '124.5K', trend: '+12%', type: 'up' },
      { label: 'Bounce Rate', value: '42.3%', trend: '-4%', type: 'down' },
      { label: 'Session Duration', value: '3m 14s', trend: '+2s', type: 'up' },
      { label: 'Direct Traffic', value: '28%', trend: '0%', type: 'neutral' },
    ],
  },
  {
    name: 'Sales',
    value: 'sales',
    stats: [
      { label: 'Gross Revenue', value: '$84,230', trend: '+18%', type: 'up' },
      { label: 'Refunds Issued', value: '$1,200', trend: '+2%', type: 'down' },
      { label: 'Avg Order Value', value: '$68.50', trend: '+5%', type: 'up' },
      { label: 'Conversion Rate', value: '3.2%', trend: '-0.4%', type: 'down' },
    ],
  },
  {
    name: 'Acquisition',
    value: 'acquisition',
    stats: [
      { label: 'Blended CAC', value: '$12.40', trend: '-8%', type: 'up' },
      { label: 'Organic Search', value: '45K', trend: '+14%', type: 'up' },
      { label: 'Social Media', value: '18K', trend: '+2%', type: 'up' },
      { label: 'Email Marketing', value: '22K', trend: '-1%', type: 'down' },
    ],
  },
];
const teams = [
  {
    name: 'Engineering',
    value: 'engineering',
    members: [
      { name: 'Alice Chen', role: 'Frontend Lead', status: 'Online' },
      { name: 'Bob Smith', role: 'Backend Developer', status: 'Busy' },
      { name: 'Charlie Davis', role: 'DevOps Engineer', status: 'Offline' },
    ],
  },
  {
    name: 'Design',
    value: 'design',
    members: [
      { name: 'Diana Prince', role: 'Product Designer', status: 'Online' },
      { name: 'Evan Wright', role: 'UX Researcher', status: 'Online' },
    ],
  },
  {
    name: 'Marketing',
    value: 'marketing',
    members: [
      {
        name: 'Fiona Gallagher',
        role: 'Content Strategist',
        status: 'Offline',
      },
      { name: 'George Miller', role: 'Growth Hacker', status: 'Busy' },
      { name: 'Hannah Lee', role: 'Social Media Manager', status: 'Online' },
    ],
  },
];
for(const team of teams)for(const member of team.members)member.id=member.name.toLowerCase().replaceAll(' ','-');
export const TAB_DATA={'tabs-22':changelog,'tabs-23':inbox,'tabs-24':performanceOverview,'tabs-25':teams};
