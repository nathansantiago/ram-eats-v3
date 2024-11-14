"use client"

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { z } from "zod"
import ProfileForm from "./profile-form";
 
import { Button } from "@/components/ui/button"
import { handleLogout } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";
 
const formSchema = z.object({
  username: z.string().max(30, {
    message: "Username can't be more than 30 characters.",
  }).optional(),
  email: z.string().email({
    message: "Invalid email address.",
  }).optional(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }).optional(),
  height: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && (val > 0), {
    message: "Height must be a positive number.",
  }).optional(),
  weight: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && (val > 0), {
    message: "Weight must be a positive number.",
  }).optional(),
  age: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && (val > 0), {
    message: "Age must be a positive number.",
  }).optional(),
  maintenance_cal: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && (val > 0), {
    message: "Activity level must be a positive number.",
  }).optional(),
  gender: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && (val >= 0), {
    message: "Select an option.",
  }).optional(),
  fitness_goal: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && (val >= 0), {
    message: "Select an option.",
  }).optional(),
})

const SettingsPage: React.FC = () => {
    const supabase = createClient();
    const router = useRouter();
    const { toast } = useToast();

    const logoutClickAction = async () => {
        try {
            await handleLogout();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        }
    }

    return (
        <div className="space-y-6">
            <ProfileForm />
        </div>
    );
};

export default SettingsPage;