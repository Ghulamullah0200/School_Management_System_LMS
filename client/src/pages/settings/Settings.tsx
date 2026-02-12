import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Schema
const settingsSchema = z.object({
    instituteName: z.string().min(1, "Institute Name is required"),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    currentSession: z.string().min(1, "Session is required"),
    currency: z.string().min(1, "Currency is required"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function Settings() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            instituteName: "",
            address: "",
            phone: "",
            email: "",
            currentSession: "",
            currency: "USD",
        },
    });

    // Fetch Settings
    const { data: settingsData, isLoading } = useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            const res = await fetch("/api/settings");
            if (!res.ok) throw new Error("Failed to fetch settings");
            return res.json();
        },
    });

    useEffect(() => {
        if (settingsData) {
            form.reset(settingsData);
        }
    }, [settingsData, form]);

    const mutation = useMutation({
        mutationFn: async (values: SettingsFormValues) => {
            const res = await fetch("/api/settings", {
                method: "POST", // Using POST to update/create singleton
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Something went wrong");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            toast({ title: "Success", description: "Settings updated successfully" });
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const onSubmit = (values: SettingsFormValues) => {
        mutation.mutate(values);
    };

    if (isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-8" />;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Institute Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={form.control} name="instituteName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Institute Name</FormLabel>
                                    <FormControl><Input {...field} placeholder="Springfield High School" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="currentSession" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Academic Year</FormLabel>
                                        <FormControl><Input {...field} placeholder="2024-2025" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="currency" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency Symbol</FormLabel>
                                        <FormControl><Input {...field} placeholder="$" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="submit" disabled={mutation.isPending}>
                                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Settings
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
