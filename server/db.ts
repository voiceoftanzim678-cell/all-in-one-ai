import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { AiTool, Category, SiteSettings, User } from '../src/types.js';

interface StoredUser extends User {
  password_hash: string;
  salt: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  tools: AiTool[];
  categories: Category[];
  settings: SiteSettings;
  sessions: {
    token: string;
    userId: string;
    createdAt: string;
    expiresAt: string;
  }[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function isValidUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Initial 16 Categories with English and Bengali translations
const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-chat',
    name_en: 'Chat & Assistant',
    name_bn: 'চ্যাট এবং অ্যাসিস্ট্যান্ট',
    description_en: 'Conversational AI, smart copilots, and intelligent assistants.',
    description_bn: 'কথোপকথনমূলক AI, স্মার্ট কোপাইলট এবং ভার্চুয়াল সহকারী।',
    icon: 'MessageSquare',
    active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-image',
    name_en: 'Image Generation',
    name_bn: 'ছবি তৈরি (Image Gen)',
    description_en: 'Create art, photorealistic photos, illustrations, and concept graphics.',
    description_bn: 'ডিজিটাল শিল্প, বাস্তবসম্মত ছবি এবং ইলাস্ট্রেশন তৈরির টুলস।',
    icon: 'Image',
    active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-video',
    name_en: 'Video Generation',
    name_bn: 'ভিডিও তৈরি ও এডিটিং',
    description_en: 'Text-to-video generators, AI avatars, video enhancement, and editing.',
    description_bn: 'টেক্সট থেকে ভিডিও তৈরি, AI অবতার এবং ভিডিও এডিটিং।',
    icon: 'Video',
    active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-music',
    name_en: 'Music & Audio',
    name_bn: 'মিউজিক এবং অডিও',
    description_en: 'AI song composition, sound effects, mastering, and background music.',
    description_bn: 'গান তৈরি, সাউন্ড ইফেক্ট ও অডিও প্রোডাকশন।',
    icon: 'Music',
    active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-writing',
    name_en: 'Writing',
    name_bn: 'লেখালেখি ও কনটেন্ট',
    description_en: 'Copywriting, blog posts, academic research, essays, and proofreading.',
    description_bn: 'ব্লগ পোস্ট, প্রবন্ধ, কপিরাইটিং এবং ব্যাকরণ সংশোধনের টুলস।',
    icon: 'PenTool',
    active: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-coding',
    name_en: 'Coding & Programming',
    name_bn: 'কোডিং এবং প্রোগ্রামিং',
    description_en: 'Code completion, bug fixing, IDE extensions, and automated refactoring.',
    description_bn: 'কোড জেনারেশন, বাগ ফিক্স এবং ডেভেলপারদের সহায়ক টুলস।',
    icon: 'Code',
    active: true,
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-design',
    name_en: 'Design',
    name_bn: 'গ্রাফিক ও UI ডিজাইন',
    description_en: 'UI/UX design, banners, vector generation, and typography tools.',
    description_bn: 'ইউজার ইন্টারফেস, ব্যানার ও গ্রাফিক ডিজাইন সুবিধা।',
    icon: 'Palette',
    active: true,
    sort_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-education',
    name_en: 'Education',
    name_bn: 'শিক্ষা এবং লার্নিং',
    description_en: 'Personalized tutoring, language learning, flashcards, and homework help.',
    description_bn: 'অনলাইন শিক্ষকতা, ভাষা শিক্ষা এবং পড়ালেখার সহায়ক AI।',
    icon: 'GraduationCap',
    active: true,
    sort_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-productivity',
    name_en: 'Productivity',
    name_bn: 'প্রোডাক্টিভিটি ও ওয়ার্কফ্লো',
    description_en: 'Workflow automation, task management, summaries, and note taking.',
    description_bn: 'নোট নেওয়া, মিটিং সামারি ও দৈনন্দিন কাজের গতি বৃদ্ধি।',
    icon: 'CheckSquare',
    active: true,
    sort_order: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-research',
    name_en: 'Research',
    name_bn: 'রিসার্চ ও অনুসন্ধান',
    description_en: 'Academic literature reviews, citations, paper analysis, and discovery.',
    description_bn: 'গবেষণামূলক পেপার বিশ্লেষণ, রেফারেন্স এবং তথ্য অনুসন্ধান।',
    icon: 'Search',
    active: true,
    sort_order: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-presentation',
    name_en: 'Presentation',
    name_bn: 'প্রেজেন্টেশন ও স্লাইড',
    description_en: 'AI-generated slide decks, interactive visual briefs, and pitch decks.',
    description_bn: 'আকর্ষণীয় স্লাইড ডেক এবং প্রফেশনাল প্রেজেন্টেশন মেকার।',
    icon: 'Layout',
    active: true,
    sort_order: 11,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-marketing',
    name_en: 'Marketing',
    name_bn: 'মার্কেটিং ও বিজ্ঞাপন',
    description_en: 'Ad copy generation, social media scheduling, SEO, and campaign analytics.',
    description_bn: 'সোশ্যাল মিডিয়া পোস্ট, বিজ্ঞাপন তৈরি এবং SEO অ্যানালিটিক্স।',
    icon: 'TrendingUp',
    active: true,
    sort_order: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-voice',
    name_en: 'Voice',
    name_bn: 'ভয়েস ও স্পিচ',
    description_en: 'Voice cloning, realistic text-to-speech, podcast audio, and voiceover.',
    description_bn: 'টেক্সট থেকে মানুষের মতো স্বাভাবিক কণ্ঠ এবং ভয়েস ক্লোনিং।',
    icon: 'Mic',
    active: true,
    sort_order: 13,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-translation',
    name_en: 'Translation',
    name_bn: 'অনুবাদ (Translation)',
    description_en: 'High-accuracy cross-language translations and localization.',
    description_bn: 'সঠিক ও প্রাকৃতিক বহুভাষিক অনুবাদ সেবা।',
    icon: 'Globe',
    active: true,
    sort_order: 14,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-3d',
    name_en: '3D & Creative',
    name_bn: '৩ডি ও ক্রিয়েটিভ',
    description_en: '3D asset generation, mesh creation, VR/AR experiences, and textures.',
    description_bn: 'ত্রিমাত্রিক (3D) মডেল, টেক্সচার ও গেম অ্যাসেট তৈরি।',
    icon: 'Box',
    active: true,
    sort_order: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-other',
    name_en: 'Other AI Tools',
    name_bn: 'অন্যান্য AI টুলস',
    description_en: 'Specialized utilities, experimental tools, and emerging AI technologies.',
    description_bn: 'বিশেষায়িত এবং নতুন ধরনের অন্যান্য আধুনিক AI প্রযুক্তি।',
    icon: 'Cpu',
    active: true,
    sort_order: 16,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Verified AI Tools with OFFICIAL verified URLs only
const INITIAL_TOOLS: AiTool[] = [
  {
    id: 'tool-chatgpt',
    name_en: 'ChatGPT',
    name_bn: 'চ্যাটজিপিটি',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    website_url: 'https://chatgpt.com',
    category_id: 'cat-chat',
    short_description_en: 'An AI assistant for writing, learning, brainstorming, coding, and everyday tasks.',
    short_description_bn: 'লেখালেখি, কোডিং, নতুন আইডিয়া তৈরি এবং দৈনন্দিন কাজের জন্য একটি বহুমুখী AI সহকারী।',
    full_description_en: 'Developed by OpenAI, ChatGPT is a leading generative AI conversational model capable of understanding natural language, answering questions, generating creative prose, debugging code, and solving complex problems across multiple modalities including text, voice, and vision.',
    full_description_bn: 'OpenAI দ্বারা নির্মিত ChatGPT হলো বিশ্বের সবচেয়ে জনপ্রিয় AI মডেল। এটি মানুষের মতো ভাষায় কথোপকথন, সৃজনশীল লেখা তৈরি, কোড লেখা এবং বিভিন্ন জটিল সমস্যার সমাধান করতে পারে।',
    tags: ['chat', 'assistant', 'writing', 'coding', 'openai', 'multimodal'],
    features_en: ['Conversational reasoning', 'Code generation and debugging', 'Web search browsing', 'File and image analysis', 'Custom GPT creation'],
    features_bn: ['স্বাভাবিক ভাষায় যুক্তি ও উত্তর প্রদান', 'কোড তৈরি এবং ত্রুটি সংশোধন', 'ইন্টারনেট ব্রাউজিং ফিচার', 'ফাইল ও ছবি বিশ্লেষণ সুবিধা'],
    languages: ['Multilingual', 'English', 'Bengali', 'Spanish', 'French', 'German'],
    featured: true,
    popular: true,
    active: true,
    sponsored: false,
    pricing_type: 'Freemium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tool-gemini',
    name_en: 'Google Gemini',
    name_bn: 'গুগল জেমিনাই',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
    website_url: 'https://gemini.google.com',
    category_id: 'cat-chat',
    short_description_en: 'Next-generation multimodal AI by Google built for deep reasoning and Workspace integration.',
    short_description_bn: 'গুগলের অত্যাধুনিক মাল্টিমোডাল AI যা গুগল ওয়ার্কস্পেস এবং ইন্টারনেটের সাথে সমন্বিত।',
    full_description_en: 'Google Gemini is a multimodal AI system built from the ground up to reason seamlessly across text, images, video, audio, and code. It integrates directly with Google Workspace apps like Docs, Gmail, and Drive, providing real-time web knowledge and high-speed execution.',
    full_description_bn: 'গুগল জেমিনাই টেক্সট, ছবি, অডিও এবং কোডের মতো বিষয়গুলো সমন্বিতভাবে বোঝার জন্য তৈরি। এটি গুগল ওয়ার্কস্পেসের সাথে সরাসরি কাজ করে নির্ভুল তথ্য প্রদান করে।',
    tags: ['chat', 'google', 'multimodal', 'workspace', 'assistant', 'reasoning'],
    features_en: ['Native multimodal processing', 'Massive context window', 'Google Workspace integration', 'Real-time Google search grounding'],
    features_bn: ['মাল্টিমোডাল প্রসেসিং', 'বিশাল কনটেক্সট উইন্ডো', 'গুগল ড্রাইভ ও জিমেইল সংযোগ'],
    languages: ['Multilingual', 'English', 'Bengali', '40+ Languages'],
    featured: true,
    popular: true,
    active: true,
    sponsored: false,
    pricing_type: 'Freemium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tool-claude',
    name_en: 'Claude',
    name_bn: 'ক্লড',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg',
    website_url: 'https://claude.ai',
    category_id: 'cat-chat',
    short_description_en: 'Anthropic\'s conversational AI known for exceptional nuance, safety, and coding precision.',
    short_description_bn: 'অ্যানথ্রপিক-এর নিরাপদ ও উচ্চমানের AI সহকারী যা দীর্ঘ লেখা এবং কোডিংয়ে অত্যন্ত দক্ষ।',
    full_description_en: 'Claude by Anthropic is built with Constitutional AI to provide helpful, honest, and harmless interactions. It features industry-leading reasoning benchmarks, artifact generation for live web preview, and large 200k context windows for processing entire documents and codebases.',
    full_description_bn: 'Claude দীর্ঘ ডকুমেন্ট পড়া, জটিল কোড বিশ্লেষণ এবং মানসম্পন্ন প্রাতিষ্ঠানিক লেখা তৈরিতে বিশেষভাবে পারদর্শী।',
    tags: ['chat', 'anthropic', 'artifacts', 'safety', 'analysis', 'long-context'],
    features_en: ['Interactive Artifacts system', '200K token context window', 'Superior coding and writing nuance', 'Document and spreadsheet analysis'],
    features_bn: ['লাইভ আর্টিফ্যাক্ট প্রিভিউ', '২০০ হাজার টোকেন কনটেক্সট', 'উচ্চমানের কোডিং সক্ষমতা'],
    languages: ['Multilingual', 'English', 'Bengali', 'Japanese', 'Spanish'],
    featured: true,
    popular: true,
    active: true,
    sponsored: false,
    pricing_type: 'Freemium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tool-midjourney',
    name_en: 'Midjourney',
    name_bn: 'মিডজার্নি',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
    website_url: 'https://midjourney.com',
    category_id: 'cat-image',
    short_description_en: 'Premier artistic text-to-image generator known for cinematic photorealism and creative fidelity.',
    short_description_bn: 'সিনেম্যাটিক ও দৃষ্টিনন্দন ডিজিটাল ছবি তৈরির বিশ্বখ্যাত AI টুল।',
    full_description_en: 'Midjourney is an independent research lab producing an AI program that generates high-fidelity images from natural language descriptions. Renowned for its unparalleled artistic lighting, composition, camera realism, and intuitive prompt control.',
    full_description_bn: 'মিডজার্নি টেক্সট প্রম্পট থেকে অসাধারণ শিল্পকর্ম এবং সিনেম্যাটিক বাস্তব ছবি তৈরি করতে বিশ্বজুড়ে ডিজাইনারদের পছন্দের শীর্ষে।',
    tags: ['image', 'art', 'photorealism', 'creative', 'design', 'rendering'],
    features_en: ['Cinematic photorealism', 'Inpainting & Outpainting (Vary Region)', 'Style reference (sref) system', 'High-resolution upscaling'],
    features_bn: ['সিনেম্যাটিক আলো ও ছায়া', 'হাই-রেজোলিউশন আপস্কেলিং', 'স্টাইল রেফারেন্স পদ্ধতি'],
    languages: ['English', 'Multilingual prompts'],
    featured: true,
    popular: true,
    active: true,
    sponsored: false,
    pricing_type: 'Paid',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tool-runway',
    name_en: 'Runway',
    name_bn: 'রানওয়ে',
    logo_url: 'https://assets.stickpng.com/images/64f8a8462a632598380e03be.png',
    website_url: 'https://runwayml.com',
    category_id: 'cat-video',
    short_description_en: 'Pioneering generative video creation suite powered by Gen-2 and Gen-3 Alpha models.',
    short_description_bn: 'টেক্সট এবং ছবি থেকে হাই-কোয়ালিটি ভিডিও তৈরি করার শীর্ষস্থানীয় ভিডিও প্ল্যাটফর্ম।',
    full_description_en: 'Runway provides creative generative tools for filmmakers, animators, and content creators. With Gen-3 Alpha, creators can turn text descriptions or static images into realistic, high-definition video clips with camera motion control.',
    full_description_bn: 'রানওয়ে চলচ্চিত্র নির্মাতা ও কন্টেন্ট ক্রিয়েটরদের জন্য বাস্তবসম্মত এআই ভিডিও জেনারেশন ও সম্পাদনার অত্যাধুনিক সুবিধা দেয়।',
    tags: ['video', 'generative-video', 'animation', 'vfx', 'motion', 'cinematic'],
    features_en: ['Text-to-Video generation', 'Image-to-Video conversion', 'Camera motion director mode', 'Motion brush manipulation'],
    features_bn: ['টেক্সট থেকে ভিডিও তৈরি', 'ছবি থেকে অ্যানিমেশন', 'ক্যামেরা মুভমেন্ট নিয়ন্ত্রণ'],
    languages: ['English', 'Multilingual'],
    featured: true,
    popular: true,
    active: true,
    sponsored: false,
    pricing_type: 'Freemium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tool-suno',
    name_en: 'Suno AI',
    name_bn: 'সুনো AI',
    logo_url: 'https://assets.stickpng.com/images/661d4a04e6ebbc21a4f0bb99.png',
    website_url: 'https://suno.com',
    category_id: 'cat-music',
    short_description_en: 'Create full-length original songs with vocals, lyrics, and production across any music genre.',
    short_description_bn: 'যেকোনো ধরণ বা ভাষায় কণ্ঠ ও সুরসহ সম্পূর্ণ গান তৈরির বিস্ময়কর AI টুল।',
    full_description_en: 'Suno allows anyone to create radio-ready music from a simple prompt. It generates realistic vocals, instruments, lyrics, and arrangements across jazz, rock, classical, pop, electronic, and traditional genres.',
    full_description_bn: 'সুনো এআই দিয়ে খুব সহজেই সুর, বাদ্যযন্ত্র এবং ভোকালসহ সম্পূর্ণ গান তৈরি করা যায়।',
    tags: ['music', 'audio', 'song', 'vocals', 'composition', 'lyrics'],
    features_en: ['Full-length song generation', 'Custom lyric input', 'Multi-genre instrumentals', 'Vocal synthesis and mastering'],
    features_bn: ['সম্পূর্ণ গান তৈরি', 'কাস্টম লিরিক্স সাপোর্ট', 'বিভিন্ন জনরার মিউজিক'],
    languages: ['English', 'Bengali', 'Multilingual'],
    featured: false,
    popular: true,
    active: true,
    sponsored: false,
    pricing_type: 'Freemium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tool-cursor',
    name_en: 'Cursor',
    name_bn: 'কার্সর',
    logo_url: 'https://raw.githubusercontent.com/getcursor/cursor/main/.github/logo.png',
    website_url: 'https://cursor.com',
    category_id: 'cat-coding',
    short_description_en: 'An AI-first code editor built as a fork of VS Code with deep codebase intelligence.',
    short_description_bn: 'একটি শক্তিশালী AI কোড এডিটর যা সম্পূর্ণ কোডবেস বুঝে দ্রুত সফটওয়্যার তৈরি করতে সহায়তা করে।',
    full_description_en: 'Cursor is engineered for pair-programming with AI. Built on VS Code, it lets engineers index their entire repository, make multi-file edits via natural language instructions, and predict edits ahead of time.',
    full_description_bn: 'কার্সর ডেভেলপারদের পুরো রিপোজিটরি স্ক্যান করে একাধিক ফাইলে একসাথে কোড এডিট এবং সমাধান দিতে সক্ষম।',
    tags: ['coding', 'programming', 'ide', 'developer', 'vscode', 'copilot'],
    features_en: ['Full codebase indexing and search', 'Multi-file edits (Composer)', 'Instant tab auto-completions', 'Contextual error debugging'],
    features_bn: ['সম্পূর্ণ কোডবেস ইনডেক্সিং', 'মাল্টি-ফাইল অটো এডিটিং', 'স্মার্ট কোড সাজেশন'],
    languages: ['Supports all programming languages'],
    featured: true,
    popular: true,
    active: true,
    sponsored: false,
    pricing_type: 'Freemium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tool-perplexity',
    name_en: 'Perplexity AI',
    name_bn: 'পারপ্লেক্সিটি AI',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Perplexity_AI_logo.svg',
    website_url: 'https://perplexity.ai',
    category_id: 'cat-research',
    short_description_en: 'AI conversational search engine providing direct answers with reliable academic and web citations.',
    short_description_bn: 'সঠিক রেফারেন্স ও সোর্সসহ তথ্য খোঁজার জন্য আধুনিক AI সার্চ ইঞ্জিন।',
    full_description_en: 'Perplexity AI unlocks the power of knowledge by serving as an interactive answer engine. Unlike traditional search engines with links, it summarizes real-time web results and directly attributes every claim to verifiable sources.',
    full_description_bn: 'পারপ্লেক্সিটি সাধারণ সার্চ ইঞ্জিনের চেয়ে আলাদা; এটি ইন্টারনেট ঘেঁটে সঠিক সূত্রের রেফারেন্সসহ সরাসরি প্রশ্নের উত্তর দেয়।',
    tags: ['research', 'search', 'citations', 'knowledge', 'papers', 'academic'],
    features_en: ['Real-time citation tracking', 'Pro Search with multi-step reasoning', 'Academic paper filtering', 'Collections organization'],
    features_bn: ['তথ্য সূত্রের সরাসরি লিংক', 'উন্নত প্রো সার্চ', 'রিসার্চ পেপার খোঁজা'],
    languages: ['English', 'Bengali', 'Multilingual'],
    featured: true,
    popular: true,
    active: true,
    sponsored: false,
    pricing_type: 'Freemium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tool-elevenlabs',
    name_en: 'ElevenLabs',
    name_bn: 'ইলেভেনল্যাবস',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/ElevenLabs_logo.png',
    website_url: 'https://elevenlabs.io',
    category_id: 'cat-voice',
    short_description_en: 'Industry standard for hyper-realistic AI voice synthesis, voice cloning, and audio dubbing.',
    short_description_bn: 'মানুষের মতো নিখুঁত ভয়েস তৈরি এবং ভয়েস ক্লোনিংয়ের সবচেয়ে উন্নত অডিও AI প্ল্যাটফর্ম।',
    full_description_en: 'ElevenLabs delivers state-of-the-art voice generation software with emotional range, contextual intonation, and high-fidelity speech across 30+ languages. Perfect for audiobooks, gaming, video dubbing, and accessibility.',
    full_description_bn: 'ইলেভেনল্যাবস বাস্তব কণ্ঠের মতো অনুভূতি ও উচ্চারণসহ টেক্সটকে ভয়েসে রূপান্তর এবং অডিও ডাবিং করতে সক্ষম।',
    tags: ['voice', 'speech', 'tts', 'cloning', 'dubbing', 'audio'],
    features_en: ['Ultra-realistic voice synthesis', 'Instant and professional voice cloning', 'Automated video dubbing with lip-sync', 'Sound effects generation'],
    features_bn: ['প্রাকৃতিক কণ্ঠস্বর তৈরি', 'ভয়েস ক্লোনিং প্রযুক্তি', 'ভিডিও ডাবিং ও সাউন্ড ইফেক্টস'],
    languages: ['32+ Languages including English and Bengali'],
    featured: true,
    popular: true,
    active: true,
    sponsored: false,
    pricing_type: 'Freemium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tool-deepl',
    name_en: 'DeepL Translate',
    name_bn: 'ডিপএল ট্রান্সলেট',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/DeepL_logo.svg',
    website_url: 'https://deepl.com',
    category_id: 'cat-translation',
    short_description_en: 'Precision neural translation delivering natural, grammatically flawless multilingual results.',
    short_description_bn: 'বিশ্বস্ত ও প্রাকৃতিক ভাষা অনুবাদের অন্যতম সেরা নিউরাল ট্রান্সলেশন প্ল্যাটফর্ম।',
    full_description_en: 'DeepL is recognized as one of the world\'s most accurate neural translation platforms. It captures subtle linguistic nuances, idioms, and industry-specific terminology, delivering translations that read like human writing.',
    full_description_bn: 'ডিপএল ব্যাকরণগত সঠিকতা ও ভাষার মাধুর্য বজায় রেখে দ্রুত ও নির্ভুল অনুবাদ করে থাকে।',
    tags: ['translation', 'language', 'localization', 'grammar', 'neural'],
    features_en: ['Human-grade linguistic accuracy', 'Full document file translation (PDF, DOCX)', 'Glossary customization', 'DeepL Write writing assistant'],
    features_bn: ['মানুষের মতো স্বাভাবিক অনুবাদ', 'সম্পূর্ণ ডকুমেন্ট অনুবাদ সুবিধা', 'কাস্টম গ্লোসারি'],
    languages: ['30+ Global Languages'],
    featured: false,
    popular: true,
    active: true,
    sponsored: false,
    pricing_type: 'Freemium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tool-canva',
    name_en: 'Canva Magic Studio',
    name_bn: 'ক্যানভা ম্যাজিক স্টুডিও',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
    website_url: 'https://canva.com',
    category_id: 'cat-design',
    short_description_en: 'AI-infused graphic design suite featuring automated layout, image generation, and design helpers.',
    short_description_bn: 'সহজেই ব্যানার, সোশ্যাল মিডিয়া পোস্ট এবং প্রেজেন্টেশন ডিজাইনের জন্য জনপ্রিয় AI সুইট।',
    full_description_en: 'Canva Magic Studio embeds artificial intelligence across the entire design lifecycle. Features include Magic Eraser, Magic Switch for reformatting designs across formats, AI copywriting, and instant presentation creation.',
    full_description_bn: 'ক্যানভা ম্যাজিক স্টুডিও দিয়ে এক ক্লিকে ছবির ব্যাকগ্রাউন্ড পরিবর্তন, পোস্টের সাইজ বদলানো এবং সুন্দর ডিজাইন তৈরি সম্ভব।',
    tags: ['design', 'graphics', 'social-media', 'banners', 'templates', 'marketing'],
    features_en: ['Magic Switch format conversion', 'AI background and object removal', 'Text to image generation', 'Brand kit automation'],
    features_bn: ['এক ক্লিকে সাইজ পরিবর্তন', 'সহজে ব্যাকগ্রাউন্ড রিমুভ', 'ডিজাইন টেমপ্লেটস'],
    languages: ['Multilingual', 'English', 'Bengali'],
    featured: false,
    popular: true,
    active: true,
    sponsored: false,
    pricing_type: 'Freemium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tool-gamma',
    name_en: 'Gamma App',
    name_bn: 'গামা অ্যাপ',
    logo_url: 'https://gamma.app/favicon.ico',
    website_url: 'https://gamma.app',
    category_id: 'cat-presentation',
    short_description_en: 'Generate interactive presentations, webpages, and documents with clean modern design in seconds.',
    short_description_bn: 'কয়েক সেকেন্ডের মধ্যে সুন্দর স্লাইড ডেক এবং ইন্টারঅ্যাক্টিভ ওয়েব পেজ তৈরি করার টুল।',
    full_description_en: 'Gamma is a new medium for presenting ideas, powered by AI. Generate beautiful, engaging presentations, documents, and web pages from notes or outlines without spending hours on slide formatting.',
    full_description_bn: 'গামা দিয়ে পয়েন্ট বা ছোট আউটলাইন থেকে স্বয়ংক্রিয়ভাবে প্রফেশনাল প্রেজেন্টেশন এবং স্লাইড ডেক তৈরি করা যায়।',
    tags: ['presentation', 'slides', 'pitch-deck', 'webpages', 'docs', 'visuals'],
    features_en: ['One-click presentation generation', 'Responsive layouts that adapt to any screen', 'Embedded interactive widgets', 'Flexible analytics'],
    features_bn: ['এক ক্লিকে স্লাইড তৈরি', 'যেকোনো ডিভাইসে সুন্দর ডিসপ্লে', 'ইন্টারঅ্যাক্টিভ উপাদান'],
    languages: ['English', 'Multilingual'],
    featured: false,
    popular: true,
    active: true,
    sponsored: false,
    pricing_type: 'Freemium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_SETTINGS: SiteSettings = {
  site_name: 'ALL IN ONE',
  tagline_en: 'Discover the Right AI for Everything',
  tagline_bn: 'সবকিছুর জন্য সঠিক AI খুঁজুন',
  description_en: 'ALL IN ONE is the comprehensive directory helping creators, developers, researchers, and students discover verified artificial intelligence tools in one organized place.',
  description_bn: 'ALL IN ONE এমন একটি নির্ভরযোগ্য AI ডিরেক্টরি যেখানে ক্রিয়েটর, ডেভেলপার, গবেষক এবং শিক্ষার্থীরা সহজেই সব দরকারী AI টুল এক জায়গা থেকে খুঁজে পান।',
  contact_email: 'contact@allinone.ai',
  social_links: {
    twitter: 'https://twitter.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  default_language: 'en',
  footer_text_en: '© ALL IN ONE. All rights reserved. Built with precision for the global AI community.',
  footer_text_bn: '© ALL IN ONE. সর্বস্বত্ব সংরক্ষিত। গ্লোবাল AI কমিউনিটির জন্য নিবেদিত।',
  ad_placeholders_enabled: true,
  privacy_policy_en: 'We respect your privacy. ALL IN ONE does not sell personal information or track individual user browsing habits. Official outbound links redirect directly to external verified providers.',
  privacy_policy_bn: 'আমরা আপনার গোপনীয়তাকে সম্মান করি। ALL IN ONE ব্যক্তিগত তথ্য বিক্রি করে না। প্রদত্ত অফিসিয়াল লিংকগুলো আপনাকে সরাসরি মূল প্রোভাইডারের সাইটে নিয়ে যায়।',
  terms_of_service_en: 'By using ALL IN ONE, you agree to access information responsibly. AI tool listings, trademarks, and logos belong to their respective proprietary owners.',
  terms_of_service_bn: 'ALL IN ONE ব্যবহারের মাধ্যমে আপনি দায়িত্বশীলভাবে তথ্য ব্যবহারের শর্ত মেনে নিচ্ছেন। AI টুল ও লোগো তাদের নিজ নিজ কোম্পানির স্বত্বাধিকারী।',
  disclaimer_en: 'Official URLs provided are for discovery and reference. External service pricing, availability, and policies are managed independently by third-party AI organizations.',
  disclaimer_bn: 'ডিরেক্টরিতে দেওয়া লিংকগুলো তথ্য অনুসন্ধানের জন্য। তৃতীয় পক্ষের সাইটগুলোর মূল্য ও ব্যবহারের শর্ত তাদের নিজস্ব নিয়ম অনুযায়ী পরিচালিত হয়।',
};

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } catch (err) {
        console.error('Failed reading DB file, reinitializing:', err);
        this.data = this.createDefaultSchema();
        this.save();
      }
    } else {
      this.data = this.createDefaultSchema();
      this.save();
    }

    // Ensure initial admin exists
    this.ensureAdminUser();
  }

