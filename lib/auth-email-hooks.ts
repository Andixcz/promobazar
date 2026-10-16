import "server-only";

import {
  sendChangeEmailConfirmMessage,
  sendChangeEmailVerifyMessage,
  sendDeleteAccountEmailMessage,
  sendForgotPasswordEmailMessage,
  sendPasswordChangedEmailMessage,
  sendVerificationEmailMessage,
  sendWelcomeEmailMessage,
} from "@/lib/email/auth-emails";
import { isResendConfigured } from "@/lib/email/resend";
import { readVerificationTokenMeta } from "@/lib/email/verification-token";

type AuthUser = { email: string; name: string };

export const authEmailVerification = {
  sendOnSignUp: true,
  async sendVerificationEmail({
    user,
    url,
    token,
  }: {
    user: AuthUser;
    url: string;
    token: string;
  }) {
    if (!isResendConfigured()) return;

    const meta = await readVerificationTokenMeta(token);
    if (meta?.updateTo) {
      await sendChangeEmailVerifyMessage(user, meta.updateTo, url);
      return;
    }
    await sendVerificationEmailMessage(user, url);
  },
  async afterEmailVerification(user: AuthUser, request?: Request) {
    if (!isResendConfigured() || !request) return;

    const token = new URL(request.url).searchParams.get("token");
    const meta = token ? await readVerificationTokenMeta(token) : null;
    if (meta?.updateTo || meta?.requestType?.includes("change-email")) {
      return;
    }
    await sendWelcomeEmailMessage(user);
  },
};

export const authUserEmailOptions = {
  changeEmail: {
    enabled: true,
    async sendChangeEmailConfirmation({
      user,
      newEmail,
      url,
    }: {
      user: AuthUser;
      newEmail: string;
      url: string;
      token: string;
    }) {
      if (!isResendConfigured()) return;
      await sendChangeEmailConfirmMessage(user, newEmail, url);
    },
  },
  deleteUser: {
    enabled: true,
    async sendDeleteAccountVerification({
      user,
      url,
    }: {
      user: AuthUser;
      url: string;
      token: string;
    }) {
      if (!isResendConfigured()) {
        throw new Error("Odesílání e-mailů není nakonfigurované.");
      }
      const result = await sendDeleteAccountEmailMessage(user, url);
      if (!result.ok) {
        throw new Error("E-mail pro smazání účtu se neodeslal.");
      }
    },
  },
};

export const authEmailPasswordExtras = {
  async sendResetPassword({
    user,
    url,
  }: {
    user: AuthUser;
    url: string;
  }) {
    if (!isResendConfigured()) {
      throw new Error("Odesílání e-mailů není nakonfigurované.");
    }
    const result = await sendForgotPasswordEmailMessage(user, url);
    if (!result.ok) {
      throw new Error("E-mail s odkazem na obnovení hesla se neodeslal.");
    }
  },
  async onPasswordReset({ user }: { user: AuthUser }) {
    if (!isResendConfigured()) return;
    await sendPasswordChangedEmailMessage(user);
  },
};
