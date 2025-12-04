import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

export function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Layout padTop={false}>
      <section className="min-h-screen flex items-center justify-center px-4 py-20 pt-24 sm:pt-32 relative overflow-hidden">
        {/* Enhanced gradient backgrounds for both themes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Main heading with improved responsive sizing */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight px-4">
            Authentication
            <span className="block bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-500 bg-clip-text text-transparent mt-2 animate-gradient bg-[length:200%_auto]">
              Made Simple
            </span>
          </h1>

          {/* Description with better contrast */}
          <p className="text-base sm:text-lg md:text-xl text-foreground/80 dark:text-foreground/70 max-w-2xl mx-auto mb-10 sm:mb-12 animate-fade-in leading-relaxed px-4">
            A minimal authentication template with Google OAuth integration.
            Start building your application with secure authentication out of
            the box.
          </p>

          {/* CTA button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in px-4 mb-16 sm:mb-20">
            <Button
              onClick={() => navigate(isAuthenticated ? "/profile" : "/login")}
              size="lg"
              className="w-full sm:w-auto rounded-full px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl group cursor-pointer relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500"
            >
              {isAuthenticated ? "Go to Profile" : "Get Started"}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto mb-16 sm:mb-20 px-4 animate-fade-in">
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl bg-accent/30 dark:bg-accent/20 backdrop-blur-sm border border-border/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 dark:bg-blue-500/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Secure Authentication</h3>
              <p className="text-sm text-foreground/60 dark:text-foreground/50">
                Google OAuth integration with JWT sessions
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl bg-accent/30 dark:bg-accent/20 backdrop-blur-sm border border-border/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 dark:bg-cyan-500/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
              </div>
              <h3 className="font-semibold mb-2">Ready to Deploy</h3>
              <p className="text-sm text-foreground/60 dark:text-foreground/50">
                Production-ready template with NestJS and React
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
