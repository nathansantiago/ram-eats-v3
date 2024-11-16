"use client"

import { useLayoutEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import FormHeader from "./form-header";

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
        <FormHeader children={children}/>
    )
}