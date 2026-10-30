"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { section } from "@/lib/ui-surfaces";

const SUPPORT_EMAIL = "podpora@promobazar.cz";

function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Kontakt promobazar — ${name}`);
    const body = encodeURIComponent(
      `Jméno: ${name}\nE-mail: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <p className="text-sm leading-relaxed text-zinc-200">
        Otevřeli jsme ti e-mailového klienta. Pošli zprávu na{" "}
        <span className="text-white">{SUPPORT_EMAIL}</span>, nebo nám napiš přímo.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Jméno" htmlFor="contact-name">
        <Input id="contact-name" name="name" required autoComplete="name" />
      </FormField>
      <FormField label="E-mail" htmlFor="contact-email">
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </FormField>
      <FormField label="Zpráva" htmlFor="contact-message">
        <Textarea id="contact-message" name="message" rows={3} required />
      </FormField>
      <Button type="submit" className="w-full">
        Odeslat zprávu
      </Button>
    </form>
  );
}

export function ContactSection() {
  return (
    <section id="kontakt" className={section}>
      <div className="mx-auto grid max-w-7xl gap-10 rounded-2xl border border-white/[0.05] bg-panel p-8 md:grid-cols-2 md:p-14">
        <div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Máš dotaz? Ozveme se.
          </h2>
          <p className="mt-4 max-w-md text-zinc-200">
            Ať jsi firma, nebo tvůrce, náš support odpovídá do 1 pracovního dne.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-cyan text-void"
                aria-hidden
              >
                <Mail className="size-4" />
              </span>
              {SUPPORT_EMAIL}
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
