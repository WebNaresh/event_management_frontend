import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuthToken } from "@/hooks/useAuthToken";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
  rememberMe: z.boolean().default(false).optional(),
});
type LoginResponse = {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  role: string;
  token: string;
};

export default function LoginForm() {
  const navigate = useNavigate();
  const { saveToken } = useAuthToken();
  console.log("axios.defaults.baseURL", axios.defaults.baseURL);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await axios.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      return response.data;
    },
    onSuccess: (data: LoginResponse) => {
      console.log(`🚀 ~ file: login-form.tsx:48 ~ data:`, data);

      saveToken(data.token);

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      console.log(`🚀 ~ file: login-form.tsx:71 ~ data.role:`, data.role);
      if (data.role === "SUPER_ADMIN") {
        navigate("/super_admin/dashboard");
      } else if (data.role === "SECURITY") {
        navigate("/security/dashboard");
      } else {
        navigate("/user/dashboard")
      }
      // Handle successful login, e.g., redirect to dashboard
    },
    onError: (error) => {
      console.error(`🚀 ~ file: login-form.tsx:55 ~ error:`, error);
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to your account
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Button variant="link" className="text-sm text-primary">
                Forgot password?
              </Button>
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </Form>
        <Link to="/sign_up" className="block text-center text-primary">
          Don't have an account? Sign up
        </Link>
      </div>
    </div>
  );
}
