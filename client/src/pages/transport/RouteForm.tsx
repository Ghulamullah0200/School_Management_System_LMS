import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useRoute } from "wouter";
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

const routeSchema = z.object({
    routeName: z.string().min(1, "Route Name is required"),
    vehicleNumber: z.string().min(1, "Vehicle Number is required"),
    driverName: z.string().min(1, "Driver Name is required"),
    driverPhone: z.string().min(1, "Driver Phone is required"),
    monthlyFee: z.coerce.number().min(0, "Fee must be positive"),
});

type RouteFormValues = z.infer<typeof routeSchema>;

export default function RouteForm() {
    const [match, params] = useRoute("/admin/transport/:id");
    const isEdit = match && params?.id !== "new";
    const routeId = params?.id;
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<RouteFormValues>({
        resolver: zodResolver(routeSchema),
        defaultValues: {
            routeName: "",
            vehicleNumber: "",
            driverName: "",
            driverPhone: "",
            monthlyFee: 0,
        },
    });

    // Fetch Route for Edit
    const { data: routeData, isLoading } = useQuery({
        queryKey: ["route", routeId],
        queryFn: async () => {
            const res = await fetch(`/api/transport/${routeId}`);
            if (!res.ok) throw new Error("Failed to fetch route");
            return res.json();
        },
        enabled: !!isEdit,
    });

    useEffect(() => {
        if (routeData) {
            form.reset(routeData);
        }
    }, [routeData, form]);

    const mutation = useMutation({
        mutationFn: async (values: RouteFormValues) => {
            const url = isEdit ? `/api/transport/${routeId}` : "/api/transport";
            const method = isEdit ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
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
            queryClient.invalidateQueries({ queryKey: ["routes"] });
            toast({ title: "Success", description: `Route ${isEdit ? "updated" : "created"} successfully` });
            setLocation("/admin/transport");
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const onSubmit = (values: RouteFormValues) => {
        mutation.mutate(values);
    };

    if (isEdit && isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-8" />;

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? "Edit Route" : "Add New Route"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={form.control} name="routeName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Route Name/Area</FormLabel>
                                    <FormControl><Input {...field} placeholder="North City Route" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="vehicleNumber" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vehicle Number</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="monthlyFee" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Monthly Fee</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="driverName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Driver Name</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="driverPhone" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Driver Phone</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setLocation("/admin/transport")}>Cancel</Button>
                                <Button type="submit" disabled={mutation.isPending}>
                                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEdit ? "Update Route" : "Create Route"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
