"use client";

import info from "../../../info.json";
import { useState } from "react";
import "./resume.css";
import type {
    Education,
    PortfolioInfo,
    Project,
    Skill,
    WorkExperience,
} from "../../types/portfolio";

const GITHUB_URL = "https://github.com/Sbasu2512";
const HUGGINGFACE_URL = "https://huggingface.co/sbasu2512";

const resumeData = info as PortfolioInfo;

export default function ResumePage() {
    const [pdfLoading, setPdfLoading] = useState(false);

    async function downloadPDF() {
        const resume = document.getElementById("resume");

        if (!resume) {
            return;
        }

        setPdfLoading(true);

        try {
            const html2pdf = (await import("html2pdf.js")).default;

            // Show sensitive information in the PDF
            resume.classList.add("pdf-mode");

            const options = {
                margin: 0,
                filename: "Sayantan_Basu_Resume.pdf",

                image: {
                    type: "jpeg",
                    quality: 0.98,
                },

                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                },

                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait",
                },

                pagebreak: {
                    mode: ["css", "legacy"],
                },
            };

            await html2pdf()
                .set(options)
                .from(resume)
                .save();

            resume.classList.remove("pdf-mode");

        } catch (error) {
            console.error("PDF generation failed:", error);

            // Browser print dialog is a useful fallback.
            window.print();
        } finally {
            setPdfLoading(false);
        }
    }

    return (
        <>
            <div className="resume-toolbar">
                <div className="toolbar-inner">
                    <a href="/" className="back-link">
                        <span className="back-icon" aria-hidden="true" />
                        <span>Portfolio</span>
                    </a>

                    <button
                        type="button"
                        className="download-button"
                        onClick={downloadPDF}
                        disabled={pdfLoading}
                    >
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
                        <Sidebar data={resumeData} />
                    </aside>

                    <section className="main-content">
                        <ResumeHeader />

                        <ExperienceSection
                            experiences={resumeData.work_experience}
                        />

                        <ProjectsSection
                            projects={resumeData.projects}
                        />

                        <EducationSection
                            education={resumeData.education}
                        />
                    </section>
                </article>
            </main>
        </>
    );
}

/* -------------------------------------------------------------------------- */
/* Sidebar                                                                     */
/* -------------------------------------------------------------------------- */

function Sidebar({
    data,
}: {
    data: PortfolioInfo;
}) {
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
                    <span
                        className="contact-icon phone-icon"
                        aria-hidden="true"
                    />

                    {/* Visible on website */}
                    <span className="phone-screen">
                        +91 ••••• •••••
                    </span>

                    {/* Used only for PDF */}
                    <span className="phone-pdf">
                        +91 8100252061
                    </span>
                </span>

                <span className="contact-item location">
                    <span
                        className="contact-icon location-icon"
                        aria-hidden="true"
                    />
                    <span>Chennai, Tamil Nadu, India</span>
                </span>

                <a
                    href="mailto:sayantanworks@gmail.com"
                    className="contact-item"
                >
                    <span
                        className="contact-icon email-icon"
                        aria-hidden="true"
                    />
                    <span>sayantanworks@gmail.com</span>
                </a>

                <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-item"
                >
                    <span
                        className="contact-icon github-icon"
                        aria-hidden="true"
                    />
                    <span>github.com/Sbasu2512</span>
                </a>

                <a
                    href={HUGGINGFACE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-item"
                >
                    <span
                        className="contact-icon huggingface-icon"
                        aria-hidden="true"
                    />
                    <span>huggingface.co/sbasu2512</span>
                </a>

                <span className="contact-item location">
                    <span
                        className="contact-icon location-icon"
                        aria-hidden="true"
                    />
                    <span>Chennai, Tamil Nadu, India</span>
                </span>
            </SidebarSection>

            <SidebarSection title="Technical Skills">
                <div className="skill-list">
                    {data.skills.map((skill: Skill) => (
                        <div
                            className="skill-item"
                            key={skill.name}
                        >
                            <span className="skill-dot" />
                            <span>{skill.name}</span>
                        </div>
                    ))}
                </div>
            </SidebarSection>

            <SidebarSection title="Core Focus">
                <div className="focus-list">
                    <FocusItem
                        title="Frontend"
                        text="React · Next.js · TypeScript"
                    />

                    <FocusItem
                        title="Backend"
                        text="Node.js · Python · REST · gRPC"
                    />

                    <FocusItem
                        title="AI / ML"
                        text="XGBoost · Transformers · FinBERT"
                    />

                    <FocusItem
                        title="Cloud"
                        text="AWS · GCP · Docker"
                    />

                    <FocusItem
                        title="Testing"
                        text="Cypress · Selenium · Jest"
                    />
                </div>
            </SidebarSection>

            <SidebarSection title="Links">
                <a
                    className="sidebar-link"
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                >
                    GitHub ↗
                </a>

                <a
                    className="sidebar-link"
                    href={HUGGINGFACE_URL}
                    target="_blank"
                    rel="noreferrer"
                >
                    Hugging Face ↗
                </a>
            </SidebarSection>

            <div className="sidebar-footer">
                <span>FULL-STACK</span>
                <span>AI / ML</span>
                <span>SOFTWARE ENGINEERING</span>
            </div>
        </div>
    );
}

function SidebarSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="sidebar-section">
            <h3>{title}</h3>

            <div className="sidebar-section-content">
                {children}
            </div>
        </section>
    );
}

function FocusItem({
    title,
    text,
}: {
    title: string;
    text: string;
}) {
    return (
        <div className="focus-item">
            <strong>{title}</strong>

            <span>{text}</span>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                      */
/* -------------------------------------------------------------------------- */

function ResumeHeader() {
    return (
        <header className="resume-header">
            <div className="eyebrow">
                SOFTWARE ENGINEER · AI / ML
            </div>

            <h1>
                Sayantan
                <br />
                <strong>Basu</strong>
            </h1>

            <p className="headline">
                Senior Software Engineer with 5+ years of professional software engineering experience specializing in frontend and full-stack development with React, TypeScript, JavaScript, Next.js, Angular, Python, REST APIs, and gRPC.

                Experienced in developing production-grade applications, reusable UI systems, backend services, dashboards, automation, testing frameworks, and API integrations within Agile/Scrum environments.

                Hands-on AI/ML engineering experience building and deploying predictive and NLP applications using XGBoost, PyTorch, Hugging Face Transformers, FinBERT, ONNX Runtime, Optimum, Python, and FastAPI. Experienced in taking machine-learning projects from model development through inference, API integration, and deployment.

                Strong foundation in software architecture, testing, performance optimization, version control, CI/CD, and full software development lifecycle ownership.
            </p>
        </header>
    );
}

/* -------------------------------------------------------------------------- */
/* Experience                                                                  */
/* -------------------------------------------------------------------------- */

function ExperienceSection({
    experiences,
}: {
    experiences: WorkExperience[];
}) {
    const technicalExperiences = experiences.filter(
        isTechnicalExperience
    );

    return (
        <ResumeSection
            title="Professional Experience"
        // number="01"
        >
            <div className="timeline">
                {technicalExperiences.map(
                    (experience, index) => (
                        <div
                            className="timeline-item"
                            key={`${experience.company_name}-${experience.start_date}-${index}`}
                        >
                            <div className="timeline-marker">
                                <span />
                            </div>

                            <div className="timeline-content">
                                <div className="timeline-meta">
                                    <span>
                                        {experience.start_date} —{" "}
                                        {experience.end_date}
                                    </span>

                                    <span>
                                        {experience.location}
                                    </span>
                                </div>

                                <h3>{experience.position}</h3>

                                <div className="company-line">
                                    <strong>
                                        {experience.company_name}
                                    </strong>

                                    {experience.client && (
                                        <>
                                            <span className="separator">
                                                ·
                                            </span>

                                            <span>
                                                Client: {experience.client}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <div className="responsibilities">
                                    {formatResponsibilities(
                                        experience.responsibilities
                                    ).map(
                                        (paragraph, paragraphIndex) => (
                                            <p key={paragraphIndex}>
                                                {paragraph}
                                            </p>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </ResumeSection>
    );
}

function isTechnicalExperience(
    experience: WorkExperience
) {
    const technicalKeywords = [
        "software",
        "developer",
        "engineer",
        "testing",
        "tester",
        "web",
        "front end",
        "frontend",
        "full stack",
        "full-stack",
        "backend",
        "back end",
    ];

    const text = `
    ${experience.position}
    ${experience.responsibilities}
  `.toLowerCase();

    return technicalKeywords.some((keyword) =>
        text.includes(keyword)
    );
}

function formatResponsibilities(
    responsibilities: string
) {
    return responsibilities
        .split(/\n+/)
        .map((item) => item.trim())
        .filter(Boolean);
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

function ProjectsSection({
    projects,
}: {
    projects: Project[];
}) {
    const aiProjects = projects.filter(
        isAIProject
    );

    const otherProjects = projects.filter(
        (project) => !isAIProject(project)
    );

    return (
        <ResumeSection
            title="Selected Projects"
        // number="02"
        >
            <div className="projects">
                {aiProjects.map((project) => (
                    <ProjectCard
                        key={project.project_name}
                        project={project}
                        featured
                    />
                ))}

                {otherProjects
                    .slice(0, 3)
                    .map((project) => (
                        <ProjectCard
                            key={project.project_name}
                            project={project}
                        />
                    ))}
            </div>
        </ResumeSection>
    );
}

function isAIProject(project: Project) {
    const text = `
    ${project.project_name}
    ${project.tech_stack}
    ${project.description}
  `.toLowerCase();

    const aiKeywords = [
        "prediction",
        "machine learning",
        "machine-learning",
        "model",
        "sentiment",
        "xgboost",
        "transformer",
        "transformers",
        "finbert",
        "artificial intelligence",
        "ai",
        "ml",
    ];

    return aiKeywords.some((keyword) =>
        text.includes(keyword)
    );
}

function ProjectCard({
    project,
    featured = false,
}: {
    project: Project;
    featured?: boolean;
}) {
    const technologies = project.tech_stack
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean);

    return (
        <article
            className={`project-card ${featured ? "featured" : ""
                }`}
        >
            <div className="project-header">
                <div>
                    {featured && (
                        <span className="project-badge">
                            AI / ML
                        </span>
                    )}

                    <h3>{project.project_name}</h3>
                </div>

                <div className="project-links">
                    {project.repo_link && (
                        <a
                            href={project.repo_link}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Repository for ${project.project_name}`}
                        >
                            Repository ↗
                        </a>
                    )}

                    {project.live_link && (
                        <a
                            href={project.live_link}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Live project for ${project.project_name}`}
                        >
                            Live ↗
                        </a>
                    )}
                </div>
            </div>

            <p>{project.description}</p>

            <div className="tech-stack">
                {technologies.map((technology) => (
                    <span key={technology}>
                        {technology}
                    </span>
                ))}
            </div>
        </article>
    );
}

/* -------------------------------------------------------------------------- */
/* Education                                                                   */
/* -------------------------------------------------------------------------- */

function EducationSection({
    education,
}: {
    education: Education[];
}) {
    return (
        <ResumeSection
            title="Education"
        // number="03"
        >
            <div className="education-list">
                {education.map((item: Education) => (
                    <article
                        className="education-item"
                        key={`${item.institute}-${item.grad_year}-${item.course_name}`}
                    >
                        <div className="education-year">
                            {item.grad_year}
                        </div>

                        <div>
                            <h3>{item.course_name}</h3>

                            <div className="education-meta">
                                {item.degree_type} ·{" "}
                                {item.institute} ·{" "}
                                {item.location}
                            </div>

                            <p>{item.description}</p>
                        </div>
                    </article>
                ))}
            </div>
        </ResumeSection>
    );
}

/* -------------------------------------------------------------------------- */
/* Generic section                                                             */
/* -------------------------------------------------------------------------- */

function ResumeSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
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