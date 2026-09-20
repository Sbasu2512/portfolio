import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import type { Education, Project, Skill, WorkExperience } from "@/types/portfolio";
import "./resume.scss";

const GITHUB_URL_FALLBACK = "https://github.com/Sbasu2512";
const HUGGINGFACE_URL = "https://huggingface.co/sbasu2512";

function maskPhone(phone: string): string {
  // Keep the country code and dashes visible, hide the digits on screen.
  return phone.replace(/\d/g, (d, i, full) => (i < full.indexOf("-") + 1 ? d : "•"));
}

export default function ResumePage() {
  const { info, phoneNumber, workExperience } = useData();
  const [pdfLoading, setPdfLoading] = useState(false);

  async function downloadPDF() {
    const resume = document.getElementById("resume");
    if (!resume) return;
    setPdfLoading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      resume.classList.add("pdf-mode");
      await html2pdf()
        .set({
          margin: 0,
          filename: `${info.personal.name.replace(/\s+/g, "_")}_Resume.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] },
        })
        .from(resume)
        .save();
      resume.classList.remove("pdf-mode");
    } catch (error) {
      console.error("PDF generation failed:", error);
      window.print();
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <>
      <div className="resume-toolbar">
        <div className="toolbar-inner">
          <Link to="/" className="back-link">
            <span className="back-icon" aria-hidden="true" />
            <span>Portfolio</span>
          </Link>
          <button type="button" className="download-button" onClick={downloadPDF} disabled={pdfLoading}>
            {pdfLoading ? (
              <>
                <span className="button-spinner" />
                Generating PDF...
              </>
            ) : (
              <>
                <span>↓</span>
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      <main className="resume-page">
        <article id="resume" className="resume">
          <aside className="sidebar">
            <SidebarContent
              phoneScreen={maskPhone(phoneNumber)}
              phonePdf={phoneNumber}
              email={info.personal.email}
              location={`${info.personal.location}, India`}
              skills={info.skills}
              githubUrl={info.personal.github_url || GITHUB_URL_FALLBACK}
            />
          </aside>

          <section className="main-content">
            <ResumeHeader name={info.personal.name} roles={info.personal.typewritter_words} />
            <ExperienceSection experiences={workExperience} />
            <ProjectsSection projects={info.projects} />
            <EducationSection education={info.education} />
          </section>
        </article>
      </main>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function SidebarContent({
  phoneScreen, phonePdf, email, location, skills, githubUrl,
}: { phoneScreen: string; phonePdf: string; email: string; location: string; skills: Skill[]; githubUrl: string }) {
  return (
    <div className="sidebar-inner">
      <div className="sidebar-top">
        <div className="initials">SB</div>
        <div>
          <div className="sidebar-label">PROFILE</div>
          <h2>Software Engineer</h2>
        </div>
      </div>

      <SidebarSection title="Contact">
        <span className="contact-item phone">
          <span className="contact-icon phone-icon" aria-hidden="true" />
          <span className="phone-screen">{phoneScreen}</span>
          <span className="phone-pdf">{phonePdf}</span>
        </span>
        <a href={`mailto:${email}`} className="contact-item">
          <span className="contact-icon email-icon" aria-hidden="true" />
          <span>{email}</span>
        </a>
        <span className="contact-item location">
          <span className="contact-icon location-icon" aria-hidden="true" />
          <span>{location}</span>
        </span>
      </SidebarSection>

      <SidebarSection title="Technical Skills">
        <div className="skill-list">
          {skills.map((skill) => (
            <div className="skill-item" key={skill.name}>
              <span className="skill-dot" />
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </SidebarSection>

      <SidebarSection title="Core Focus">
        <div className="focus-list">
          <FocusItem title="Frontend" text="React · Next.js · TypeScript" />
          <FocusItem title="Backend" text="Node.js · Python · REST · gRPC" />
          <FocusItem title="AI / ML" text="XGBoost · Transformers · FinBERT" />
          <FocusItem title="Cloud" text="AWS · GCP · Docker" />
          <FocusItem title="Testing" text="Cypress · Selenium · Jest" />
        </div>
      </SidebarSection>

      <SidebarSection title="Links">
        <a className="sidebar-link" href={githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>
        <a className="sidebar-link" href={HUGGINGFACE_URL} target="_blank" rel="noreferrer">Hugging Face ↗</a>
      </SidebarSection>

      <div className="sidebar-footer">
        <span>FULL-STACK</span>
        <span>AI / ML</span>
        <span>SOFTWARE ENGINEERING</span>
      </div>
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="sidebar-section">
      <h3>{title}</h3>
      <div className="sidebar-section-content">{children}</div>
    </section>
  );
}

function FocusItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="focus-item">
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ResumeHeader({ name, roles }: { name: string; roles: string[] }) {
  const [first, ...rest] = name.split(" ");
  return (
    <header className="resume-header">
      <div className="eyebrow">{roles.slice(0, 2).join(" · ").toUpperCase()}</div>
      <h1>
        {first}
        <br />
        <strong>{rest.join(" ")}</strong>
      </h1>
      <p className="headline">
        Senior Software Engineer with hands-on experience across frontend and full-stack development using React,
        TypeScript, JavaScript, Next.js, Angular, Python, REST APIs, and gRPC.
        Experienced in building production-grade applications, reusable UI systems, backend services, dashboards,
        automation, testing frameworks, and API integrations within Agile/Scrum environments.
        Also builds and deploys predictive and NLP applications using XGBoost, PyTorch, Hugging Face Transformers,
        FinBERT, ONNX Runtime, Optimum, and FastAPI — from model development through inference and deployment.
      </p>
    </header>
  );
}

/* -------------------------------------------------------------------------- */

function ExperienceSection({ experiences }: { experiences: WorkExperience[] }) {
  const technical = experiences.filter(isTechnicalExperience);
  return (
    <ResumeSection title="Professional Experience">
      <div className="timeline">
        {technical.map((experience, index) => (
          <div className="timeline-item" key={`${experience.company_name}-${experience.start_date}-${index}`}>
            <div className="timeline-marker"><span /></div>
            <div className="timeline-content">
              <div className="timeline-meta">
                <span>{experience.start_date} — {experience.end_date}</span>
                <span>{experience.location}</span>
              </div>
              <h3>{experience.position}</h3>
              <div className="company-line">
                <strong>{experience.company_name}</strong>
                {experience.client && (
                  <>
                    <span className="separator">·</span>
                    <span>Client: {experience.client}</span>
                  </>
                )}
              </div>
              <div className="responsibilities">
                {formatResponsibilities(experience.responsibilities).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
}

function isTechnicalExperience(experience: WorkExperience) {
  const keywords = ["software", "developer", "engineer", "testing", "tester", "web", "front end", "frontend", "full stack", "full-stack", "backend", "back end"];
  const text = `${experience.position} ${experience.responsibilities}`.toLowerCase();
  return keywords.some((k) => text.includes(k));
}

function formatResponsibilities(responsibilities: string) {
  return responsibilities.split(/\n+/).map((s) => s.trim()).filter(Boolean);
}

/* -------------------------------------------------------------------------- */

function ProjectsSection({ projects }: { projects: Project[] }) {
  const ai = projects.filter(isAIProject);
  const other = projects.filter((p) => !isAIProject(p));
  return (
    <ResumeSection title="Selected Projects">
      <div className="projects">
        {ai.map((project) => (
          <ProjectCard key={project.project_name} project={project} featured />
        ))}
        {other.slice(0, 3).map((project) => (
          <ProjectCard key={project.project_name} project={project} />
        ))}
      </div>
    </ResumeSection>
  );
}

function isAIProject(project: Project) {
  const text = `${project.project_name} ${project.tech_stack} ${project.description}`.toLowerCase();
  const keywords = ["prediction", "machine learning", "machine-learning", "model", "sentiment", "xgboost", "transformer", "transformers", "finbert", "artificial intelligence", " ai", " ml"];
  return keywords.some((k) => text.includes(k));
}

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const technologies = project.tech_stack.split(",").map((t) => t.trim()).filter(Boolean);
  return (
    <article className={`project-card ${featured ? "featured" : ""}`}>
      <div className="project-header">
        <div>
          {featured && <span className="project-badge">AI / ML</span>}
          <h3>{project.project_name}</h3>
        </div>
        <div className="project-links">
          {project.repo_link && (
            <a href={project.repo_link} target="_blank" rel="noreferrer" aria-label={`Repository for ${project.project_name}`}>Repository ↗</a>
          )}
          {project.live_link && (
            <a href={project.live_link} target="_blank" rel="noreferrer" aria-label={`Live project for ${project.project_name}`}>Live ↗</a>
          )}
        </div>
      </div>
      <p>{project.description}</p>
      <div className="tech-stack">
        {technologies.map((t) => <span key={t}>{t}</span>)}
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */

function EducationSection({ education }: { education: Education[] }) {
  return (
    <ResumeSection title="Education">
      <div className="education-list">
        {education.map((item) => (
          <article className="education-item" key={`${item.institute}-${item.grad_year}-${item.course_name}`}>
            <div className="education-year">{item.grad_year}</div>
            <div>
              <h3>{item.course_name}</h3>
              <div className="education-meta">{item.degree_type} · {item.institute} · {item.location}</div>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </ResumeSection>
  );
}

/* -------------------------------------------------------------------------- */

function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="resume-section">
      <div className="section-heading">
        <h2>{title}</h2>
        <div className="heading-line" />
      </div>
      {children}
    </section>
  );
}
