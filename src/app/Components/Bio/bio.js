"use client";
import React from "react";
import styles from "./bio.module.css";

const picture = {
  purple: {src: "/assets/images/pictures/purple.jpg"},
  light: {src: "/assets/images/pictures/light_pic.jpg"},
  dark: {src: "/assets/images/pictures/dark_pic.jpg"},
  red: {src: "/assets/images/pictures/dark_pic.jpg"},
};


export default function Bio({ theme, windowWidth }) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.bio_container}>
          <h1 className={styles.playfair_display_header}>👋 About Me!</h1>
          <span className={styles.bio_span}>
            <section className={styles.playfair_display}>
              <p>
                Hey there! I&apos;m a Senior Software Engineer
                <strong> Based in Chennai | Originally from Kolkata</strong>
              </p>

              <p>
                I&apos;m a passionate <strong>Senior Software Engineer</strong>{" "}
                with a strong focus on building
                <strong>elegant</strong>, <strong>performant</strong>, and{" "}
                <strong>scalable</strong> web applications. With over{" "}
                <strong>three years of hands-on experience</strong>, I&apos;ve
                had the privilege of collaborating with world-class teams at{" "}
                <strong>NexSemi Systems</strong>, <strong>Logitech</strong>,
                <strong>Atonarp</strong>, <strong>Charger Logistics</strong>,
                and <strong>ShipHaul Logistics</strong>.
              </p>

              <p>
                My journey spans across frontend and full-stack development.
                From designing responsive UI components in{" "}
                <strong>React</strong>, <strong>Next.js</strong>, and{" "}
                <strong>Angular</strong>, to writing backend logic in{" "}
                <strong>Node.js</strong> and <strong>Python</strong>, I love
                building experiences that work and delight users.
              </p>

              <p>
                I write <strong>modular, reusable components</strong> and follow
                best practices to deliver scalable code. I&apos;m deeply
                invested in <strong>JavaScript fundamentals</strong> and bring
                that knowledge to tasks like optimizing large uploads, managing
                state, or animating UIs with <strong>Flexbox</strong>,
                <strong>CSS Grid</strong>, and <strong>SCSS</strong>. I focus on{" "}
                <strong>performance</strong>, <strong>accessibility</strong>,
                and a solid
                <strong>UI/UX foundation</strong>. I work well in Agile/Scrum
                teams, write tests, and use tools like Git, Docker, and gRPC in
                my day-to-day development.
              </p>

              <h2 className={styles.playfair_display_header_2}>⚽ Outside the Code</h2>
              <p>
                When I&apos;m not coding, you&apos;ll find me on the football
                field, catching up on matches (huge Manchester United and KKR
                fan!), exploring new places, or lost in a good book.
              </p>

              <h2 className={styles.playfair_display_header_2}>🚀 Let&apos;s Collaborate</h2>
              <p>
                I love turning ideas into intuitive, functional software.
                Whether you&apos;re building something new or refining a
                product, I bring <strong>technical depth</strong>,{" "}
                <strong>user empathy</strong>, and a
                <strong>relentless attention to detail</strong>.
              </p>
            </section>
          </span>
        </div>
      </div>
    </div>
  );
}
