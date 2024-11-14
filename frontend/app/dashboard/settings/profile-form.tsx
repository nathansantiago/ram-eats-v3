"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import { handleLogout } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
 
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

export default function ProfileForm() {
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

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })
    
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const transformedValues = {
            ...values,
            gender: values.gender ? values.gender === 1 : undefined,
        };

        const definedValues = Object.fromEntries(
            Object.entries(values).filter(([_, value]) => value !== undefined)
        );

        

        // Upload the defined values to Supabase
        const { data: user } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('Users')
            .update(definedValues)
            .eq('user_uid', user?.user?.id)
            .select();

        if (error) {
            console.error('Error uploading data:', error);
        } else {
            console.log('Data uploaded successfully:', data);
        }
    }
    return (
    <div className="flex flex-col items-center">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 min-w-80">
                            <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                                
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email@email.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your email.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                                
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="password" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your password.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                                
                            )}
                            />
                <Button onClick={logoutClickAction} className='w-full text-destructive hover:bg-destructive/90' variant={'ghost'}>Log Out</Button>
                <Button type="submit">Update Account</Button>
            </form>
        </Form>
    </div>
    );
}