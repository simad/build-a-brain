import { defineConfig } from "vite";

// ponytail: base "./" makes asset URLs relative, so the build works both at a
// project page (simad.github.io/build-a-brain/) and at a custom-domain root.
export default defineConfig({
  base: "./",
});
