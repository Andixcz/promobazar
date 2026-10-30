export function creatorPublicPath(slug: string) {
  return `/tvurce/${encodeURIComponent(slug)}`;
}

export function packagePublicPath(
  creatorSlug: string,
  packageId: string,
  options?: { preview?: boolean },
) {
  const base = `${creatorPublicPath(creatorSlug)}/balicek/${encodeURIComponent(packageId)}`;
  if (options?.preview) {
    return `${base}?preview=1`;
  }
  return base;
}

export function packageOrderPath(creatorSlug: string, packageId: string) {
  return `${creatorPublicPath(creatorSlug)}/balicek/${encodeURIComponent(packageId)}/objednavka`;
}
