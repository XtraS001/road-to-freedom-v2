// "use client"

// import Navbar from '@/components/navbar';
// import { useSubscribeToPushNotifications } from '@/lib/hooks/useSubscribeToPushNotifications';
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Menu } from "lucide-react";
// import React, { useEffect } from 'react'

// export default function layout({ children }: { children: React.ReactNode }) {
//   const { subscribe, subscription } = useSubscribeToPushNotifications();

//   useEffect(() => {
//     if (!subscription) {
//       subscribe()
//     }
//   }, [subscription])

//   return (
//     <div className="flex min-h-screen flex-col">
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-14 items-center px-4 w-full max-w-(--breakpoint-xl) mx-auto">
//           <div className="md:hidden mr-2">
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="ghost" size="icon">
//                   <Menu className="h-5 w-5" />
//                   <span className="sr-only">Toggle menu</span>
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="left" className="pr-0">
//                 <Navbar className="w-full" orientation="vertical" />
//               </SheetContent>
//             </Sheet>
//           </div>
//           <Navbar className="w-full hidden md:flex" />
//           <div className="md:hidden flex-1">
//             {/* Spacer or mobile logo if needed */}
//           </div>
//           <Navbar className="w-full md:hidden" orientation="horizontal" />
//         </div>
//       </header>
//       <main className="flex-1 container py-6 px-4 w-full max-w-(--breakpoint-xl) mx-auto">
//         {children}
//       </main>
//     </div>
//   )
// }

// new layout.tsx
"use client";

import Navbar from "@/components/navbar";
import { useSubscribeToPushNotifications } from "@/lib/hooks/useSubscribeToPushNotifications";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import React, { useEffect } from "react";
import ClientAuthGuard from "@/lib/auth/clientAuthGuard";
import { Navigation } from "@/components/navigation";

export default function layout({ children }: { children: React.ReactNode }) {
  const { subscribe, subscription } = useSubscribeToPushNotifications();

  useEffect(() => {
    if (!subscription) {
      subscribe();
    }
  }, [subscription]);

  return (
    <div className="flex min-h-screen flex-col">
      <div>
        <Navigation />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </div>
  );
}
