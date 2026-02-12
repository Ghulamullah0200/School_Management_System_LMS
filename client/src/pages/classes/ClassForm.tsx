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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Schema
const classSchema = z.object({
    name: z.string().min(1, "Name is required"),
    classId: z.string().min(1, "Class ID is required"),
    section: z.string().min(1, "Section is required"),
    classTeacher: z.string().optional(),
});

type ClassFormValues = z.infer<typeof classSchema>;

export default function ClassForm() {
    const [match, params] = useRoute("/admin/classes/:id");
    const isEdit = match && params?.id !== "new";
    const classId = params?.id;
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<ClassFormValues>({
        resolver: zodResolver(classSchema),
        defaultValues: {
            name: "",
            classId: "",
            section: "",
            classTeacher: "",
        },
    });

    // Fetch Teachers for Select
    const { data: teachers } = useQuery<any[]>({
        queryKey: ["teachers"],
        queryFn: async () => {
            const res = await fetch("/api/teachers");
            if (!res.ok) throw new Error("Failed to fetch teachers");
            return res.json();
        },
    });

    // Fetch Class for Edit
    const { data: classData, isLoading } = useQuery({
        queryKey: ["class", classId],
        queryFn: async () => {
            const res = await fetch(`/api/classes/${classId}`);
            if (!res.ok) throw new Error("Failed to fetch class");
            return res.json();
        },
        enabled: !!isEdit,
    });

    useEffect(() => {
        if (classData) {
            form.reset({
                ...classData,
                classTeacher: classData.classTeacher?._id || classData.classTeacher
            });
        }
    }, [classData, form]);

    const mutation = useMutation({
        mutationFn: async (values: ClassFormValues) => {
            const url = isEdit ? `/api/classes/${classId}` : "/api/classes";
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
            queryClient.invalidateQueries({ queryKey: ["classes"] });
            toast({ title: "Success", description: `Class ${isEdit ? "updated" : "created"} successfully` });
            setLocation("/admin/classes");
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const onSubmit = (values: ClassFormValues) => {
        mutation.mutate(values);
    };

    if (isEdit && isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-8" />;

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? "Edit Class" : "Create New Class"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="classId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class ID (Auto)</FormLabel>
                                        <FormControl><Input {...field} placeholder="CLS-01" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="section" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Section</FormLabel>
                                        <FormControl><Input {...field} placeholder="A" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class Name</FormLabel>
                                    <FormControl><Input {...field} placeholder="Class 10" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="classTeacher" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class Teacher</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Teacher" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {teachers?.map((teacher) => (
                                                <SelectItem key={teacher._id} value={teacher._id}>{teacher.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setLocation("/admin/classes")}>Cancel</Button>
                                <Button type="submit" disabled={mutation.isPending}>
                                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEdit ? "Update Class" : "Create Class"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* TODO: Add Routine Management & Subject Assignment UI here later */}
        </div>
    );
}
