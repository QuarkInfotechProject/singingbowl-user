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

  async googleSignIn(): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Google sign in initiated");
  },
};
