import { useState, useEffect } from "react";

export interface AuthFormState {
  loginEmail: string;
  loginPassword: string;
  signupStep: "email" | "details";
  signupEmail: string;
  username: string;
  phone: string;
  password: string;
  confirmPassword: string;
  otp: string;
  loading: boolean;
  error: string;
  resendCountdown: number;
}

export const useAuthForm = () => {
  const [state, setState] = useState<AuthFormState>({
    loginEmail: "",
    loginPassword: "",
    signupStep: "email",
    signupEmail: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
    loading: false,
    error: "",
    resendCountdown: 0,
  });

  useEffect(() => {
    if (state.resendCountdown > 0) {
      const timer = setTimeout(
        () =>
          setState((prev) => ({
            ...prev,
            resendCountdown: prev.resendCountdown - 1,
          })),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [state.resendCountdown]);

  const updateField = <K extends keyof AuthFormState>(
    field: K,
    value: AuthFormState[K]
  ) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setState({
      loginEmail: "",
      loginPassword: "",
      signupStep: "email",
      signupEmail: "",
      username: "",
      phone: "",
      password: "",
      confirmPassword: "",
      otp: "",
      loading: false,
      error: "",
      resendCountdown: 0,
    });
  };

  const setError = (error: string) => {
    setState((prev) => ({ ...prev, error }));
  };

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  };

  const setSignupStep = (step: "email" | "details") => {
    setState((prev) => ({ ...prev, signupStep: step }));
  };

  const setResendCountdown = (countdown: number) => {
    setState((prev) => ({ ...prev, resendCountdown: countdown }));
  };

  return {
    state,
    updateField,
    resetForm,
    setError,
    setLoading,
    setSignupStep,
    setResendCountdown,
  };
};
