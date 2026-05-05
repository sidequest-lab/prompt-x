"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearStoredSession, getStoredUser, type StoredUser } from "@/lib/session";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    function syncUser() {
      setUser(getStoredUser());
    }

    syncUser();
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    if (pathname === "/browse") {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get("search") || "");
      return;
    }

    setSearchQuery("");
  }, [pathname]);

  const initials = useMemo(() => {
    if (!user?.name) {
      return "PX";
    }

    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  function handleLogout() {
    clearStoredSession();
    setUser(null);
    router.push("/auth");
    router.refresh();
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/browse?search=${encodeURIComponent(query)}` : "/browse");
    window.dispatchEvent(
      new CustomEvent("promptx:filters-changed", {
        detail: {
          category: "All",
          search: query,
        },
      })
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          <Link href="/" className="group flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-primary to-tertiary p-2">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">PromptX</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/home"
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              For You
            </Link>
            <Link
              href="/browse"
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              Browse
            </Link>
            <Link
              href="/categories"
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              Categories
            </Link>
            <Link
              href="/creators"
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              Creators
            </Link>
            {user ? (
              <Link
                href="/upload"
                className="text-sm text-foreground transition-colors hover:text-primary"
              >
                Upload
              </Link>
            ) : null}
            {user ? (
              <Link
                href="/profile"
                className="text-sm text-foreground transition-colors hover:text-primary"
              >
                Profile
              </Link>
            ) : null}
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden max-w-md flex-1 lg:flex"
          >
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search prompts..."
              className="border-border/50 bg-card pl-10 transition-colors focus:border-primary"
            />
          </form>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button asChild variant="ghost" className="hidden sm:flex">
                  <Link href="/profile" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-border/50">
                      <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-28 truncate">{user.name}</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="icon" className="sm:hidden">
                  <Link href="/profile" aria-label="Open profile">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden sm:flex">
                  <Link href="/auth">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-primary to-tertiary transition-opacity hover:opacity-90"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
