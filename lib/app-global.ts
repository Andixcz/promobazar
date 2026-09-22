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
