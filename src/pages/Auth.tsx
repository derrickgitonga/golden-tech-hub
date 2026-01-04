import { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[hsl(43,100%,50%)] to-[hsl(35,100%,40%)] flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-2xl">B</span>
          </div>
          <span className="font-display text-3xl font-semibold text-foreground">
            Back<span className="text-gradient-gold">Market</span>
          </span>
        </a>

        {/* Auth Component */}
        <div className="w-full flex justify-center">
          {isLogin ? (
            <SignIn />
          ) : (
            <SignUp />
          )}
        </div>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => setIsLogin(!isLogin)}
            className="text-muted-foreground hover:text-gold transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
