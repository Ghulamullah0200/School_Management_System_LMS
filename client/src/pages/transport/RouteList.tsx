import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Loader2, Plus } from "lucide-react";

type Route = {
    _id: string;
    routeName: string;
    vehicleNumber: string;
    driverName: string;
    monthlyFee: number;
    students: any[];
};

export default function RouteList() {
    const { data: routes, isLoading } = useQuery<Route[]>({
        queryKey: ["routes"],
        queryFn: async () => {
            const res = await fetch("/api/transport");
            if (!res.ok) throw new Error("Failed to fetch routes");
            return res.json();
        },
    });

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Transport Routes</h1>
                <Link href="/admin/transport/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Route
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Routes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Route Name</TableHead>
                                <TableHead>Vehicle No</TableHead>
                                <TableHead>Driver</TableHead>
                                <TableHead>Fee</TableHead>
                                <TableHead>Students</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {routes?.map((route) => (
                                <TableRow key={route._id}>
                                    <TableCell className="font-medium">{route.routeName}</TableCell>
                                    <TableCell>{route.vehicleNumber}</TableCell>
                                    <TableCell>{route.driverName}</TableCell>
                                    <TableCell>{route.monthlyFee}</TableCell>
                                    <TableCell>{route.students?.length || 0}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
