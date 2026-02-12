import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Student = {
    _id: string;
    name: string;
    rollNo: string;
    // Temporary stats for UI
    status?: "Present" | "Absent" | "Late";
};

export default function AttendanceMark() {
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState<Record<string, string>>({});

    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch Classes
    const { data: classes } = useQuery<any[]>({
        queryKey: ["classes"],
        queryFn: async () => {
            const res = await fetch("/api/classes");
            if (!res.ok) throw new Error("Failed to fetch classes");
            return res.json();
        },
    });

    // Fetch Students for selected class
    const { data: students, isLoading: isLoadingStudents } = useQuery<Student[]>({
        queryKey: ["students", selectedClass],
        queryFn: async () => {
            const res = await fetch(`/api/students?classId=${selectedClass}`);
            if (!res.ok) throw new Error("Failed to fetch students");
            return res.json();
        },
        enabled: !!selectedClass,
    });

    // Initialize status as Present by default when students load
    // or fetch existing attendance if edit mode (not implemented fully for edit yet)
    const handleStatusChange = (studentId: string, status: string) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const mutation = useMutation({
        mutationFn: async () => {
            // Need a backend endpoint for batch attendance.
            // Assuming POST /api/attendance/batch exists or we use loop.
            // The implementation plan said: [ ] Build daily attendance marking UI
            // I need to ensure backend supports this. existing teacher.ts had /attendance route.
            // I'll use /api/attendance (implied new route, need to verify if I created it).
            // I created /api/attendance via student.ts/teacher.ts logic?
            // I verified models/Attendance.ts.
            // I checked routes/student.ts and it has GET attendance.
            // I need a POST attendance route.
            // I will assume I need to create it or simple use existing teacher route logic but adapting.
            // Actually I didn't create a dedicated `routes/attendance.ts`. I put attendance logic in `teacher.ts` (POST) and `student.ts` (GET).
            // I will use `/api/teachers/attendance` to mark? Or better create `routes/attendance.ts`?
            // `routes/teacher.ts` has `router.post('/attendance'...)`. I'll use that for now or move it.
            // Let's use `/api/teachers/attendance` for marking, even if admin does it. Or I should have consolidated.
            // I'll check `server/routes/teacher.ts` again. It expects `classId`, `attendanceData`, `markedById`.
            // `markedById` should be current user ID. I'll mock it or get from auth context.

            const payload = {
                classId: selectedClass,
                date: selectedDate,
                attendanceData: students?.map(s => ({
                    studentId: s._id,
                    status: attendance[s._id] || 'Present'
                })),
                markedById: "admin" // TODO: Get real ID
            };

            const res = await fetch("/api/teacher/attendance", { // Note: route prefix
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }
            return res.json();
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Attendance marked successfully" });
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    if (!classes) return <Loader2 className="h-8 w-8 animate-spin mx-auto" />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Mark Attendance</h1>
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

                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-[200px]"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {!selectedClass ? (
                        <div className="text-center py-8 text-muted-foreground">Please select a class to mark attendance.</div>
                    ) : isLoadingStudents ? (
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Roll No</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students?.map(student => (
                                        <TableRow key={student._id}>
                                            <TableCell>{student.rollNo}</TableCell>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant={attendance[student._id] === 'Present' || !attendance[student._id] ? 'default' : 'outline'}
                                                        className={attendance[student._id] === 'Present' || !attendance[student._id] ? 'bg-green-600 hover:bg-green-700' : ''}
                                                        onClick={() => handleStatusChange(student._id, 'Present')}
                                                    >
                                                        P
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={attendance[student._id] === 'Absent' ? 'default' : 'outline'}
                                                        className={attendance[student._id] === 'Absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                                                        onClick={() => handleStatusChange(student._id, 'Absent')}
                                                    >
                                                        A
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={attendance[student._id] === 'Late' ? 'default' : 'outline'}
                                                        className={attendance[student._id] === 'Late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                                                        onClick={() => handleStatusChange(student._id, 'Late')}
                                                    >
                                                        L
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="flex justify-end pt-4">
                                <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Attendance
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
