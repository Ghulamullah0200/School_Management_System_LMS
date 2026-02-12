import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ExamMarksEntry() {
    const [match, params] = useRoute("/admin/exams/:id/marks");
    const examId = params?.id;
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [marks, setMarks] = useState<Record<string, number>>({});

    const { toast } = useToast();

    // Fetch Exam Details
    const { data: exam } = useQuery({
        queryKey: ["exam", examId],
        queryFn: async () => {
            // Assuming GET /api/exams/:id exists? If not, need to implement or mock
            // The exams list route returns all exams, maybe filter?
            // I will use /api/exams/ which returns all, and find by id on client for now to avoid complexity
            const res = await fetch("/api/exams");
            const allExams = await res.json();
            return allExams.find((e: any) => e._id === examId);
        }
    });

    // Fetch Classes
    const { data: classes } = useQuery<any[]>({
        queryKey: ["classes"],
        queryFn: async () => {
            const res = await fetch("/api/classes");
            if (!res.ok) throw new Error("Failed to fetch classes");
            return res.json();
        },
    });

    // Fetch Subjects (for selected class? Or all subjects?)
    // Ideally fetch subjects assigned to the class.
    // For now fetch all subjects
    const { data: subjects } = useQuery<any[]>({
        queryKey: ["subjects"],
        queryFn: async () => {
            const res = await fetch("/api/subjects");
            return res.json();
        }
    });

    // Fetch Students for selected class
    const { data: students, isLoading: isLoadingStudents } = useQuery<any[]>({
        queryKey: ["students", selectedClass],
        queryFn: async () => {
            const res = await fetch(`/api/students?classId=${selectedClass}`);
            if (!res.ok) throw new Error("Failed to fetch students");
            return res.json();
        },
        enabled: !!selectedClass,
    });

    const handleMarkChange = (studentId: string, value: string) => {
        setMarks(prev => ({ ...prev, [studentId]: Number(value) }));
    };

    const mutation = useMutation({
        mutationFn: async () => {
            // Post marks individually or batch
            // Using batch loop for simplicity based on backend exam.ts: 
            // router.post('/marks', ...) -> accepts single mark object.
            // Need to loop promises.
            if (!selectedClass || !selectedSubject) throw new Error("Select Class and Subject");

            const promises = students?.map(student => {
                const markValue = marks[student._id];
                if (markValue === undefined) return Promise.resolve();

                return fetch("/api/exams/marks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        exam: examId,
                        student: student._id,
                        class: selectedClass,
                        subject: selectedSubject,
                        marksObtained: markValue,
                        totalMarks: 100, // Default 100 for now
                        examType: exam?.type || 'Quiz'
                    })
                });
            }) || [];

            await Promise.all(promises);
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Marks saved successfully" });
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    if (!exam) return <Loader2 className="h-8 w-8 animate-spin mx-auto" />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Enter Marks: {exam.name}</h1>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex gap-4 items-center">
                        <Select onValueChange={setSelectedClass} value={selectedClass}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes?.map(cls => (
                                    <SelectItem key={cls._id} value={cls._id}>{cls.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select onValueChange={setSelectedSubject} value={selectedSubject}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects?.map(sub => (
                                    <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {!selectedClass || !selectedSubject ? (
                        <div className="text-center py-8 text-muted-foreground">Select Class and Subject to enter marks.</div>
                    ) : isLoadingStudents ? (
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Roll No</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Marks (Out of 100)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students?.map(student => (
                                        <TableRow key={student._id}>
                                            <TableCell>{student.rollNo}</TableCell>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    className="w-24"
                                                    onChange={(e) => handleMarkChange(student._id, e.target.value)}
                                                    placeholder="0"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="flex justify-end pt-4">
                                <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Marks
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
