"use client";
import { useState, FormEvent } from "react";

interface AuthFormProps {
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  isLoading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ handleSubmit, isLoading }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form
      className="flex flex-col items-center mt-10 gap-10"
      onSubmit={(e) => handleSubmit(e, email, username, password)}
    >
      <div className="flex flex-col items-center gap-1">
        <label>Email</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          className="border-b border-black"
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <label>Username</label>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
          className="border-b border-black"
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
          className="border-b border-black"
        />
      </div>
      <button disabled={isLoading} className="bg-custom-orange rounded-xl p-2">
        Create account
      </button>
    </form>
  );
};

export default AuthForm;

// export default function AuthForm() {
//   const supabase = createClientComponentClient<Database>();

//   return (
//     <Auth
//       supabaseClient={supabase}
//       view="magic_link"
//       appearance={{ theme: ThemeSupa }}
//       theme="dark"
//       showLinks={false}
//       providers={[]}
//       redirectTo="http://localhost:3000/auth/callback"
//     />
//   );
// }
