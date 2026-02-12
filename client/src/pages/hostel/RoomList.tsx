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

type Room = {
    _id: string;
    roomNumber: string;
    type: string;
    capacity: number;
    feePerMonth: number;
    occupants: any[];
};

export default function RoomList() {
    const { data: rooms, isLoading } = useQuery<Room[]>({
        queryKey: ["rooms"],
        queryFn: async () => {
            const res = await fetch("/api/hostel");
            if (!res.ok) throw new Error("Failed to fetch rooms");
            return res.json();
        },
    });

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Hostel Rooms</h1>
                <Link href="/admin/hostel/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Room
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Rooms</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room No</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead>Fee</TableHead>
                                <TableHead>Occupants</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rooms?.map((room) => (
                                <TableRow key={room._id}>
                                    <TableCell className="font-medium">{room.roomNumber}</TableCell>
                                    <TableCell>{room.type}</TableCell>
                                    <TableCell>{room.capacity}</TableCell>
                                    <TableCell>{room.feePerMonth}</TableCell>
                                    <TableCell>{room.occupants?.length || 0} / {room.capacity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
