import React from 'react';
const IconDeviceDesktop='IconDeviceDesktop',IconShirt='IconShirt',IconHome='IconHome',IconBallBasketball='IconBallBasketball',IconSparkles='IconSparkles',IconCar='IconCar',IconBook='IconBook',IconMoodSmile='IconMoodSmile',IconBuildingFactory='IconBuildingFactory',IconBuildingSkyscraper='IconBuildingSkyscraper',IconHome2='IconHome2';
const categories = [
  {
    name: 'Electronics',
    value: 'electronics',
    icon: IconDeviceDesktop,
    content: (
      <>
        Upgrade your <span className='text-foreground font-semibold'>digital lifestyle</span>. Discover the latest
        smartphones, high-performance laptops, and cutting-edge home entertainment systems.
      </>
    )
  },
  {
    name: 'Apparel',
    value: 'apparel',
    icon: IconShirt,
    content: (
      <>
        Refresh your <span className='text-foreground font-semibold'>wardrobe</span>. Shop seasonal fashion trends,
        comfortable basics, and premium designer luxury pieces for every occasion.
      </>
    )
  },
  {
    name: 'Home & Living',
    value: 'home',
    icon: IconHome,
    content: (
      <>
        Elevate your <span className='text-foreground font-semibold'>living space</span>. Find modern furniture,
        chic decor, and smart appliances that transform your house into a dream home.
      </>
    )
  },
  {
    name: 'Sports',
    value: 'sports',
    icon: IconBallBasketball,
    content: (
      <>
        Fuel your <span className='text-foreground font-semibold'>active routine</span>. Gear up with top-tier
        athletic equipment, breathable activewear, and performance-tracking accessories.
      </>
    )
  },
  {
    name: 'Beauty',
    value: 'beauty',
    icon: IconSparkles,
    content: (
      <>
        Enhance your <span className='text-foreground font-semibold'>natural glow</span>. Explore luxurious skincare
        routines, vibrant cosmetics, and professional-grade self-care essentials.
      </>
    )
  },
  {
    name: 'Automotive',
    value: 'auto',
    icon: IconCar,
    content: (
      <>
        Maintain your <span className='text-foreground font-semibold'>vehicle&apos;s performance</span>. Browse quality
        replacement parts, premium interior accessories, and professional detailing kits.
      </>
    )
  },
  {
    name: 'Books',
    value: 'books',
    icon: IconBook,
    content: (
      <>
        Expand your <span className='text-foreground font-semibold'>knowledge horizon</span>. Dive into gripping
        fiction, insightful biographies, and comprehensive academic textbooks.
      </>
    )
  },
  {
    name: 'Toys',
    value: 'toys',
    icon: IconMoodSmile,
    content: (
      <>
        Spark pure <span className='text-foreground font-semibold'>joy and creativity</span>. Find educational
        games, interactive playsets, and beloved character toys for kids of all ages.
      </>
    )
  }
];
const properties = [
  {
    name: 'Residential',
    value: 'residential',
    icon: IconHome2,
    content: (
      <>
        Explore luxury <span className='text-foreground font-semibold'>family homes</span>. Browse single-family houses,
        modern apartments, and quiet suburban estates designed for comfortable living and long-term value.
      </>
    )
  },
  {
    name: 'Commercial',
    value: 'commercial',
    icon: IconBuildingSkyscraper,
    content: (
      <>
        Expand your <span className='text-foreground font-semibold'>business footprint</span>. Discover premium office
        spaces, high-traffic retail locations, and versatile mixed-use properties in the heart of the city.
      </>
    )
  },
  {
    name: 'Industrial',
    value: 'industrial',
    icon: IconBuildingFactory,
    content: (
      <>
        Optimize your <span className='text-foreground font-semibold'>logistics network</span>. Find spacious
        warehouses, advanced manufacturing facilities, and strategically located distribution centers.
      </>
    )
  }
];
const cloudServices = [
  {
    name: 'Compute',
    value: 'compute',
    title: 'Elastic Compute Power',
    content:
      'Dynamically scale your application workload with our high-performance compute instances. Optimized for memory-intensive operations and machine learning tasks.'
  },
  {
    name: 'Storage',
    value: 'storage',
    title: 'Scalable Object Storage',
    content:
      'Store and retrieve any amount of data securely. Our distributed storage architecture ensures 99.999% availability and automatic geographic redundancy.'
  },
  {
    name: 'Database',
    value: 'database',
    title: 'Managed Relational DB',
    content:
      'Deploy fully managed databases in seconds. We handle the heavy lifting of provisioning, patching, and backups so you can focus on building.'
  }
];
const healthServices = [
  {
    name: 'Telehealth',
    value: 'telehealth',
    doctor: 'Dr. Sarah Connor',
    specialty: 'General Practice',
    content:
      'Connect with board-certified physicians from the comfort of your home. Consultations, prescriptions, and follow-ups available 24/7 via secure video calls.',
    status: 'Available Now'
  },
  {
    name: 'Therapy',
    value: 'therapy',
    doctor: 'Dr. James Wilson',
    specialty: 'Clinical Psychology',
    content:
      'Access confidential mental health support. Schedule weekly therapy sessions with our licensed counselors and psychiatrists to manage stress and anxiety.',
    status: 'By Appointment'
  },
  {
    name: 'Nutrition',
    value: 'nutrition',
    doctor: 'Dr. Emily Chen',
    specialty: 'Dietetics',
    content:
      'Get personalized meal plans and dietary advice. Work with our nutrition experts to achieve your fitness goals and manage dietary restrictions safely.',
    status: 'Waitlist'
  }
];
export const TAB_DATA={'tabs-14':categories,'tabs-15':properties,'tabs-16':cloudServices,'tabs-17':healthServices};
