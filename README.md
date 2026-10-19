# Abdulrahman Saleh Maashi — Personal Portfolio
Live site: https://AbdulrahmanSal.github.io/202356070-abdulrahmanmaashi-assignment2
## Project Description

This project extends my Assignment 1 portfolio for Assignment 2: Interactive Features. It keeps the same About, Projects, Skills, and Contact sections and adds real interactivity on top: a project filter, a live API-backed widget, scroll animations, and clearer feedback throughout. The goal was to practice dynamic, JavaScript-driven behavior rather than a static page.

## Features

**Carried over from Assignment 1**
- About Me section with a short personal introduction
- Projects section featuring the Hotel Reservation System, House Price Prediction Model, and Digital Queue Management System
- Contact form with name, email, and message fields, validated in the browser
- Dark and light theme toggle, remembered between visits
- Greeting message that changes with the time of day
- Click-to-enlarge lightbox for project screenshots
- Responsive layout for desktop, tablet, and mobile screens
- Accessible labels, alternative image text, and semantic HTML elements

**New in Assignment 2**
- **Project filter** — buttons above the Projects grid (All / Java / Python / Verilog) show only the matching cards, with a fade transition and an empty-state message if nothing matches
- **Dev-advice widget** — fetches a random tip from a public API (adviceslip.com) on load and on demand, with a loading state, a friendly error message, and a `localStorage` fallback if the request fails
- **Scroll-reveal animation** — About, Skills, and Contact fade and slide into view the first time they enter the viewport
- **Hover lift on project cards** — a subtle shadow and lift on hover
- All animations respect `prefers-reduced-motion`, and a `<noscript>` fallback keeps content visible if JavaScript is blocked

## Technologies Used

- HTML5 for the page structure and content
- CSS3, Grid, and Flexbox for styling, responsive layout, and transitions
- JavaScript for the theme toggle, greeting, nav highlighting, form validation, project filter, API fetch, and scroll-reveal animation
- The `fetch` API and `localStorage` for live data and client-side persistence
- Git and GitHub for version control and project hosting
- Claude (Anthropic) for development assistance, troubleshooting, and documentation support

## Project Structure

```text
assignment-2/
├── index.html
├── README.md
├── .gitignore
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/
│       ├── profile.jpg
│       ├── favicon.svg
│       ├── project-1.png
│       ├── project-2.png
│       └── project-3.png
└── docs/
    ├── ai-usage-report.md
    └── technical-documentation.md
```

## Running the Website Locally

1. Download or clone the repository.
2. Open the project folder.
3. Open `index.html` in a web browser.

No installation, package manager, or backend server is required. The dev-advice widget does call an external API (`api.adviceslip.com`), so an internet connection is needed for that one feature — everything else works fully offline.

## AI Usage Summary

Claude was used to help design and build the three new interactive features (the project filter, the API-backed advice widget, and the scroll-reveal animation), explain specific implementation choices like the `Promise.race` timeout and the fade-before-hide sequencing, and update the documentation. I tested each feature, decided on the filter categories and the API used, and reviewed the code before accepting it. Full details are available in [`docs/ai-usage-report.md`](docs/ai-usage-report.md).

## Author

Abdulrahman Saleh Maashi — ID 202356070, Section 2