  private createDefaultSchema(): DatabaseSchema {
    return {
      users: [],
      tools: INITIAL_TOOLS,
      categories: INITIAL_CATEGORIES,
      settings: INITIAL_SETTINGS,
      sessions: [],
    };
  }

  private ensureAdminUser() {
    const defaultEmail = 'admin@allinone.ai';
    const existing = this.data.users.find(u => u.email === defaultEmail || u.role === 'admin');

    if (!existing) {
      const salt = generateSalt();
      const defaultPassword = 'Admin@AllInOne2026!';
      const hash = hashPassword(defaultPassword, salt);

      const adminUser: StoredUser = {
        id: 'usr-admin-' + crypto.randomUUID().slice(0, 8),
        email: defaultEmail,
        password_hash: hash,
        salt,
        role: 'admin',
        name: 'Lead Administrator',
        created_at: new Date().toISOString(),
      };

      this.data.users.push(adminUser);
      this.save();
      console.log(`[Database] Initial admin user initialized: ${defaultEmail}`);
    }
  }

  private save() {
    try {
      const tempPath = DB_FILE + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  // --- Auth & Users ---
  public verifyCredentials(email: string, password: string): User | null {
    const user = this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;

    const hash = hashPassword(password, user.salt);
    if (crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(user.password_hash))) {
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        created_at: user.created_at,
      };
    }
    return null;
  }

