export type WorkExperience = {
  company_name: string;
  location: string;
  start_date: string;
  end_date: string;
  position: string;
  client?: string;
  responsibilities: string;
};

export type Education = {
  course_name: string;
  institute: string;
  grad_year: number;
  location: string;
  degree_type: string;
  description: string;
};

export type Project = {
  project_name: string;
  tech_stack: string;
  description: string;
  repo_link: string | null;
  live_link: string | null;
  image_url: string;
};

export type Skill = {
  name: string;
  icon: string;
};

export type PortfolioInfo = {
  work_experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
};
