import * as React from "react";
import Link from "next/link";
import { Logo } from "../../components/common/logo";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { CROP_OPTIONS } from "../../utils/constants";
import { ArrowRight } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
        <div className="text-center space-y-2">
          <Logo className="justify-center" />
          <h2 className="text-2xl font-black text-slate-900">Register Farmer Account</h2>
          <p className="text-xs text-slate-500">Get tailored AgriTech advisories for your farm</p>
        </div>

        <form className="space-y-4">
          <Input label="Full Name" placeholder="Rajesh Kumar" required />
          <Input label="Mobile Number" placeholder="+91 98765 43210" required />
          <Input label="PIN Code" placeholder="141001" required />
          <Select label="Primary Crop Cultivated" options={CROP_OPTIONS} />
          <Link href="/dashboard" className="block pt-2">
            <Button variant="primary" size="lg" className="w-full">
              Create Account & Launch <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-emerald-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}