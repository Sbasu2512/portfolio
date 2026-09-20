export interface NavLink {
  id: string;
  label: string;
  path: string | null;
  icon?: string;
  kind: "icon" | "link" | "brand";
}

export interface WorkExperience {
  company_name: string;
  location: string;
  start_date: string;
  end_date: string;
  position: string;
  client: string | null;
  responsibilities: string;
}

export interface Education {
  course_name: string;
  institute: string;
  grad_year: number;
  location: string;
  degree_type: string;
  description: string;
}

export interface Project {
  project_name: string;
  tech_stack: string;
  description: string;
  repo_link: string | null;
  repo_type: string;
  live_link: string | null;
  image_url: string | null;
}

export interface Skill {
  name: string;
  icon: string;
}

export interface Personal {
  name: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  resume: string;
  about_me: string;
  phone_number: string;
  email: string;
  typewritter_words: string[];
}

export interface LoaderStage {
  title: string;
  sub: string;
  progress: boolean;
}

export interface Locale {
  default_phone: string;
  na_phone: string;
  india_remote_note: string;
}

export interface PortfolioInfo {
  personal: Personal;
  work_experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  nav: NavLink[];
  loader: { stages: LoaderStage[] };
  locale: Locale;
}
