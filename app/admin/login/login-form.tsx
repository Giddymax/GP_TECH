"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, type AuthActionState } from "./actions";

const initialState: AuthActionState = { error: null };

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <Label htmlFor="email" className="text-off-white/80">
          Email
        </Label>
        <Input id="email" name="email" type="email" required placeholder="you@grainypalacetech.com" />
      </div>
      <div>
        <Label htmlFor="password" className="text-off-white/80">
          Password
        </Label>
        <Input id="password" name="password" type="password" required />
      </div>
      {state.error ? (
        <p role="alert" className="text-[13px] font-medium text-red-400">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
