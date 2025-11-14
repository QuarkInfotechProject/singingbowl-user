interface EmailDisplayProps {
  email: string;
}

export const EmailDisplay = ({ email }: EmailDisplayProps) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
      <p className="text-xs text-amber-900">
        <span className="font-semibold">Email:</span> {email}
      </p>
    </div>
  );
};
