import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useRoute } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const roomSchema = z.object({
    roomNumber: z.string().min(1, "Room Number is required"),
    type: z.enum(['Single', 'Double', 'Dormitory']),
    capacity: z.coerce.number().min(1),
    feePerMonth: z.coerce.number().min(0),
    amenities: z.string().optional(),
});

type RoomFormValues = z.infer<typeof roomSchema>;

export default function RoomForm() {
    const [match, params] = useRoute("/admin/hostel/:id");
    const isEdit = match && params?.id !== "new";
    const roomId = params?.id;
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<RoomFormValues>({
        resolver: zodResolver(roomSchema),
        defaultValues: {
            roomNumber: "",
            type: "Double",
            capacity: 2,
            feePerMonth: 0,
            amenities: "",
        },
    });

    // Fetch Room for Edit
    const { data: roomData, isLoading } = useQuery({
        queryKey: ["room", roomId],
        queryFn: async () => {
            const res = await fetch(`/api/hostel/${roomId}`);
            if (!res.ok) throw new Error("Failed to fetch room");
            return res.json();
        },
        enabled: !!isEdit,
    });

    useEffect(() => {
        if (roomData) {
            form.reset({
                ...roomData,
                amenities: roomData.amenities?.join(', ')
            });
        }
    }, [roomData, form]);

    const mutation = useMutation({
        mutationFn: async (values: RoomFormValues) => {
            const url = isEdit ? `/api/hostel/${roomId}` : "/api/hostel";
            const method = isEdit ? "PUT" : "POST";

            const payload = {
                ...values,
                amenities: values.amenities?.split(',').map(s => s.trim()).filter(Boolean) || []
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Something went wrong");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            toast({ title: "Success", description: `Room ${isEdit ? "updated" : "created"} successfully` });
            setLocation("/admin/hostel");
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const onSubmit = (values: RoomFormValues) => {
        mutation.mutate(values);
    };

    if (isEdit && isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-8" />;

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? "Edit Room" : "Add New Room"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="roomNumber" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room Number</FormLabel>
                                        <FormControl><Input {...field} placeholder="101" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="type" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Single">Single</SelectItem>
                                                <SelectItem value="Double">Double</SelectItem>
                                                <SelectItem value="Dormitory">Dormitory</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="capacity" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capacity</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="feePerMonth" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fee Per Month</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="amenities" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amenities (comma separated)</FormLabel>
                                    <FormControl><Input {...field} placeholder="Wifi, AC, Attached Bath" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setLocation("/admin/hostel")}>Cancel</Button>
                                <Button type="submit" disabled={mutation.isPending}>
                                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEdit ? "Update Room" : "Create Room"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
