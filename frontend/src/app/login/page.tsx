"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { LoginBackdrop } from "@/components/login-backdrop";
import { LoginCard } from "@/components/login-card";
import { LoginStory } from "@/components/login-story";
import { endAuthTransition, startAuthTransition } from "@/components/auth-transition";

export default function LoginPage() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <LoginBackdrop />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-5 sm:px-8 lg:grid lg:grid-cols-[55fr_45fr] lg:gap-12 lg:px-12 xl:px-16">
        <LoginCard
          isSigningIn={isSigningIn}
          onGoogleSignIn={() => {
            setIsSigningIn(true);
            startAuthTransition("Redirecting to Google…");
            void signIn("google", { callbackUrl: "/" }).catch(() => {
              endAuthTransition();
              setIsSigningIn(false);
            });
          }}
        />
        <LoginStory />
      </div>
    </main>
  );
}
