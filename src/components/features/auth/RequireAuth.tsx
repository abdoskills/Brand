"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";

interface RequireAuthProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function RequireAuth({ children, requireAdmin = false }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!user) {
      const next = encodeURIComponent(pathname + (searchParams.toString() ? `?${searchParams}` : ""));
      router.replace(`/login?next=${next}`);
      return;
    }
    if (requireAdmin && user.role !== "admin") {
      router.replace("/account");
    }
  }, [isLoading, user, router, pathname, searchParams, requireAdmin]);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-neutral-400">
        Authenticating...
      </div>
    );
  }

  if (requireAdmin && user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
