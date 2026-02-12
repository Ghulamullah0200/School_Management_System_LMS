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
import { Loader2, Plus, Search, Trash2, Edit, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Teacher = {
    _id: string;
    teacherId: string;
    name: string;
    subject: string;
    phone: string;
    email: string;
    isActive: boolean;
};

export default function TeacherList() {
    const [search, setSearch] = useState("");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: teachers, isLoading } = useQuery<Teacher[]>({
        queryKey: ["teachers"],
        queryFn: async () => {
            const res = await fetch("/api/teachers");
            if (!res.ok) throw new Error("Failed to fetch teachers");
            return res.json();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/teachers/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete teacher");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            toast({ title: "Success", description: "Teacher deleted successfully" });
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this teacher?")) {
            deleteMutation.mutate(id);
        }
    };

    const filtered = teachers?.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.location.href = '/api/teachers/export'}>
                        <FileDown className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Link href="/admin/teachers/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Teacher
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Teachers ({teachers?.length || 0})</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or subject..."
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
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered?.map((teacher) => (
                                <TableRow key={teacher._id}>
                                    <TableCell className="font-medium">{teacher.teacherId}</TableCell>
                                    <TableCell>{teacher.name}</TableCell>
                                    <TableCell>{teacher.subject}</TableCell>
                                    <TableCell>{teacher.email}</TableCell>
                                    <TableCell>{teacher.phone}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/teachers/${teacher._id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(teacher._id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
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
