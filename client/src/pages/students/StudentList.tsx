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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Search, Upload, FileDown, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Student = {
    _id: string;
    studentId: string;
    name: string;
    fatherName: string;
    class: { _id: string; name: string } | null;
    section: string;
    rollNo: string;
    contact: string;
    feeStatus: string;
    isActive: boolean;
};

export default function StudentList() {
    const [search, setSearch] = useState("");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: students, isLoading } = useQuery<Student[]>({
        queryKey: ["students"],
        queryFn: async () => {
            const res = await fetch("/api/students");
            if (!res.ok) throw new Error("Failed to fetch students");
            return res.json();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete student");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
            toast({ title: "Success", description: "Student deleted successfully" });
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const filteredStudents = students?.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.toLowerCase().includes(search.toLowerCase())
    );

    const handleImport = () => {
        // Placeholder for CSV import logic
        toast({ title: "Info", description: "CSV Import feature coming soon" });
    };

    const handleExport = () => {
        window.location.href = '/api/students/export';
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this student?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <FileDown className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Button variant="outline" onClick={handleImport}>
                        <Upload className="mr-2 h-4 w-4" /> Import CSV
                    </Button>
                    <Link href="/admin/students/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Student
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Students ({students?.length || 0})</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Section</TableHead>
                                <TableHead>Roll No</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents?.map((student) => (
                                <TableRow key={student._id}>
                                    <TableCell className="font-medium">{student.studentId}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.class?.name || "N/A"}</TableCell>
                                    <TableCell>{student.section}</TableCell>
                                    <TableCell>{student.rollNo}</TableCell>
                                    <TableCell>{student.contact}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${student.feeStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {student.feeStatus}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/students/${student._id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(student._id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredStudents?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        No students found using this filter.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