  public createSession(userId: string): string {
    // Purge expired sessions
    const now = new Date();
    this.data.sessions = this.data.sessions.filter(s => new Date(s.expiresAt) > now);

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    this.data.sessions.push({
      token,
      userId,
      createdAt: now.toISOString(),
      expiresAt,
    });
    this.save();
    return token;
  }

  public getUserByToken(token: string): User | null {
    if (!token) return null;
    const session = this.data.sessions.find(s => s.token === token);
    if (!session) return null;

    if (new Date(session.expiresAt) <= new Date()) {
      // Expired
      this.data.sessions = this.data.sessions.filter(s => s.token !== token);
      this.save();
      return null;
    }

    const user = this.data.users.find(u => u.id === session.userId);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      created_at: user.created_at,
    };
  }

  public destroySession(token: string) {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.save();
  }

  public updateAdminPassword(userId: string, newPassword: string): boolean {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return false;

    const salt = generateSalt();
    user.salt = salt;
    user.password_hash = hashPassword(newPassword, salt);
    this.save();
    return true;
  }

  // --- AI Tools ---
  public getTools(onlyActive: boolean = true): AiTool[] {
    if (onlyActive) {
      return this.data.tools.filter(t => t.active);
    }
    return [...this.data.tools];
  }

  public getToolById(id: string, onlyActive: boolean = true): AiTool | null {
    const tool = this.data.tools.find(t => t.id === id);
    if (!tool) return null;
    if (onlyActive && !tool.active) return null;
    return tool;
  }

  public addTool(toolData: Omit<AiTool, 'id' | 'created_at' | 'updated_at'>): AiTool {
    const now = new Date().toISOString();
    const newTool: AiTool = {
      ...toolData,
      id: 'tool-' + crypto.randomUUID().slice(0, 8),
      created_at: now,
      updated_at: now,
    };
    this.data.tools.unshift(newTool);
    this.save();
    return newTool;
  }

  public updateTool(id: string, updates: Partial<AiTool>): AiTool | null {
    const index = this.data.tools.findIndex(t => t.id === id);
    if (index === -1) return null;

    const existing = this.data.tools[index];
    const updatedTool: AiTool = {
      ...existing,
      ...updates,
      id: existing.id, // prevent changing id
      updated_at: new Date().toISOString(),
    };

    this.data.tools[index] = updatedTool;
    this.save();
    return updatedTool;
  }

  public deleteTool(id: string): boolean {
    const initialLen = this.data.tools.length;
    this.data.tools = this.data.tools.filter(t => t.id !== id);
    if (this.data.tools.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Categories ---
  public getCategories(onlyActive: boolean = true): Category[] {
    let cats = [...this.data.categories];
    if (onlyActive) {
      cats = cats.filter(c => c.active);
    }
    return cats.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }

  public getCategoryById(id: string): Category | null {
    return this.data.categories.find(c => c.id === id) || null;
  }

  public addCategory(catData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Category {
    const now = new Date().toISOString();
    const maxSort = this.data.categories.reduce((m, c) => Math.max(m, c.sort_order || 0), 0);
    const newCat: Category = {
      ...catData,
      id: 'cat-' + crypto.randomUUID().slice(0, 8),
      sort_order: catData.sort_order ?? (maxSort + 1),
      created_at: now,
      updated_at: now,
    };
    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return null;

    const existing = this.data.categories[index];
    const updated: Category = {
      ...existing,
      ...updates,
      id: existing.id,
      updated_at: new Date().toISOString(),
    };
    this.data.categories[index] = updated;
    this.save();
    return updated;
  }

  public deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Site Settings ---
  public getSettings(): SiteSettings {
    return { ...this.data.settings };
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
    };
    this.save();
    return this.data.settings;
  }

  // --- Admin Stats ---
  public getStats() {
    const total_tools = this.data.tools.length;
    const total_categories = this.data.categories.length;
    const featured_count = this.data.tools.filter(t => t.featured && t.active).length;
    const popular_count = this.data.tools.filter(t => t.popular && t.active).length;
    const active_count = this.data.tools.filter(t => t.active).length;
    const recent_tools = [...this.data.tools]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return {
      total_tools,
      total_categories,
      featured_count,
      popular_count,
      active_count,
      recent_tools,
    };
  }
}

export const db = new DatabaseManager();
