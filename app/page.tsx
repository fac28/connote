import AuthForm from "./components/supabase/auth-form";
import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="dark flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Button color="danger">Example component</Button>
      </div>

      <div className="col-6 auth-widget">
        <AuthForm />
      </div>
    </main>
  );
}
