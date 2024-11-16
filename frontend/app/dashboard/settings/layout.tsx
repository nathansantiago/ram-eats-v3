"use client"

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { useLayoutEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const sidebarNavItems = [
    {
      title: "Account",
      href: "/dashboard/settings",
    },
    {
      title: "Physique",
      href: "/dashboard/settings/physique",
    },
    {
      title: "Activity",
      href: "/dashboard/settings/activity",
    }
]

interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function SettingsLayout({children}: SettingsLayoutProps) {
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useLayoutEffect(() => {
        const isLoggedIn = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    throw new Error('User is not logged in.');
                }
                setLoading(false);
            } catch(error: any) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message,
                });
                router.push('/');
            }
        }
        isLoggedIn();
    }, []);

    return (
        loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> :
        <>
            <div className="w-full space-y-6 p-10 pb-16 md:block">
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
                    <p className="text-muted-foreground">
                        Manage your profile settings.
                    </p>
                </div>
                <Separator className="my-6" />
                <div className="flex flex-col items-center space-y-8 lg:items-start lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/5">
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <div className="flex-1 lg:max-w-2xl w-[90%]">{children}</div>
                </div>
            </div>
        </>
    )
}