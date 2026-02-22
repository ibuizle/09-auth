'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { checkSession, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

const PRIVATE_PREFIXES = ['/notes', '/profile'];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));

    (async () => {
      try {
        const user = await checkSession();
        if (!isMounted) return;

        if (user) {
          setUser(user);
          setIsChecking(false);
          return;
        }

        // No active session
        clearIsAuthenticated();

        if (isPrivate) {
          try {
            await logout();
          } catch {
            // ignore
          }
          router.replace('/sign-in');
        }
      } catch {
        if (!isMounted) return;
        clearIsAuthenticated();
        if (isPrivate) router.replace('/sign-in');
      } finally {
        if (isMounted) setIsChecking(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [pathname, clearIsAuthenticated, router, setUser]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}
