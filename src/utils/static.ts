export const staticUrl = (img: string) => {
  return new URL(`../static/imgs/${img}`, import.meta.url).href
}