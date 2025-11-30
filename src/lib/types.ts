
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  skills: string[];
  experience: string;
  desiredJobType: string;
  locationPreferences: string;
  industryPreferences: string[];
  rating: number;
  membership: 'Rise' | 'Bloom' | 'Empower';
  vasaPinkTokens?: number;
  mobileNumber?: string;
  address?: string;
  walletBalance?: number;
};

export type Job = {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl: string;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary?: string;
  description: string;
  skillsRequired: string[];
  industry: string;
  name?: string;
  workerNames?: string[];
  status?: 'Completed' | 'Worker Assigned' | 'Yet To Assign' | 'Paid';
  date?: string;
  time?: string;
  pay?: number;
};

export type LearningModule = {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article';
  duration: string;
  imageUrl: string;
  progress: number;
  language: 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr';
  videoId?: string;
};

export type Team = {
  id: string;
  name: string;
  description: string;
  members: Pick<User, 'id' | 'name' | 'avatarUrl'>[];
};
