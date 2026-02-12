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

// Schema
const subjectSchema = z.object({
    name: z.string().min(2, "Name is required"),
    code: z.string().min(2, "Code is required"),
    credits: z.coerce.number().min(0),
    description: z.string().optional(),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

export default function SubjectForm() {
    const [match, params] = useRoute("/admin/subjects/:id");
    const isEdit = match && params?.id !== "new";
    const subjectId = params?.id;
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<SubjectFormValues>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            name: "",
            code: "",
            credits: 0,
            description: "",
        },
    });

    // Fetch Subject for Edit
    const { data: subjectData, isLoading } = useQuery({
        queryKey: ["subject", subjectId],
        queryFn: async () => {
            const res = await fetch(`/api/subjects/${subjectId}`);
            if (!res.ok) throw new Error("Failed to fetch subject");
            return res.json();
        },
        enabled: !!isEdit,
    });

    useEffect(() => {
        if (subjectData) {
            form.reset(subjectData);
        }
    }, [subjectData, form]);

    const mutation = useMutation({
        mutationFn: async (values: SubjectFormValues) => {
            const url = isEdit ? `/api/subjects/${subjectId}` : "/api/subjects";
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
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
            toast({ title: "Success", description: `Subject ${isEdit ? "updated" : "created"} successfully` });
            setLocation("/admin/subjects");
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const onSubmit = (values: SubjectFormValues) => {
        mutation.mutate(values);
    };

    if (isEdit && isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-8" />;

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? "Edit Subject" : "Add New Subject"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="code" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject Code</FormLabel>
                                        <FormControl><Input {...field} placeholder="MATH-101" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="credits" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Credits</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject Name</FormLabel>
                                    <FormControl><Input {...field} placeholder="Mathematics" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setLocation("/admin/subjects")}>Cancel</Button>
                                <Button type="submit" disabled={mutation.isPending}>
                                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEdit ? "Update Subject" : "Create Subject"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
