// Publication titles are citations starting with "Author (YYYY)."; the year only lives in the title.
export const publicationYear = (item) => /\((\d{4})/.exec(item?.title || "")?.[1];

// Newest first. Strapi returns publications in id order, and re-publishing an entry gives it a new id,
// so without sorting an edited entry jumps to the end. Same year keeps the Strapi order (stable sort),
// entries without a year go last.
export function sortByYearDesc(publications) {
  return publications.slice().sort((a, b) => (publicationYear(b) ?? 0) - (publicationYear(a) ?? 0));
}
