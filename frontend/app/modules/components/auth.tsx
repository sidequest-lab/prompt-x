"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "./navbar";
import { setStoredUser } from "@/lib/session";

type AuthTab = "login" | "signup";

type AuthProps = {
  defaultTab?: AuthTab;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";
const LOCAL_USERS_KEY = "promptx.localUsers";

type AuthResult = {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

type LocalStoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
};

export const Auth = ({ defaultTab = "login" }: AuthProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    agreedToTerms: false,
  });

  function handleTabChange(value: string) {
    setActiveTab(value as AuthTab);
    setErrorMessage("");
    setSuccessMessage("");
  }

  function persistAuthSession(tokens: {
    accessToken: string;
    refreshToken: string;
  }) {
    const storage = rememberMe ? window.localStorage : window.sessionStorage;
    const otherStorage = rememberMe ? window.sessionStorage : window.localStorage;

    otherStorage.removeItem("promptx.accessToken");
    otherStorage.removeItem("promptx.refreshToken");
    storage.setItem("promptx.accessToken", tokens.accessToken);
    storage.setItem("promptx.refreshToken", tokens.refreshToken);
  }

  function getStoredUsers() {
    try {
      const raw = window.localStorage.getItem(LOCAL_USERS_KEY);
      return raw ? (JSON.parse(raw) as LocalStoredUser[]) : [];
    } catch {
      return [];
    }
  }

  function setStoredUsers(users: LocalStoredUser[]) {
    window.localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  }

  function buildLocalAuthResult(user: LocalStoredUser): AuthResult {
    const tokenSeed = `${user.id}-${Date.now()}`;

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens: {
        accessToken: `local-access-${tokenSeed}`,
        refreshToken: `local-refresh-${tokenSeed}`,
      },
    };
  }

  function submitWithLocalFallback(
    endpoint: "login" | "register",
    payload: {
      name?: string;
      email: string;
      password: string;
    }
  ): AuthResult {
    const users = getStoredUsers();

    if (endpoint === "register") {
      const existingUser = users.find(
        (user) => user.email.toLowerCase() === payload.email.toLowerCase()
      );

      if (existingUser) {
        throw new Error("An account with this email already exists");
      }

      const newUser: LocalStoredUser = {
        id: crypto.randomUUID(),
        name: payload.name || "PromptX User",
        email: payload.email,
        password: payload.password,
        role: "user",
      };

      setStoredUsers([...users, newUser]);
      return buildLocalAuthResult(newUser);
    }

    const user = users.find(
      (entry) =>
        entry.email.toLowerCase() === payload.email.toLowerCase() &&
        entry.password === payload.password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    return buildLocalAuthResult(user);
  }

  async function submitAuthRequest<TPayload>(
    endpoint: "login" | "register",
    payload: TPayload
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Authentication request failed");
      }

      return data as AuthResult;
    } catch (error) {
      if (
        error instanceof TypeError ||
        (error instanceof Error && error.message === "Failed to fetch")
      ) {
        return submitWithLocalFallback(
          endpoint,
          payload as {
            name?: string;
            email: string;
            password: string;
          }
        );
      }

      throw error;
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const result = await submitAuthRequest("login", loginForm);
      persistAuthSession(result.tokens);
      setStoredUser(result.user);
      setSuccessMessage("Signed in successfully. Redirecting...");
      router.push("/browse");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!signupForm.agreedToTerms) {
      setErrorMessage("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await submitAuthRequest("register", {
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
      });
      persistAuthSession(result.tokens);
      setStoredUser(result.user);
      setSuccessMessage("Account created successfully. Redirecting...");
      router.push("/browse");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create account"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold gradient-text mb-3">
              Welcome to PromptX
            </h1>
            <p className="text-muted-foreground">
              Join thousands of creators monetizing AI prompts
            </p>
          </div>

          {/* Auth Card */}
          <Card className="card-glow border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Get Started
              </CardTitle>
              <CardDescription className="text-center">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {(errorMessage || successMessage) && (
                  <div
                    className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
                      errorMessage
                        ? "border-destructive/40 bg-destructive/10 text-destructive"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    }`}
                  >
                    {errorMessage || successMessage}
                  </div>
                )}

                {/* Login Form */}
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          value={loginForm.email}
                          onChange={(event) =>
                            setLoginForm((current) => ({
                              ...current,
                              email: event.target.value,
                            }))
                          }
                          placeholder="you@example.com"
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          value={loginForm.password}
                          onChange={(event) =>
                            setLoginForm((current) => ({
                              ...current,
                              password: event.target.value,
                            }))
                          }
                          placeholder="••••••••"
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(event) => setRememberMe(event.target.checked)}
                          className="rounded border-border"
                        />
                        <span className="text-muted-foreground">
                          Remember me
                        </span>
                      </label>
                      <a href="#" className="text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-tertiary hover:opacity-90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </TabsContent>

                {/* Signup Form */}
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          value={signupForm.name}
                          onChange={(event) =>
                            setSignupForm((current) => ({
                              ...current,
                              name: event.target.value,
                            }))
                          }
                          placeholder="John Doe"
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          value={signupForm.email}
                          onChange={(event) =>
                            setSignupForm((current) => ({
                              ...current,
                              email: event.target.value,
                            }))
                          }
                          placeholder="you@example.com"
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          value={signupForm.password}
                          onChange={(event) =>
                            setSignupForm((current) => ({
                              ...current,
                              password: event.target.value,
                            }))
                          }
                          placeholder="••••••••"
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Use at least 8 characters with uppercase, lowercase, and a number.
                      </p>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={signupForm.agreedToTerms}
                        onChange={(event) =>
                          setSignupForm((current) => ({
                            ...current,
                            agreedToTerms: event.target.checked,
                          }))
                        }
                        className="rounded border-border mt-1"
                        required
                      />
                      <span className="text-muted-foreground">
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-tertiary hover:opacity-90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full border-border/50 hover:border-primary"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-border/50 hover:border-primary"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
