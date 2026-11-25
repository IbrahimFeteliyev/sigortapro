import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { ReactNode } from "react";

/** Ships only the namespaces the client-side forms need. */
export async function FormMessages({ children }: { children: ReactNode }) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider
      messages={{ Forms: messages.Forms, Validation: messages.Validation, Common: messages.Common }}
    >
      {children}
    </NextIntlClientProvider>
  );
}
