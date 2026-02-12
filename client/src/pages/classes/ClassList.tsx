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
import { Loader2, Plus, Search, Trash2, Edit, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ClassModel = {
    _id: string;
    name: string;
    section: string;
    classTeacher: { name: string } | null;
    students: string[]; // IDs
};

export default function ClassList() {
    const [search, setSearch] = useState("");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: classes, isLoading } = useQuery<ClassModel[]>({
        queryKey: ["classes"],
        queryFn: async () => {
            const res = await fetch("/api/classes");
            if (!res.ok) throw new Error("Failed to fetch classes");
            return res.json();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/classes/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete class");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] });
            toast({ title: "Success", description: "Class deleted successfully" });
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this class?")) {
            deleteMutation.mutate(id);
        }
    };

    const filtered = classes?.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
                <Link href="/admin/classes/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Class
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Classes ({classes?.length || 0})</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name..."
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
                                <TableHead>Class Name</TableHead>
                                <TableHead>Section</TableHead>
                                <TableHead>Class Teacher</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered?.map((cls) => (
                                <TableRow key={cls._id}>
                                    <TableCell className="font-medium">{cls.name}</TableCell>
                                    <TableCell>{cls.section}</TableCell>
                                    <TableCell>{cls.classTeacher?.name || "Unassigned"}</TableCell>
                                    <TableCell>{cls.students?.length || 0}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/classes/${cls._id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(cls._id)}>
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
