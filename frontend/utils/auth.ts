"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

// Define a type for the input parameters
type AuthData = {
    email: string;
    password: string;
};

type SignUpAuthData = {
    email: string;
    password: string;
    username: string;
};

export async function handleLogin({ email, password }: AuthData) {
  const supabase = createClient();

    // Check for null values
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message);
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        revalidatePath("/", "layout");
        redirect("/dashboard/home");
      }
    }
}

export async function handleRegister({ email, password, username }: SignUpAuthData) {
    const supabase = createClient();

    // Check for null values
    if (!email || !password || !username) {
      throw new Error("Email, password, and username are required.");
    }

    // Check for duplicate email
    const { data: emailData, error: emailError } = await supabase
      .from('Users')
      .select('email')
      .eq('email', email)
      .single();

    if (emailError && emailError.code !== 'PGRST116') {
      throw new Error("Error checking email: " + emailError.message);
    }

    if (emailData) {
      throw new Error("Email is already in use.");
    }

    // Check for duplicate username
    const { data: usernameData, error: usernameError } = await supabase
      .from('Users')
      .select('username')
      .eq('username', username)
      .single();

    if (usernameError && usernameError.code !== 'PGRST116') {
      throw new Error("Error checking username: " + usernameError.message);
    }

    if (usernameData) {
      throw new Error("Username is already in use.");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      throw new Error(error.message);
    } else {
      // Extract the uuid from the signed-up user
      const uuid = data.user?.id;
  
      if (uuid) {
        // Insert the uuid and email into the Users table
        const { error: insertError } = await supabase
          .from('Users')
          .insert([{ user_uid: uuid, email, username }]);
        if (insertError) {
          throw new Error("Error inserting user into Users table: " + insertError.message);
        } else {
          console.log("Registered " + email + " successfully!");
        }
      } else {
        throw new Error("Error: User ID not found.");
      }
    }
}

export const handleLogout = async () => {
    const supabase = createClient();
    
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
    else {
        console.log('User logged out');
        revalidatePath("/", "layout");
        redirect("/");
    }
};