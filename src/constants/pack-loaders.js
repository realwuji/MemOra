/*
  How to fetch each subject's full pack. The import() is what makes every
  subject its own chunk in the build, downloaded only when that subject is
  studied (see packs.js). Add a subject here when you add one to library.js:
  scripts/generate-pack-manifest.mjs fails the build if one is missing.
*/
export const PACK_LOADERS = {
  maths: () => import('./pack-maths'),
  economics: () => import('./pack-economics'),
  'computer-science': () => import('./pack-computer-science'),
}
