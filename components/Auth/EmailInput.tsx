import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EmailInput = ({
  value,
  onChange,
  placeholder = "you@example.com",
}: EmailInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
        Email Address
      </Label>
      <Input
        id="email"
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-50 border-gray-300 focus:border-amber-400 focus:ring-amber-300 rounded-lg placeholder:text-gray-400 text-gray-900 text-sm h-9"
      />
    </div>
  );
};
