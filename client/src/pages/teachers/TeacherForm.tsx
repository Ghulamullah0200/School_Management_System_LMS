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

// Schema for validation
const teacherSchema = z.object({
    teacherId: z.string().min(1, "Teacher ID is required"),
    name: z.string().min(2, "Name is required"),
    email: z.string().email(),
    phone: z.string().min(10, "Phone is required"),
    subject: z.string().min(1, "Subject is required"),
    salary: z.coerce.number().min(0, "Salary must be positive"),
    timings: z.object({
        start: z.string().min(1, "Start time required"),
        end: z.string().min(1, "End time required")
    }),
    qualification: z.string().optional(),
    address: z.string().optional(),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

export default function TeacherForm() {
    const [match, params] = useRoute("/admin/teachers/:id");
    const isEdit = match && params?.id !== "new";
    const teacherId = params?.id;
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<TeacherFormValues>({
        resolver: zodResolver(teacherSchema),
        defaultValues: {
            teacherId: "",
            name: "",
            email: "",
            phone: "",
            subject: "",
            salary: 0,
            timings: { start: "", end: "" },
            qualification: "",
            address: "",
        },
    });

    // Fetch Teacher for Edit
    const { data: teacherData, isLoading } = useQuery({
        queryKey: ["teacher", teacherId],
        queryFn: async () => {
            const res = await fetch(`/api/teachers/${teacherId}`);
            if (!res.ok) throw new Error("Failed to fetch teacher");
            return res.json();
        },
        enabled: !!isEdit,
    });

    useEffect(() => {
        if (teacherData) {
            form.reset(teacherData);
        }
    }, [teacherData, form]);

    const mutation = useMutation({
        mutationFn: async (values: TeacherFormValues) => {
            const url = isEdit ? `/api/teachers/${teacherId}` : "/api/teachers";
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
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            toast({ title: "Success", description: `Teacher ${isEdit ? "updated" : "created"} successfully` });
            setLocation("/admin/teachers");
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const onSubmit = (values: TeacherFormValues) => {
        mutation.mutate(values);
    };

    if (isEdit && isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-8" />;

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? "Edit Teacher" : "Add New Teacher"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="teacherId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teacher ID</FormLabel>
                                        <FormControl><Input {...field} placeholder="TCH-001" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="subject" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject Specialization</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input type="email" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="salary" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Basic Salary</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="timings.start" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Time</FormLabel>
                                        <FormControl><Input type="time" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="timings.end" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Time</FormLabel>
                                        <FormControl><Input type="time" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="qualification" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qualification</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setLocation("/admin/teachers")}>Cancel</Button>
                                <Button type="submit" disabled={mutation.isPending}>
                                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEdit ? "Update Teacher" : "Create Teacher"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
