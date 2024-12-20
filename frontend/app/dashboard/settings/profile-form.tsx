"use client";
 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleLogout } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";
import {onSubmit } from "@/utils/settings-page/submit-form";
 
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
})

export default function ProfileForm() {
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

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      await onSubmit(values);
      form.reset({username: '', email: '', password: ''}); // Clear the form fields
      toast({
          variant: "default",
          title: "Success",
          description: "Account updated successfully.",
      });
    } catch (error: any) {
      toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
      });
    }
  }

    return (
    <div className="flex flex-col items-center">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6 w-full">
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
                <Button type="submit" className="mx-8">Update Account</Button>
                <Button onClick={logoutClickAction} className='mx-8 text-destructive hover:bg-destructive/90' variant={'ghost'} type='button'>Log Out</Button>
            </form>
        </Form>
    </div>
    );
}