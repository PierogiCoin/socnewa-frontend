/**
 * Template Service
 * Pre-built content templates for different post types
 */

import { Platform } from '../../types';

export type TemplateCategory = 
  | 'announcement'
  | 'educational'
  | 'tips'
  | 'storytelling'
  | 'cta'
  | 'question'
  | 'poll'
  | 'milestone'
  | 'trending'
  | 'case_study'
  | 'behind_the_scenes'
  | 'testimonial'
  | 'how_to'
  | 'list'
  | 'comparison';

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  structure: {
    hook: string;
    body: string;
    cta: string;
  };
  variables: string[]; // Placeholders to fill
  platforms: Platform[];
  example: string;
  tips: string[];
  estimatedTime: string; // "2 min"
}

export const TEMPLATES: Record<TemplateCategory, Template[]> = {
  
  announcement: [
    {
      id: 'ann_001',
      name: 'Big News',
      category: 'announcement',
      description: 'Announce major company news or product launch',
      structure: {
        hook: '🎉 Big news! We\'re thrilled to announce {announcement}',
        body: 'After {timeframe}, we\'re finally ready to share {details}.\n\nThis means:\n• {benefit1}\n• {benefit2}\n• {benefit3}',
        cta: '{cta_question} Drop a comment below! 👇'
      },
      variables: ['announcement', 'timeframe', 'details', 'benefit1', 'benefit2', 'benefit3', 'cta_question'],
      platforms: [Platform.LinkedIn, Platform.Facebook, Platform.Instagram],
      example: '🎉 Big news! We\'re thrilled to announce our new AI-powered platform!\n\nAfter 18 months, we\'re finally ready to share what we\'ve been building...',
      tips: [
        'Use emoji in hook for attention',
        'Keep announcement clear and concise',
        'Include specific benefits',
        'End with engaging question'
      ],
      estimatedTime: '3 min'
    },
    {
      id: 'ann_002',
      name: 'Quick Update',
      category: 'announcement',
      description: 'Short, punchy announcement',
      structure: {
        hook: '📢 Quick update:',
        body: '{update_text}\n\nWhy this matters: {reason}',
        cta: 'Thoughts? 💭'
      },
      variables: ['update_text', 'reason'],
      platforms: [Platform.X, Platform.LinkedIn],
      example: '📢 Quick update:\n\nWe just hit 10K users! 🚀\n\nWhy this matters: Your feedback shapes our product.',
      tips: ['Keep it under 280 chars for X', 'Be specific', 'Show excitement'],
      estimatedTime: '1 min'
    }
  ],

  educational: [
    {
      id: 'edu_001',
      name: 'How-To Guide',
      category: 'educational',
      description: 'Step-by-step tutorial',
      structure: {
        hook: 'How to {achieve_result} in {timeframe}:',
        body: 'Step 1: {step1}\nStep 2: {step2}\nStep 3: {step3}\nStep 4: {step4}\nStep 5: {step5}',
        cta: 'Which step do you find hardest? Let me know! 👇'
      },
      variables: ['achieve_result', 'timeframe', 'step1', 'step2', 'step3', 'step4', 'step5'],
      platforms: [Platform.LinkedIn, Platform.Instagram, Platform.TikTok],
      example: 'How to write viral content in 30 minutes:\n\nStep 1: Start with a hook\nStep 2: Add personal story...',
      tips: ['Make steps actionable', 'Use numbers', 'Keep steps simple', 'Add examples'],
      estimatedTime: '5 min'
    },
    {
      id: 'edu_002',
      name: 'Myth Buster',
      category: 'educational',
      description: 'Debunk common myths',
      structure: {
        hook: '❌ Myth: {myth}\n✅ Reality: {reality}',
        body: 'Here\'s why everyone gets this wrong:\n\n{explanation}\n\nWhat to do instead:\n{solution}',
        cta: 'What other myths should I bust? 🤔'
      },
      variables: ['myth', 'reality', 'explanation', 'solution'],
      platforms: [Platform.LinkedIn, Platform.X, Platform.Instagram],
      example: '❌ Myth: AI will replace all jobs\n✅ Reality: AI will transform how we work',
      tips: ['Challenge popular beliefs', 'Provide evidence', 'Offer alternative'],
      estimatedTime: '4 min'
    }
  ],

  tips: [
    {
      id: 'tip_001',
      name: 'X Tips List',
      category: 'tips',
      description: 'Numbered tips/hacks',
      structure: {
        hook: '{number} {topic} tips that {benefit}:',
        body: '1. {tip1}\n2. {tip2}\n3. {tip3}\n4. {tip4}\n5. {tip5}',
        cta: 'Which one will you try first? 💡'
      },
      variables: ['number', 'topic', 'benefit', 'tip1', 'tip2', 'tip3', 'tip4', 'tip5'],
      platforms: [Platform.LinkedIn, Platform.Instagram, Platform.X],
      example: '5 productivity tips that changed my life:\n\n1. Wake up at 5 AM\n2. Time-block everything...',
      tips: ['Use odd numbers (3, 5, 7)', 'Make each tip actionable', 'Add emoji bullets'],
      estimatedTime: '4 min'
    }
  ],

  storytelling: [
    {
      id: 'story_001',
      name: 'Personal Journey',
      category: 'storytelling',
      description: 'Share your story',
      structure: {
        hook: '{years_ago}, I {starting_point}. Today, {current_state}.',
        body: 'The journey wasn\'t easy:\n\n{struggle1}\n{struggle2}\n\nBut I learned:\n{lesson1}\n{lesson2}\n\nNow:\n{result}',
        cta: 'What\'s your story? Share below! 👇'
      },
      variables: ['years_ago', 'starting_point', 'current_state', 'struggle1', 'struggle2', 'lesson1', 'lesson2', 'result'],
      platforms: [Platform.LinkedIn, Platform.Instagram],
      example: '5 years ago, I was broke and lost. Today, I run a 7-figure business.',
      tips: ['Be vulnerable', 'Show the struggle', 'Share lessons learned', 'Inspire others'],
      estimatedTime: '6 min'
    }
  ],

  cta: [
    {
      id: 'cta_001',
      name: 'Strong CTA',
      category: 'cta',
      description: 'Drive action',
      structure: {
        hook: '{value_proposition}',
        body: 'Here\'s what you get:\n✓ {benefit1}\n✓ {benefit2}\n✓ {benefit3}',
        cta: '{action_verb} now: {link_placeholder}'
      },
      variables: ['value_proposition', 'benefit1', 'benefit2', 'benefit3', 'action_verb', 'link_placeholder'],
      platforms: [Platform.Facebook, Platform.Instagram, Platform.LinkedIn],
      example: 'Transform your content strategy in 30 days.\n\nHere\'s what you get:\n✓ AI-powered tools...',
      tips: ['Clear value prop', 'List benefits', 'Strong action verb', 'Create urgency'],
      estimatedTime: '3 min'
    }
  ],

  question: [
    {
      id: 'q_001',
      name: 'Engagement Question',
      category: 'question',
      description: 'Spark discussion',
      structure: {
        hook: '{thought_provoking_question}',
        body: 'I\'ve been thinking about this because {context}.\n\nMy take: {your_opinion}',
        cta: 'What do you think? Let\'s discuss 💬'
      },
      variables: ['thought_provoking_question', 'context', 'your_opinion'],
      platforms: [Platform.LinkedIn, Platform.Facebook, Platform.X],
      example: 'Is AI making us more or less creative?\n\nI\'ve been thinking about this because...',
      tips: ['Ask open-ended questions', 'Share your take first', 'Be genuinely curious'],
      estimatedTime: '2 min'
    }
  ],

  poll: [
    {
      id: 'poll_001',
      name: 'Simple Poll',
      category: 'poll',
      description: 'Get audience feedback',
      structure: {
        hook: 'Quick poll: {poll_question}',
        body: '🔵 Option A: {option_a}\n🟢 Option B: {option_b}\n🟡 Option C: {option_c}',
        cta: 'Vote below! 👇'
      },
      variables: ['poll_question', 'option_a', 'option_b', 'option_c'],
      platforms: [Platform.X, Platform.LinkedIn, Platform.Instagram],
      example: 'Quick poll: What\'s your biggest challenge?\n\n🔵 Time management\n🟢 Creativity...',
      tips: ['Keep options clear', 'Use emoji for visibility', '3-4 options max'],
      estimatedTime: '2 min'
    }
  ],

  milestone: [
    {
      id: 'mile_001',
      name: 'Achievement Celebration',
      category: 'milestone',
      description: 'Celebrate wins',
      structure: {
        hook: '🎉 We did it! Just hit {milestone}!',
        body: 'This journey started {when}.\n\nThe path here:\n• {moment1}\n• {moment2}\n• {moment3}\n\nThank you to {acknowledgment}!',
        cta: 'Here\'s to the next {next_goal}! 🚀'
      },
      variables: ['milestone', 'when', 'moment1', 'moment2', 'moment3', 'acknowledgment', 'next_goal'],
      platforms: [Platform.LinkedIn, Platform.Instagram, Platform.Facebook],
      example: '🎉 We did it! Just hit 100K followers!\n\nThis journey started 2 years ago...',
      tips: ['Show gratitude', 'Share the journey', 'Set next goal', 'Be genuine'],
      estimatedTime: '4 min'
    }
  ],

  trending: [
    {
      id: 'trend_001',
      name: 'Trend Commentary',
      category: 'trending',
      description: 'Comment on trending topic',
      structure: {
        hook: 'Everyone is talking about {trending_topic}. Here\'s my take:',
        body: '{your_perspective}\n\nWhy this matters:\n{significance}\n\nWhat to watch:\n{prediction}',
        cta: 'Agree or disagree? 🤔'
      },
      variables: ['trending_topic', 'your_perspective', 'significance', 'prediction'],
      platforms: [Platform.X, Platform.LinkedIn],
      example: 'Everyone is talking about GPT-5. Here\'s my take:\n\nThe hype is real but...',
      tips: ['Jump on trends early', 'Add unique perspective', 'Be authentic'],
      estimatedTime: '3 min'
    }
  ],

  case_study: [
    {
      id: 'case_001',
      name: 'Success Story',
      category: 'case_study',
      description: 'Share client/customer success',
      structure: {
        hook: 'How {client_name} achieved {result} in {timeframe}:',
        body: 'The Challenge:\n{problem}\n\nThe Solution:\n{solution}\n\nThe Results:\n• {result1}\n• {result2}\n• {result3}',
        cta: 'Want similar results? {cta_action}'
      },
      variables: ['client_name', 'result', 'timeframe', 'problem', 'solution', 'result1', 'result2', 'result3', 'cta_action'],
      platforms: [Platform.LinkedIn, Platform.Facebook],
      example: 'How Acme Corp doubled revenue in 6 months:\n\nThe Challenge: Low conversion rates...',
      tips: ['Use real data', 'Tell complete story', 'Show clear ROI', 'Get permission'],
      estimatedTime: '5 min'
    }
  ],

  behind_the_scenes: [
    {
      id: 'bts_001',
      name: 'Behind the Scenes',
      category: 'behind_the_scenes',
      description: 'Show the process',
      structure: {
        hook: 'Behind the scenes: {what_youre_showing}',
        body: 'Most people see {final_result}.\n\nWhat they don\'t see:\n• {reality1}\n• {reality2}\n• {reality3}\n\n{honest_reflection}',
        cta: 'What do you want to see more of? 📸'
      },
      variables: ['what_youre_showing', 'final_result', 'reality1', 'reality2', 'reality3', 'honest_reflection'],
      platforms: [Platform.Instagram, Platform.TikTok, Platform.LinkedIn],
      example: 'Behind the scenes: Creating content.\n\nMost people see polished posts...',
      tips: ['Be authentic', 'Show messy reality', 'Build connection', 'Be relatable'],
      estimatedTime: '3 min'
    }
  ],

  testimonial: [
    {
      id: 'test_001',
      name: 'Customer Quote',
      category: 'testimonial',
      description: 'Share customer feedback',
      structure: {
        hook: '"{customer_quote}"',
        body: '- {customer_name}, {customer_title}\n\nThis is why we do what we do.\n\n{context_about_customer}',
        cta: 'Read more success stories: {link_placeholder}'
      },
      variables: ['customer_quote', 'customer_name', 'customer_title', 'context_about_customer', 'link_placeholder'],
      platforms: [Platform.LinkedIn, Platform.Facebook, Platform.Instagram],
      example: '"This tool changed everything for our team."\n\n- Sarah J., Marketing Director',
      tips: ['Get permission', 'Use real quotes', 'Add context', 'Show impact'],
      estimatedTime: '2 min'
    }
  ],

  how_to: [
    {
      id: 'howto_001',
      name: 'Quick Tutorial',
      category: 'how_to',
      description: 'Teach something specific',
      structure: {
        hook: 'How to {specific_task}:',
        body: '1️⃣ {step1}\n2️⃣ {step2}\n3️⃣ {step3}\n\n💡 Pro tip: {pro_tip}',
        cta: 'Save this for later! 📌'
      },
      variables: ['specific_task', 'step1', 'step2', 'step3', 'pro_tip'],
      platforms: [Platform.Instagram, Platform.TikTok, Platform.LinkedIn],
      example: 'How to write viral hooks:\n\n1️⃣ Start with a question\n2️⃣ Create curiosity...',
      tips: ['Be specific', 'Keep steps simple', 'Add visual aids', 'Include pro tip'],
      estimatedTime: '3 min'
    }
  ],

  list: [
    {
      id: 'list_001',
      name: 'Listicle',
      category: 'list',
      description: 'Curated list of resources/tools/tips',
      structure: {
        hook: '{number} {topic} that {benefit}:',
        body: '1. {item1} - {description1}\n2. {item2} - {description2}\n3. {item3} - {description3}\n4. {item4} - {description4}\n5. {item5} - {description5}',
        cta: 'Which is your favorite? Drop a number! 👇'
      },
      variables: ['number', 'topic', 'benefit', 'item1', 'description1', 'item2', 'description2', 'item3', 'description3', 'item4', 'description4', 'item5', 'description5'],
      platforms: [Platform.LinkedIn, Platform.X, Platform.Instagram],
      example: '10 AI tools that save me 10 hours/week:\n\n1. ChatGPT - Content writing\n2. Midjourney - Design...',
      tips: ['Use odd numbers', 'Add brief descriptions', 'Order by importance', 'Personal experience'],
      estimatedTime: '5 min'
    }
  ],

  comparison: [
    {
      id: 'comp_001',
      name: 'Versus Post',
      category: 'comparison',
      description: 'Compare two options',
      structure: {
        hook: '{option_a} vs {option_b}: Which is better?',
        body: '{option_a}:\n✅ {pro1}\n✅ {pro2}\n❌ {con1}\n\n{option_b}:\n✅ {pro3}\n✅ {pro4}\n❌ {con2}\n\nThe verdict:\n{conclusion}',
        cta: 'Which do you prefer? Team {option_a} or Team {option_b}? 🤔'
      },
      variables: ['option_a', 'option_b', 'pro1', 'pro2', 'con1', 'pro3', 'pro4', 'con2', 'conclusion'],
      platforms: [Platform.LinkedIn, Platform.Instagram, Platform.X],
      example: 'ChatGPT vs Claude: Which is better?\n\nChatGPT:\n✅ Faster responses...',
      tips: ['Be objective', 'List pros/cons', 'Give honest verdict', 'Encourage debate'],
      estimatedTime: '4 min'
    }
  ]
};

export const getTemplatesByCategory = (category: TemplateCategory): Template[] => {
  return TEMPLATES[category] || [];
};

export const getAllTemplates = (): Template[] => {
  return Object.values(TEMPLATES).flat();
};

export const getTemplateById = (id: string): Template | undefined => {
  return getAllTemplates().find(t => t.id === id);
};

export const getTemplatesForPlatform = (platform: Platform): Template[] => {
  return getAllTemplates().filter(t => t.platforms.includes(platform));
};

export const fillTemplate = (
  template: Template,
  values: Record<string, string>
): string => {
  let result = `${template.structure.hook}\n\n${template.structure.body}\n\n${template.structure.cta}`;
  
  template.variables.forEach(variable => {
    const value = values[variable] || `[${variable}]`;
    result = result.replace(new RegExp(`\\{${variable}\\}`, 'g'), value);
  });
  
  return result;
};
