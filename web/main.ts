/**
 * The zero-server browser demo. Vite builds this to static assets; nothing runs
 * in production. It imports the SAME Astro as the CLI and Human OS — one creature,
 * one source of truth.
 */

import "./style.css";
import { initTheme } from "./theme.ts";
import { mountShell } from "./shell.ts";

initTheme();

const app = document.getElementById("app");
if (app) mountShell(app);
