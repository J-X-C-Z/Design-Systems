import React from 'react';

const analytics = [
  {
    name: 'Conversions',
    value: 'conversions',
    count: '12',
    content: (
      <>
        Track your{' '}
        <span className="text-foreground font-semibold">
          funnel success rate
        </span>
        . Analyze the percentage of users who complete a desired action, from
        sign-ups to successful purchases across your platform.
      </>
    ),
  },
  {
    name: 'Engagement',
    value: 'engagement',
    count: '8',
    content: (
      <>
        Measure your{' '}
        <span className="text-foreground font-semibold">
          audience stickiness
        </span>
        . Monitor daily active sessions, session time, and click-through rates
        on your most critical user interfaces.
      </>
    ),
  },
  {
    name: 'Bounce Rate',
    value: 'bounce',
    count: '24',
    content: (
      <>
        Optimize your{' '}
        <span className="text-foreground font-semibold">
          landing performance
        </span>
        . Identify pages where users are dropping off and implement design
        improvements to keep them browsing your site.
      </>
    ),
  },
];

const navigation = [
  {
    name: 'Home',
    value: 'home',
    icon: 'IconSmartHome',
    content: (
      <>
        Return to your{' '}
        <span className="text-foreground font-semibold">central dashboard</span>
        . See your most relevant data, current alerts, and a summary of your
        workspace activity at a single glance.
      </>
    ),
  },
  {
    name: 'Identity',
    value: 'identity',
    icon: 'IconUserCheck',
    content: (
      <>
        Manage your{' '}
        <span className="text-foreground font-semibold">
          verified credentials
        </span>
        . Protect your identity, review access logs, and control who has
        permission to view your private data.
      </>
    ),
  },
  {
    name: 'Preferences',
    value: 'preferences',
    icon: 'IconSettings2',
    content: (
      <>
        Configure your{' '}
        <span className="text-foreground font-semibold">
          environment settings
        </span>
        . From API keys to notifications, fine-tune every aspect of your system
        for a perfectly tailored experience.
      </>
    ),
  },
];

const creativeStudio = [
  {
    name: 'Illustrate',
    value: 'illustrate',
    content: (
      <>
        Bring your{' '}
        <span className="text-foreground font-semibold">visual stories</span> to
        life. Use advanced vector tools, custom brushes, and layered
        compositions to create stunning artwork from scratch.
      </>
    ),
  },
  {
    name: 'Design',
    value: 'design',
    content: (
      <>
        Structure your{' '}
        <span className="text-foreground font-semibold">
          digital interfaces
        </span>
        . Build reusable component libraries, interactive prototypes, and
        scalable layouts for web and mobile platforms.
      </>
    ),
  },
  {
    name: 'Animate',
    value: 'animate',
    content: (
      <>
        Master the{' '}
        <span className="text-foreground font-semibold">art of motion</span>.
        Add fluid transitions, physically-driven physics, and keyframe-based
        timelines to captivate your audience.
      </>
    ),
  },
];

const subscriptionTiers = [
  {
    name: 'Standard',
    value: 'standard',
    content: (
      <>
        Everything you need to{' '}
        <span className="text-foreground font-semibold">get started</span>.
        Access core tools, basic support, and 5GB of storage to kickstart your
        personal journey.
      </>
    ),
  },
  {
    name: 'Premium',
    value: 'premium',
    content: (
      <>
        Unlock{' '}
        <span className="text-foreground font-semibold">
          advanced capabilities
        </span>
        . Experience high-speed processing, 50GB of storage, and priority access
        to our support team and beta features.
      </>
    ),
  },
  {
    name: 'Ultimate',
    value: 'ultimate',
    content: (
      <>
        Scale your{' '}
        <span className="text-foreground font-semibold">
          entire organization
        </span>
        . Get dedicated infrastructure, unlimited storage, and white-glove
        onboarding for your team.
      </>
    ),
  },
];

export const TAB_DATA={'tabs-06':analytics,'tabs-07':navigation,'tabs-08':creativeStudio,'tabs-09':subscriptionTiers};
