import { readable, writable, get } from "svelte/store";

export const webDevItems = readable([
  {
    icon: "fa-brands fa-html5",
    text: "HTML",
    level: 5,
  },
  {
    icon: "fa-brands fa-css3-alt",
    text: "CSS",
    level: 4,
  },
  {
    icon: "fa-brands fa-js-square",
    text: "JavaScript",
    level: 5,
  },
  {
    icon: "fa-brands fa-node-js",
    text: "Node.js",
    level: 5,
  },
  {
    icon: "fa-brands fa-react",
    text: "React",
    level: 4,
  },
  {
    icon: "fa-brands fa-vuejs",
    text: "Vue",
    level: 5,
  },
]);

export const databaseItems = readable([
  {
    icon: "fa-solid fa-leaf",
    text: "MongoDB",
    level: 5,
  },
  {
    icon: "fa-solid fa-database",
    text: "SQL",
    level: 3,
  },
]);

export const programmingLanguagesItems = readable([
  {
    icon: "fa-solid fa-hashtag",
    text: "C#",
    level: 4,
  },
  {
    icon: "fa-brands fa-java",
    text: "Java",
    level: 4,
  },
  {
    icon: "fa-brands fa-rust",
    text: "Rust",
    level: 3,
  },
]);

export const socialMediaLinks = readable([
  {
    link: "https://www.github.com/uranshishko",
    desc: "visit github profile",
    icon: "fa-brands fa-github-alt",
  },
  {
    link: "https://www.linkedin.com/in/uranshishko-963299175",
    desc: "visit linkedin profile",
    icon: "fa-brands fa-linkedin-in",
  },
  {
    link: "https://stackoverflow.com/users/14360602/uranshishko",
    desc: "visit stack overflow profile",
    icon: "fa-brands fa-stack-overflow",
  },
  {
    link: "mailto:uraneshishko@gmail.com",
    desc: "send mail",
    icon: "fa-solid fa-at",
  },
]);

export const projects = writable([]);

export const populateProjects = async () => {
  const projs = get(projects);

  if (projs.length > 0) return projs;

  const { set } = projects;

  try {
    let repos = await fetch("https://api.github.com/users/uranshishko/repos");
    repos = await repos.json();

    repos = repos.map(({ name, description, html_url }) => {
      return {
        name,
        description,
        html_url,
      };
    });

    set(repos);

    return repos;
  } catch (e) {}
};
