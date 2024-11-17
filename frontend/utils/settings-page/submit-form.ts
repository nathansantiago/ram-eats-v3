"use server";

import { z } from "zod";
import { createClient } from "../supabase/server";

const formSchema = z.object({
    username: z.string()
        .max(30, {message: "Username can't be more than 30 characters."})
        .optional(),
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
});

export async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();

    const definedValues = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => value !== undefined && value !== null && value !== "")
    );

    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from('Users')
        .update(definedValues)
        .eq('user_uid', user?.user?.id)
        .select();

    if (error) {
        throw new Error(error.message);
    } else {
      console.log('Data uploaded successfully:', data);
    }
}