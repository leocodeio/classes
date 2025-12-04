import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, Calendar, Shield } from "lucide-react";

export function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-border">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-24 h-24 rounded-full ring-4 ring-border shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-foreground/60">Welcome to your profile</p>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>

            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-accent/30 dark:bg-accent/20 border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground/60 mb-1">
                    Full Name
                  </p>
                  <p className="text-base font-semibold break-words">
                    {user.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-accent/30 dark:bg-accent/20 border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 dark:bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground/60 mb-1">
                    Email Address
                  </p>
                  <p className="text-base font-semibold break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-accent/30 dark:bg-accent/20 border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 dark:bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground/60 mb-1">
                    Email Verification
                  </p>
                  <p className="text-base font-semibold">
                    {user.emailVerified ? (
                      <span className="text-green-600 dark:text-green-400">
                        Verified
                      </span>
                    ) : (
                      <span className="text-orange-600 dark:text-orange-400">
                        Not Verified
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-accent/30 dark:bg-accent/20 border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 dark:bg-pink-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground/60 mb-1">
                    Member Since
                  </p>
                  <p className="text-base font-semibold">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
