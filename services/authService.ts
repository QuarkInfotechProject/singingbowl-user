import axios from "axios";

export const authService = {
  async sendOTP(email: string): Promise<void> {
    try {
      await axios.post("/api/user/register/send-mail", { email });
      console.log("OTP sent to:", email);
    } catch (error) {
      console.error("sendOTP error:", error);
      throw error;
    }
  },

  async resendOTP(email: string): Promise<void> {
    // Usually same as sendOTP, or specific resend endpoint if available
    return this.sendOTP(email);
  },

  async login(email: string, password: string): Promise<any> {
    const { data } = await axios.post("/api/user/auth/login", {
      email,
      password,
    });
    return data;
  },

  async signup(data: {
    email: string;
    username: string; // mapped to fullName
    phone: string;    // mapped to phoneNumber
    password: string;
    otp: string;      // mapped to verificationCode
  }): Promise<any> {
    try {
      const payload = {
        email: data.email,
        verificationCode: data.otp,
        phoneNumber: data.phone,
        fullName: data.username,
        password: data.password,
        confirmPassword: data.password, // Assuming confirm matches based on UI validation
      };
      await axios.post("/api/user/register", payload);
      console.log("Signup successful, attempting auto-login...");

      // Auto login after signup
      return this.login(data.email, data.password);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  async forgotPassword(email: string): Promise<any> {
    try {
      const { data } = await axios.post("/api/user/forgot-password", { email });
      return data;
    } catch (error) {
      console.error("forgotPassword error:", error);
      throw error;
    }
  },

  async googleSignIn(): Promise<void> {
    // Get the current URL to return to after authentication
    const returnUrl = typeof window !== "undefined" ? window.location.href : "/";

    try {
      // Fetch the Google OAuth URL from our API
      console.log("Fetching Google OAuth URL...");
      const response = await axios.get(`/api/user/auth/google/redirect?returnUrl=${encodeURIComponent(returnUrl)}`);

      console.log("Google OAuth response:", response.data);

      // The API returns the redirect URL
      const redirectUrl = response.data?.redirectUrl || response.data?.data;

      console.log("Redirect URL:", redirectUrl);

      if (redirectUrl) {
        // Navigate to Google's OAuth page
        console.log("Navigating to:", redirectUrl);
        window.location.assign(redirectUrl);
        // Return a promise that never resolves to prevent further execution
        return new Promise(() => { });
      } else {
        console.error("No redirect URL in response:", response.data);
        throw new Error("Failed to get Google sign in URL");
      }
    } catch (error: any) {
      console.error("Google sign in error:", error);
      throw error;
    }
  },
};
