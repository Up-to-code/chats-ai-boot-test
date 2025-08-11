"use client";
import React, { useState } from "react";
import { UserTypeCard } from "./UserTypeCard";
import { Building2, User, Wand2 } from "lucide-react";
import { useStupes } from "@/stores/useStupes";

export default function StepUserType() {
  const { setStep, setUserType } = useStupes();
  const [selected, setSelected] = useState<string>("");
  const [customName, setCustomName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setUserType(selected === "custom" ? customName : selected);
      setLoading(false);
      setStep(2);
    }, 600);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Select User Type</h1>
      <UserTypeCard
        title="Business"
        description="For companies and organizations"
        icon={Building2}
        selected={selected === "business"}
        onClick={() => setSelected("business")}
        loading={loading && selected === "business"}
      />
      <UserTypeCard
        title="Personal"
        description="For individual users"
        icon={User}
        selected={selected === "personal"}
        onClick={() => setSelected("personal")}
        loading={loading && selected === "personal"}
      />
      <UserTypeCard
        title="Other"
        description="Custom user type"
        icon={Wand2}
        selected={selected === "custom"}
        allowCustomName
        customName={customName}
        onCustomNameChange={setCustomName}
        onClick={() => setSelected("custom")}
        loading={loading && selected === "custom"}
      />

      <button
        className="w-full bg-orange-500 text-white p-2 rounded-lg disabled:opacity-50"
        onClick={handleNext}
        disabled={!selected || (selected === "custom" && !customName)}
      >
        Continue
      </button>
    </div>
  );
}
