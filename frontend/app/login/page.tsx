import * as React from "react";
import Link from "next/link";
import { Logo } from "../../components/common/logo";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Phone, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
        <div className="text-center space-y-2">
          <Logo className="justify-center" />
          <h2 className="text-2xl font-black text-slate-900">Farmer Sign In</h2>
          <p className="text-xs text-slate-500">Access your personalized crop advisories and post-harvest planner</p>
        </div>

        <form className="space-y-4">
          <Input label="Mobile Number or Email" placeholder="+91 98765 43210" required />
          <Input label="Password or OTP" type="password" placeholder="••••••••" required />
          <div className="flex justify-end text-xs">
            <Link href="/forgot-password" className="font-semibold text-emerald-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Link href="/dashboard" className="block pt-2">
            <Button variant="primary" size="lg" className="w-full">
              Sign In to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-emerald-600 hover:underline">
            Register Farmer Account
          </Link>
        </div>
      </div>
    </div>
  );
}