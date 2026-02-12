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
import { Loader2, Plus, Search, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Fee = {
    _id: string;
    voucherId: string;
    student: { name: string; class: { name: string } };
    amount: number;
    month: string;
    status: string;
    dueDate: string;
};

export default function FeeList() {
    const [search, setSearch] = useState("");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: fees, isLoading } = useQuery<Fee[]>({
        queryKey: ["fees"],
        queryFn: async () => {
            const res = await fetch("/api/accounting");
            if (!res.ok) throw new Error("Failed to fetch fees");
            return res.json();
        },
    });

    const payMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/accounting/${id}/pay`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentMethod: 'Cash' })
            });
            if (!res.ok) throw new Error("Failed to update status");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fees"] });
            toast({ title: "Success", description: "Fee marked as Paid" });
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const handlePay = (id: string) => {
        if (confirm("Mark this voucher as PAID?")) {
            payMutation.mutate(id);
        }
    };

    const filtered = fees?.filter(f =>
        f.student.name.toLowerCase().includes(search.toLowerCase()) ||
        f.voucherId.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Fee Vouchers</h1>
                <Link href="/admin/fees/generate">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Generate Voucher
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Vouchers</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by student or voucher ID..."
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
                                <TableHead>Voucher ID</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Month</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered?.map((fee) => (
                                <TableRow key={fee._id}>
                                    <TableCell className="font-medium">{fee.voucherId}</TableCell>
                                    <TableCell>{fee.student?.name}</TableCell>
                                    <TableCell>{fee.student?.class?.name}</TableCell>
                                    <TableCell>{fee.month}</TableCell>
                                    <TableCell>{fee.amount}</TableCell>
                                    <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${fee.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {fee.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {fee.status !== 'Paid' && (
                                            <Button size="sm" variant="outline" onClick={() => handlePay(fee._id)}>
                                                Mark Paid
                                            </Button>
                                        )}
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
