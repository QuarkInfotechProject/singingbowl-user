import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export const PasswordInput = ({
  label,
  value,
  onChange,
  placeholder = "••••••••",
  id = "password",
}: PasswordInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-700 font-medium text-sm">
        {label}
      </Label>
      <Input
        id={id}
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-50 border-gray-300 focus:border-amber-400 focus:ring-amber-300 rounded-lg placeholder:text-gray-400 text-gray-900 text-sm h-8"
      />
    </div>
  );
};
