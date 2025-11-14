interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert = ({ message }: ErrorAlertProps) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs shadow-sm animate-in fade-in">
      {message}
    </div>
  );
};
