export interface ServiceItem {
  id: string;
  title: string;
  iconName: string;
  iconLib: 'Ionicons' | 'MaterialCommunityIcons' | 'Feather' | 'MaterialIcons';
  color: string;
  bgColor: string;
  description: string;
  subItems: string[];
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    iconName: 'color-palette-outline',
    iconLib: 'Ionicons',
    color: '#FF6B9D',
    bgColor: 'rgba(255, 107, 157, 0.12)',
    description: 'Professional visual design that makes your brand memorable and stand out in the market.',
    subItems: [
      'Logo Design',
      'Social Media Posts',
      'Brand Identity Design',
      'Marketing Banners',
      'Business Cards',
    ],
  },
  {
    id: 'seo',
    title: 'SEO Services',
    iconName: 'trending-up-outline',
    iconLib: 'Ionicons',
    color: '#22C55E',
    bgColor: 'rgba(34, 197, 94, 0.12)',
    description: 'Boost your online visibility and drive organic traffic with proven SEO strategies.',
    subItems: [
      'Website SEO Optimization',
      'Keyword Research',
      'On-Page SEO',
      'Technical SEO',
      'SEO Audit',
    ],
  },
  {
    id: 'web-development',
    title: 'Web Development',
    iconName: 'code-slash-outline',
    iconLib: 'Ionicons',
    color: '#4F8EFF',
    bgColor: 'rgba(79, 142, 255, 0.12)',
    description: 'Modern, responsive websites that convert visitors into customers.',
    subItems: [
      'Business Websites',
      'E-commerce Websites',
      'Landing Pages',
      'Portfolio Websites',
      'Website Maintenance',
    ],
  },
  {
    id: 'google-ads',
    title: 'Google Ads',
    iconName: 'megaphone-outline',
    iconLib: 'Ionicons',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    description: 'Data-driven Google Ads campaigns that maximize ROI and grow your business.',
    subItems: [
      'Campaign Setup',
      'Keyword Targeting',
      'Conversion Tracking',
      'Performance Optimization',
      'Ads Strategy',
    ],
  },
  {
    id: 'facebook-ads',
    title: 'Facebook Ads',
    iconName: 'logo-facebook',
    iconLib: 'Ionicons',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.12)',
    description: 'Targeted Facebook & Instagram campaigns that reach your ideal customers.',
    subItems: [
      'Campaign Creation',
      'Audience Targeting',
      'Lead Generation Ads',
      'Retargeting Campaigns',
      'Ads Optimization',
    ],
  },
  {
    id: 'app-development',
    title: 'App Development',
    iconName: 'phone-portrait-outline',
    iconLib: 'Ionicons',
    color: '#A855F7',
    bgColor: 'rgba(168, 85, 247, 0.12)',
    description: 'Custom mobile applications that deliver exceptional user experiences.',
    subItems: [
      'Android App Development',
      'Custom Mobile Applications',
      'Business Apps',
      'UI/UX Design for Apps',
    ],
  },
  {
    id: 'ai-services',
    title: 'AI Services',
    iconName: 'hardware-chip-outline',
    iconLib: 'Ionicons',
    color: '#00C9E0',
    bgColor: 'rgba(0, 201, 224, 0.12)',
    description: 'Cutting-edge AI solutions that automate processes and scale your business.',
    subItems: [
      'AI Automation',
      'AI Chatbot Development',
      'AI Content Generation',
      'AI Business Tools Integration',
      'AI Workflow Automation',
    ],
  },
];
