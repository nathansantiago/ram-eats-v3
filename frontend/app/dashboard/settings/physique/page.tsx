"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { useToast } from "@/hooks/use-toast";
import { onSubmit } from "@/utils/settings-page/submit-form"
 
const formSchema = z.object({
  height: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && (val > 0), {
    message: "Height must be a positive number.",
  }).optional(),
  weight: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && (val > 0), {
    message: "Weight must be a positive number.",
  }).optional(),
  age: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && (val > 0), {
    message: "Age must be a positive number.",
  }).optional(),
  gender: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && (val >= 0), {
    message: "Select an option.",
  }).optional(),
})

const SettingsPhysiquePage: React.FC = () => {
    const { toast } = useToast();

    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            height: undefined,
            weight: undefined,
            age: undefined,
            gender: undefined,
        }
    })
    
    async function handleSubmit(values: z.infer<typeof formSchema>) {
        try {
          await onSubmit(values);
          form.reset({height: undefined, weight: undefined, age: undefined, gender: undefined});
          toast({
              variant: "default",
              title: "Success",
              description: "Physique updated successfully.",
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
                                name="height"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Height</FormLabel>
                                    <FormControl>
                                        <Input placeholder="56" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your height in inches.
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                    
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Weight</FormLabel>
                                    <FormControl>
                                        <Input placeholder="120" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your weight in pounds.
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                    
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Age</FormLabel>
                                    <FormControl>
                                        <Input placeholder="20" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your age in years.
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                    
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select the gender you identify as." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="0">male</SelectItem>
                                            <SelectItem value="1">female</SelectItem>
                                            <SelectItem value="2">other</SelectItem>
                                            <SelectItem value="3">prefer not to specify</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        This is the gender you identify as.
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                    
                                )}
                                />
                    <Button type="submit" className="mx-8">Update Physique</Button>
                </form>
            </Form>
        </div>
    );
};

export default SettingsPhysiquePage;