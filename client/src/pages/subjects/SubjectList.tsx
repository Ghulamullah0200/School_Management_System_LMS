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
import { Loader2, Plus, Search, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Subject = {
    _id: string;
    name: string;
    code: string;
    credits: number;
    teachers: { _id: string; name: string }[];
};

export default function SubjectList() {
    const [search, setSearch] = useState("");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: subjects, isLoading } = useQuery<Subject[]>({
        queryKey: ["subjects"],
        queryFn: async () => {
            const res = await fetch("/api/subjects");
            if (!res.ok) throw new Error("Failed to fetch subjects");
            return res.json();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/subjects/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete subject");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
            toast({ title: "Success", description: "Subject deleted successfully" });
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this subject?")) {
            deleteMutation.mutate(id);
        }
    };

    const filtered = subjects?.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
                <Link href="/admin/subjects/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Subject
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Subjects ({subjects?.length || 0})</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or code..."
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
                                <TableHead>Code</TableHead>
                                <TableHead>Sample Name</TableHead>
                                <TableHead>Credits</TableHead>
                                <TableHead>Teachers</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered?.map((subject) => (
                                <TableRow key={subject._id}>
                                    <TableCell className="font-medium">{subject.code}</TableCell>
                                    <TableCell>{subject.name}</TableCell>
                                    <TableCell>{subject.credits}</TableCell>
                                    <TableCell>{subject.teachers?.map(t => t.name).join(", ") || "None"}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/subjects/${subject._id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(subject._id)}>
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
