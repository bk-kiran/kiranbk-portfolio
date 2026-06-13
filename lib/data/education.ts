export type Education = {
  id: string;
  institution: string;
  degree: string;
  period: string;
  location: string;
  coursework: string[];
  activities: {
    name: string;
    role?: string;
    period: string;
    description?: string;
    bullets?: string[];
    link?: string;
    logo?: string;
    logoImg?: string;
    logoColor?: string;
    logoBg?: string;
    courses?: string[];
    project?: {
      name: string;
      role?: string;
      period?: string;
      description?: string;
    }[];
  }[];
};

export const education: Education[] = [
  {
    id: 'umass',
    institution: 'University of Massachusetts Amherst',
    degree: 'B.S. Computer Science (Honors)',
    period: 'Expected Graduation: May 2027',
    location: 'Amherst, MA',
    coursework: [
      'Data Structures & Algorithms',
      'Programming Methodologies',
      'Operating Systems',
      'Computer Networks',
      'Software Engineering',
      'Artificial Intelligence',
      'Database Systems',
      'Object-Oriented Programming',
      'Linear Algebra',
    ],
    activities: [
      {
        name: 'BUILD UMass',
        role: 'Software Developer + Treasurer',
        link: 'https://www.buildumass.com/',
        logo: 'B',
        logoImg: '/build.jpeg',
        logoColor: '#15803d',
        logoBg: '#dcfce7',
        period: 'Sep 2025 – Present',
        bullets: [
          "Student-run org of 70+ delivering pro-bono software to nonprofits and local businesses",
          "Leading client-facing software projects — full-stack builds from scoping to delivery",
          "Managing org finances as Treasurer — budgeting and financial planning for 70+ members",
          "Coordinating General Body Meetings, onboarding, and cross-team collaboration",
        ],
      },

      {
        name: 'Researcher @ RDCL',
        link: 'https://www.umass.edu/psychological-brain-sciences/research/cognition-and-cognitive-neuroscience',
        logo: 'R',
        logoImg: '/cics.jpeg',
        logoColor: '#0369a1',
        logoBg: '#dbeafe',
        period: 'Sep 2026 – Present',
        description: 'Computational modeling of human reasoning and decision making.',
      },

      {
        name: 'Teaching Assistant',
        logo: 'TA',
        logoImg: '/cics.jpg',
        logoColor: '#b45309',
        logoBg: '#fef3c7',
        period: 'Jan 2025 – Present',
        description: 'Graded quizzes, held weekly office hours, and answered questions on Piazza, helping 300+ students master core programming concepts.',
        courses: [
          'Software Engineering (Fall 2026)',
          'Computer Systems (Fall 2025)',
          'Data Management (Spring 2025)',
          'Python Programming (Spring 2025)',
        ],
      },

      {
        name: 'iCons (Integrated Concentration in STEM)',
        link: 'https://icons.cns.umass.edu/messier-14-class-2027-and-2026',
        role: 'Scholar',
        logo: 'iC',
        logoImg: '/icons.jpeg',
        logoColor: '#7c3aed',
        logoBg: '#ede9fe',
        period: 'Feb 2024 - Present',
        description: 'A highly competitive, 20-credit STEM certificate at UMass Amherst, working in interdisciplinary research teams to tackle real-world issues at the intersection of science, technology, and society.',
        project: [
          {
            name: 'iCons 3: Waste Heat Recovery',
            description: 'Investigated the feasibility of direct-chip thermoelectric generator (TEG) placement on CPUs for waste heat recovery in data centers; designed and conducted bench-level stress test experiments across multiple thermal configurations, developed a Python data pipeline to clean, merge, and analyze CPU telemetry and sensor data, and extrapolated bench-level findings to assess the viability of TEG-based energy recovery at datacenter scale.',
          },
          {
            name: 'iCons 2: Energy Forecasting',
            description: 'Researched AI-driven energy forecasting using real-time UMass campus data; developed and evaluated ML models to predict peak electricity consumption, enabling smarter energy optimization strategies.',
          },
          {
            name: 'iCons 1: Wind Energy',
            description: 'Analyzed rural perceptions of wind energy using sentiment analysis (Python, NLTK); co-developed a 3D-printed wind-powered energy storage prototype balancing engineering feasibility with social acceptance.',
          },
        ],
      },

      {
        name: 'Researcher @ BioNLP Lab',
        link: 'https://bionlp.cs.umass.edu/',
        logo: 'BN',
        logoImg: '/cics.jpeg',
        logoColor: '#0f766e',
        logoBg: '#ccfbf1',
        period: 'Dec 2024 – Feb 2025',
        description: 'Developed clinically specialized LLMs to enhance medical decision-making by fine-tuning models like Clinical-T5, BioGPT, and LLaMA with LoRA on the MED-CALC-BENCH benchmark.',
        courses: [
          'PyTorch',
          'Hugging Face Transformers',
          'scikit-learn',
          'W&B',
          'CUDA',
        ],
      },
    ],
  },
];
