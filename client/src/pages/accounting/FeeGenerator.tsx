import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
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

// Schema (Simplified for single voucher)
const feeSchema = z.object({
    student: z.string().min(1, "Student is required"),
    type: z.enum(['Tuition', 'Transport', 'Hostel', 'Exam', 'Other']),
    month: z.string().min(1, "Month is required"),
    amount: z.coerce.number().min(1),
    dueDate: z.string().min(1),
});

type FeeFormValues = z.infer<typeof feeSchema>;

export default function FeeGenerator() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedClass, setSelectedClass] = useState("");

    const form = useForm<FeeFormValues>({
        resolver: zodResolver(feeSchema),
        defaultValues: {
            student: "",
            type: "Tuition",
            month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
            amount: 0,
            dueDate: "",
        },
    });

    const { data: classes } = useQuery<any[]>({
        queryKey: ["classes"],
        queryFn: async () => (await fetch("/api/classes")).json(),
    });

    const { data: students } = useQuery<any[]>({
        queryKey: ["students", selectedClass],
        queryFn: async () => (await fetch(`/api/students?classId=${selectedClass}`)).json(),
        enabled: !!selectedClass,
    });

    const mutation = useMutation({
        mutationFn: async (values: FeeFormValues) => {
            // Need to add voucherId (auto gen mock) and class
            const studentObj = students?.find(s => s._id === values.student);

            const payload = {
                ...values,
                class: studentObj?.class?._id || studentObj?.class,
                voucherId: `V-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                status: 'Unpaid'
            };

            const res = await fetch("/api/accounting/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Something went wrong");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fees"] });
            toast({ title: "Success", description: "Voucher generated successfully" });
            setLocation("/admin/fees");
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const onSubmit = (values: FeeFormValues) => {
        mutation.mutate(values);
    };

    return (
        <div className="max-w-xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Generate Fee Voucher</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            <FormItem>
                                <FormLabel>Filter Class (to find student)</FormLabel>
                                <Select onValueChange={setSelectedClass} value={selectedClass}>
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
                            </FormItem>

                            <FormField control={form.control} name="student" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedClass}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Student" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {students?.map((s) => (
                                                <SelectItem key={s._id} value={s._id}>{s.name} ({s.rollNo})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="type" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Tuition">Tuition</SelectItem>
                                                <SelectItem value="Transport">Transport</SelectItem>
                                                <SelectItem value="Hostel">Hostel</SelectItem>
                                                <SelectItem value="Exam">Exam</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="amount" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="month" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Month</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="dueDate" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Date</FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setLocation("/admin/fees")}>Cancel</Button>
                                <Button type="submit" disabled={mutation.isPending}>
                                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Generate
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
