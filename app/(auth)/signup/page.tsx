import { AuthContent } from "@/components/Auth/AuthContent";

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl space-y-8 bg-white p-8 rounded-xl shadow-lg relative overflow-hidden">
                <AuthContent initialMode="signup" />
            </div>
        </div>
    );
}
