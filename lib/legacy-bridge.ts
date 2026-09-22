/** Volání globálních funkcí z `public/legacy-app.js` během postupné migrace do Reactu. */
export type LegacyGlobal = {
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

export function legacyInvoke<Name extends keyof LegacyGlobal>(
  name: Name,
  ...args: Parameters<NonNullable<LegacyGlobal[Name]>>
): void {
  const fn = (window as unknown as LegacyGlobal)[name];
  if (typeof fn === "function") {
    (fn as (...params: unknown[]) => void)(...args);
  }
}
