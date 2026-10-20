import React from 'react';
const IconActivity='IconActivity',IconCloudLock='IconCloudLock',IconServer='IconServer',IconApps='IconApps',IconBrush='IconBrush',IconCode='IconCode',IconBook2='IconBook2',IconCertificate='IconCertificate',IconVideo='IconVideo';
const cloudStorage = [
  {
    name: 'Recent',
    value: 'recent',
    content: (
      <>
        Access your{' '}
        <span className="text-foreground font-semibold">latest activity</span>.
        Revisit documents, spreadsheets, and images you've worked on in the last
        24 hours across all your devices.
      </>
    ),
  },
  {
    name: 'Shared',
    value: 'shared',
    content: (
      <>
        Collaborate on{' '}
        <span className="text-foreground font-semibold">mutual assets</span>.
        Review files that team members have granted you access to and manage
        permissions for your own shared folders.
      </>
    ),
  },
  {
    name: 'Archive',
    value: 'archive',
    content: (
      <>
        Manage your{' '}
        <span className="text-foreground font-semibold">legacy storage</span>.
        Securely store long-term records, completed projects, and backup data
        that isn't required for your daily operations.
      </>
    ),
  },
];
const systems = [
  {
    name: 'Performance',
    value: 'performance',
    icon: IconActivity,
    content: (
      <>
        Monitor your <span className='text-foreground font-semibold'>real-time throughput</span>. Track latency, request
        per second, and hardware utilization across your distributed cluster nodes.
      </>
    )
  },
  {
    name: 'Infrastructure',
    value: 'infra',
    icon: IconServer,
    content: (
      <>
        Scale your <span className='text-foreground font-semibold'>cloud resources</span>. Manage container orchestration,
        provision new instances, and oversee your global network topology from a single interface.
      </>
    )
  },
  {
    name: 'Security',
    value: 'security',
    icon: IconCloudLock,
    content: (
      <>
        Enforce <span className='text-foreground font-semibold'>zero-trust access</span>. Audit firewall logs, manage
        SSL certificates, and investigate potential threats with our advanced anomaly detection engine.
      </>
    )
  }
];
const services = [
  {
    name: 'Branding',
    value: 'branding',
    icon: IconBrush,
    content: (
      <>
        Define your <span className='text-foreground font-semibold'>visual identity</span>. We craft memorable logos,
        stunning color palettes, and comprehensive style guides that resonate with your target audience.
      </>
    )
  },
  {
    name: 'Development',
    value: 'dev',
    icon: IconCode,
    content: (
      <>
        Build your <span className='text-foreground font-semibold'>digital core</span>. Our engineering team delivers
        highly-performant web applications, custom API integrations, and robust e-commerce solutions.
      </>
    )
  },
  {
    name: 'UX Design',
    value: 'ux',
    icon: IconApps,
    content: (
      <>
        Optimize <span className='text-foreground font-semibold'>user journeys</span>. We design intuitive interfaces and
        seamless workflows that convert visitors into loyal customers through user-centric research.
      </>
    )
  }
];
const learning = [
  {
    name: 'Curriculum',
    value: 'curriculum',
    icon: IconBook2,
    content: (
      <>
        Explore your <span className='text-foreground font-semibold'>learning path</span>. Access structured modules,
        downloadable resources, and interactive quizzes designed to master your chosen subject.
      </>
    )
  },
  {
    name: 'Live Lessons',
    value: 'lessons',
    icon: IconVideo,
    content: (
      <>
        Join our <span className='text-foreground font-semibold'>expert-led sessions</span>. Engage in real-time Q&A,
        participate in group discussions, and watch recorded sessions at your own convenience.
      </>
    )
  },
  {
    name: 'Certification',
    value: 'certification',
    icon: IconCertificate,
    content: (
      <>
        Earn your <span className='text-foreground font-semibold'>professional validation</span>. Complete the final
        assessment to receive a blockchain-verified certificate to showcase your skills to the world.
      </>
    )
  }
];
export const TAB_DATA={'tabs-10':cloudStorage,'tabs-11':systems,'tabs-12':services,'tabs-13':learning};
