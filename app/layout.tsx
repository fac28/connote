import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./components/next/providers";
import Nav from "./components/Nav";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  [supabase];

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Nav session={session} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
