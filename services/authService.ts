export const authService = {
  async sendOTP(email: string): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("OTP sent to:", email);
  },

  async resendOTP(email: string): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("OTP resent to:", email);
  },

  async login(email: string, password: string): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Login with:", { email, password });
  },

  async signup(data: {
    email: string;
    username: string;
    phone: string;
    password: string;
    otp: string;
  }): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Signup with:", data);
  },

  async googleSignIn(): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Google sign in initiated");
  },
};
