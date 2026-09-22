/** Volání globálních funkcí z `public/app.js`. */
export type AppGlobal = {
  switchView?: (view: "firms" | "creators") => void;
  scrollToId?: (id: string) => void;
  openAuth?: (role: string, afterCallback?: () => void) => void;
  goToJobBoardBrowse?: () => void;
  toggleUserMenu?: (id: string, event: Event) => void;
  goToMyDashboard?: () => void;
  openAccountSettings?: () => void;
  handleLogout?: () => void;
  closeModal?: () => void;
  cookieChoice?: (choice: string) => void;
  openCookieSettings?: () => void;
  toggleChatWidget?: () => void;
  openConcierge?: () => void;
  resetMarketplaceFilters?: () => void;
  switchJobTab?: (tab: "browse" | "brand") => void;
  goToBrandDashboard?: () => void;
  submitNewJob?: (event: Event) => void;
  handleCheckout?: (plan: string) => void;
  openOrderIntent?: (plan: string) => void;
  goToCreatorDashboard?: () => void;
  generateRealProfile?: () => void;
  addStagingPackage?: () => void;
  submitUpload?: () => void;
  submitPackageForm?: (event: Event) => void;
  cancelPackageEdit?: () => void;
  submitContact?: (event: Event) => void;
};

export function invokeAppGlobal<Name extends keyof AppGlobal>(
  name: Name,
  ...args: Parameters<NonNullable<AppGlobal[Name]>>
): void {
  const fn = (window as unknown as AppGlobal)[name];
  if (typeof fn === "function") {
    (fn as (...params: unknown[]) => void)(...args);
  }
}

/** Volání handlerů z app.js, které ještě nemají typ v AppGlobal. */
export function callAppHandler(name: keyof AppGlobal, ...args: unknown[]): void {
  invokeAppGlobal(name, ...(args as Parameters<NonNullable<AppGlobal[typeof name]>>));
}
