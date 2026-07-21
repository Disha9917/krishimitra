import * as React from "react";
import Link from "next/link";
import { Logo } from "../../components/common/logo";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl text-center">
        <Logo className="justify-center" />
        <h2 className="text-2xl font-black text-slate-900">Reset Password</h2>
        <p className="text-xs text-slate-500">We will send an OTP code to your registered mobile number</p>

        <form className="space-y-4 text-left">
          <Input label="Mobile Number" placeholder="+91 98765 43210" required />
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Send OTP Reset Code
          </Button>
        </form>

        <div className="text-xs text-slate-500 pt-2">
          <Link href="/login" className="font-bold text-emerald-600 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}