"use client";
import { cn } from "@/lib/utils";
import { Loader2, Building2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import React from "react";

interface UserTypeCardProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  selected: boolean;
  loading?: boolean;
  onClick: () => void;
  allowCustomName?: boolean;
  customName?: string;
  onCustomNameChange?: (value: string) => void;
}

export function UserTypeCard({
  title,
  description,
  icon: Icon,
  selected,
  loading,
  onClick,
  allowCustomName,
  customName,
  onCustomNameChange,
}: UserTypeCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all",
        selected ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"
      )}
    >
      {loading ? (
        <Loader2 className="h-6 w-6 text-orange-500 animate-spin mt-1" />
      ) : Icon ? (
        <Icon className="h-6 w-6 text-orange-500 mt-1" />
      ) : null}

      <div className="flex flex-col w-full">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>

        {allowCustomName && selected && (
          <Input
            className="mt-2"
            placeholder="Enter your custom type"
            value={customName}
            onChange={(e) => onCustomNameChange?.(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </div>
  );
}
