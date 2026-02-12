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

// Schema for validation
const studentSchema = z.object({
    studentId: z.string().min(1, "Student ID is required"),
    name: z.string().min(2, "Name is required"),
    fatherName: z.string().min(2, "Father Name is required"),
    class: z.string().min(1, "Class is required"),
    section: z.string().min(1, "Section is required"),
    rollNo: z.string().min(1, "Roll No is required"),
    contact: z.string().min(10, "Contact must be valid"),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
    gender: z.enum(["Male", "Female", "Other"]),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export default function StudentForm() {
    const [match, params] = useRoute("/admin/students/:id");
    const isEdit = match && params?.id !== "new";
    const studentId = params?.id;
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<StudentFormValues>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            studentId: "",
            name: "",
            fatherName: "",
            class: "",
            section: "",
            rollNo: "",
            contact: "",
            email: "",
            address: "",
            gender: "Male",
        },
    });

    // Fetch Classes for Select
    const { data: classes } = useQuery<any[]>({
        queryKey: ["classes"],
        queryFn: async () => {
            const res = await fetch("/api/classes");
            if (!res.ok) throw new Error("Failed to fetch classes");
            return res.json();
        },
    });

    // Fetch Student for Edit
    const { data: studentData, isLoading: isLoadingStudent } = useQuery({
        queryKey: ["student", studentId],
        queryFn: async () => {
            const res = await fetch(`/api/students/${studentId}`);
            if (!res.ok) throw new Error("Failed to fetch student");
            return res.json();
        },
        enabled: !!isEdit,
    });

    useEffect(() => {
        if (studentData) {
            form.reset({
                ...studentData,
                class: studentData.class?._id || studentData.class, // Handle populated or ID
            });
        }
    }, [studentData, form]);

    const mutation = useMutation({
        mutationFn: async (values: StudentFormValues) => {
            const url = isEdit ? `/api/students/${studentId}` : "/api/students";
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
            queryClient.invalidateQueries({ queryKey: ["students"] });
            toast({ title: "Success", description: `Student ${isEdit ? "updated" : "created"} successfully` });
            setLocation("/admin/students");
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const onSubmit = (values: StudentFormValues) => {
        mutation.mutate(values);
    };

    if (isEdit && isLoadingStudent) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-8" />;

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? "Edit Student" : "Add New Student"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="studentId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student ID</FormLabel>
                                        <FormControl><Input {...field} placeholder="STU-2024-001" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="rollNo" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Roll No</FormLabel>
                                        <FormControl><Input {...field} placeholder="01" /></FormControl>
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
                                <FormField control={form.control} name="fatherName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Father's Name</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="class" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Class" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {classes?.map((cls) => (
                                                    <SelectItem key={cls._id} value={cls._id}>{cls.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="section" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Section</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="gender" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Gender" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="contact" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Number</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email (Optional)</FormLabel>
                                    <FormControl><Input type="email" {...field} /></FormControl>
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
                                <Button type="button" variant="outline" onClick={() => setLocation("/admin/students")}>Cancel</Button>
                                <Button type="submit" disabled={mutation.isPending}>
                                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEdit ? "Update Student" : "Create Student"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
