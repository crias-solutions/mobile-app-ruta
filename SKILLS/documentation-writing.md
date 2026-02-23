# Documentation Writing Skill

> Guidelines for writing clear, effective documentation following established frameworks.

---

## Core Principles

### 1. Diataxis Framework

Structure documentation by user needs:

| Type | Purpose | Answer | Format |
|------|---------|--------|--------|
| **Tutorial** | Learning-oriented | "How do I get started?" | Step-by-step lessons |
| **How-to Guide** | Task-oriented | "How do I do X?" | Practical steps |
| **Reference** | Information-oriented | "What are the details?" | Technical specs, APIs |
| **Explanation** | Understanding-oriented | "Why is it this way?" | Context and background |

Source: https://diataxis.fr/

---

### 2. KISS Principle

**Keep It Simple, Stupid**

- Write for your audience
- One idea per sentence
- Avoid jargon unless necessary
- Use concrete examples
- Remove unnecessary words

Source: https://en.wikipedia.org/wiki/KISS_principle

---

### 3. Golden Circle (Simon Sinek)

Structure communication from inside-out:

1. **WHY** — The purpose, cause, or belief
2. **HOW** — The process or approach
3. **WHAT** — The product, service, or result

Example for a README:
- Why: "Enable developers to visualize GPS trip data instantly"
- How: "By parsing CSV data and rendering on interactive maps"
- What: "A React web application with filtering and statistics"

Source: https://simonsinek.com/golden-circle/

---

### 4. Rule of Three

Group information in threes for clarity and memorability:

- Three main features
- Three steps to get started
- Three key benefits

Source: https://en.wikipedia.org/wiki/Rule_of_three_(writing)

---

## README Structure Template

```
# Project Name

[Badges with correct brand colors]

## Why (or tagline)
Brief purpose statement

## What (Features)
- Feature 1
- Feature 2
- Feature 3

## How (Getting Started)
### Prerequisites
### Installation
### Run

## Usage (How-to)
Task-focused guides

## Reference
- Commands
- Tech Stack
- Project Structure

## License
```

---

## Badge Color Reference

Use official brand colors for badges:

Example:
| Technology | Color Code | Example |
|------------|------------|---------|
| TypeScript | `#3178C6` | `![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)` |
| React | `#61DAFB` | `![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)` |
| Vite | `#646CFF` | `![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)` |
| Supabase | `#3FCF8E` | `![Supabase](https://img.shields.io/badge/Supabase-2.x-3FCF8E?style=flat-square&logo=supabase&logoColor=white)` |
| Leaflet | `#199900` | `![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white)` |
| Vitest | `#6E9F18` | `![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=flat-square&logo=vitest&logoColor=white)` |
| Python | `#3776AB` | `![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)` |
| Node.js | `#339933` | `![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)` |

---

## Writing Checklist

Before publishing documentation:

- [ ] Start with WHY (purpose)
- [ ] Use Diataxis-appropriate sections
- [ ] Apply Rule of Three where possible
- [ ] Keep sentences simple (KISS)
- [ ] Include working code examples
- [ ] Add badges with correct colors
- [ ] Check all links work
