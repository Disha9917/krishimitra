import * as React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Toast } from "../ui/toast";
import { Bell, MessageSquare, PhoneCall, Save, ShieldCheck } from "lucide-react";

export function AlertSettings() {
  const [smsEnabled, setSmsEnabled] = React.useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = React.useState(true);
  const [priceThreshold, setPriceThreshold] = React.useState("2350");
  const [diseaseAlerts, setDiseaseAlerts] = React.useState(true);
  const [weatherAlerts, setWeatherAlerts] = React.useState(true);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("Alert settings saved successfully! Simulated notifications activated.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      {toastMessage && <Toast type="success" message={toastMessage} onClose={() => setToastMessage(null)} />}

      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Bell className="h-5 w-5 text-emerald-600" />
          Alert & Notification Center Settings
        </h3>
        <p className="text-xs text-slate-500">Configure instant SMS, WhatsApp, and market price thresholds</p>
      </div>

      <div className="space-y-4">
        {/* SMS Toggle */}
        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">SMS Alerts</h4>
              <p className="text-xs text-slate-500">Receive critical weather & disease warnings via direct SMS</p>
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={smsEnabled}
              onChange={(e) => setSmsEnabled(e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-focus:outline-none" />
          </label>
        </div>

        {/* WhatsApp Toggle */}
        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-2.5 text-green-700">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">WhatsApp Alerts</h4>
              <p className="text-xs text-slate-500">Get daily advisory summaries and mandi price updates on WhatsApp</p>
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={whatsappEnabled}
              onChange={(e) => setWhatsappEnabled(e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-focus:outline-none" />
          </label>
        </div>

        {/* Price Threshold Simulation */}
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Market Price Alert Threshold</h4>
              <p className="text-xs text-slate-500">Notify when mandi price crosses your specified floor limit</p>
            </div>
          </div>
          <div className="max-w-xs">
            <Input
              label="Minimum Threshold Price (INR / Quintal)"
              type="number"
              value={priceThreshold}
              onChange={(e) => setPriceThreshold(e.target.value)}
              placeholder="e.g. 2350"
            />
          </div>
        </div>

        {/* Category Switches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-xs font-semibold text-slate-800">Disease Outbreak Alerts</span>
            <input
              type="checkbox"
              checked={diseaseAlerts}
              onChange={(e) => setDiseaseAlerts(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-xs font-semibold text-slate-800">Severe Weather Warnings</span>
            <input
              type="checkbox"
              checked={weatherAlerts}
              onChange={(e) => setWeatherAlerts(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Button type="submit" variant="primary">
          <Save className="h-4 w-4" />
          Save Preference Settings
        </Button>
      </div>
    </form>
  );
}
