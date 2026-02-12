import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Exam = {
    _id: string;
    name: string;
    type: string;
    startDate: string;
    classes: { name: string }[];
};

export default function ExamList() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: exams, isLoading } = useQuery<Exam[]>({
        queryKey: ["exams"],
        queryFn: async () => {
            const res = await fetch("/api/exams");
            if (!res.ok) throw new Error("Failed to fetch exams");
            return res.json();
        },
    });

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Exams</h1>
                <Link href="/admin/exams/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Exam
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Exams</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Exam Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>Assigned Classes</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {exams?.map((exam) => (
                                <TableRow key={exam._id}>
                                    <TableCell className="font-medium">{exam.name}</TableCell>
                                    <TableCell>{exam.type}</TableCell>
                                    <TableCell>{new Date(exam.startDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{exam.classes?.map(c => c.name).join(", ") || "None"}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/exams/${exam._id}/marks`}>
                                                <Button variant="outline" size="sm">
                                                    Marks
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
