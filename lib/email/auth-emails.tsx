import "server-only";

import ChangeEmailConfirmEmail from "@/emails/change-email-confirm";
import ChangeEmailVerifyEmail from "@/emails/change-email-verify";
import DeleteAccountEmail from "@/emails/delete-account";
import ForgotPasswordEmail from "@/emails/forgot-password";
import PasswordChangedEmail from "@/emails/password-changed";
import VerifyEmail from "@/emails/verify-email";
import WelcomeEmail from "@/emails/welcome";
import { sendReactEmail } from "@/lib/email/send";

type AuthUser = {
  email: string;
  name: string;
};

export async function sendVerificationEmailMessage(
  user: AuthUser,
  url: string,
) {
  return sendReactEmail({
    to: user.email,
    subject: "Potvrď e-mail na promobazar.cz",
    react: <VerifyEmail name={user.name} verifyUrl={url} />,
  });
}

export async function sendChangeEmailVerifyMessage(
  user: AuthUser,
  newEmail: string,
  url: string,
) {
  return sendReactEmail({
    to: newEmail,
    subject: "Ověř nový e-mail na promobazar.cz",
    react: (
      <ChangeEmailVerifyEmail
        name={user.name}
        newEmail={newEmail}
        verifyUrl={url}
      />
    ),
  });
}

export async function sendChangeEmailConfirmMessage(
  user: AuthUser,
  newEmail: string,
  url: string,
) {
  return sendReactEmail({
    to: user.email,
    subject: "Potvrzení změny e-mailu na promobazar.cz",
    react: (
      <ChangeEmailConfirmEmail
        name={user.name}
        newEmail={newEmail}
        confirmUrl={url}
      />
    ),
  });
}

export async function sendForgotPasswordEmailMessage(
  user: AuthUser,
  url: string,
) {
  return sendReactEmail({
    to: user.email,
    subject: "Zapomenuté heslo na promobazar.cz",
    react: <ForgotPasswordEmail name={user.name} resetUrl={url} />,
  });
}

export async function sendPasswordChangedEmailMessage(user: AuthUser) {
  return sendReactEmail({
    to: user.email,
    subject: "Heslo na promobazar.cz bylo změněno",
    react: <PasswordChangedEmail name={user.name} />,
  });
}

export async function sendWelcomeEmailMessage(user: AuthUser) {
  return sendReactEmail({
    to: user.email,
    subject: "Vítej na promobazar.cz",
    react: <WelcomeEmail name={user.name} />,
  });
}

export async function sendDeleteAccountEmailMessage(
  user: AuthUser,
  url: string,
) {
  return sendReactEmail({
    to: user.email,
    subject: "Potvrzení smazání účtu na promobazar.cz",
    react: <DeleteAccountEmail name={user.name} deleteUrl={url} />,
  });
}
