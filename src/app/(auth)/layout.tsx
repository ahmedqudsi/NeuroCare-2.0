
// // src/app/(auth)/layout.tsx
// import type { ReactNode } from 'react';

import UnderProgress from "@/components/UnderProgress";

// export default function AuthLayout({ children }: { children: ReactNode }) {
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
//       {children}
//     </div>
//   );
// }

export default function SignupPage() {
  return (
    <div className="mt-20">
      <UnderProgress
      title="Coming Soon"
      description="We're building a seamless registration experience. Stay tuned!"
    />
    </div>
  );
}