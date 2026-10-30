import { dashboardPath } from "@/lib/dashboard-routes";

export function dashboardPackagesListPath() {
  return dashboardPath("balicky");
}

export function dashboardPackageNewPath() {
  return `${dashboardPackagesListPath()}/novy`;
}

export function dashboardPackageEditPath(packageId: string) {
  return `${dashboardPackagesListPath()}/${packageId}`;
}

export { packagePublicPath } from "@/lib/marketplace/public-routes";
