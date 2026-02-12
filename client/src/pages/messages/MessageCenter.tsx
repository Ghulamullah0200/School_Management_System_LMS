import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Send, RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const messageSchema = z.object({
    recipientType: z.enum(['student', 'teacher', 'admin']),
    recipientId: z.string().min(1, "Recipient is required"),
    subject: z.string().min(1, "Subject is required"),
    content: z.string().min(1, "Message is required"),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export default function MessageCenter() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("inbox");
    const [recipientType, setRecipientType] = useState('student');

    const form = useForm<MessageFormValues>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            recipientType: "student",
            recipientId: "",
            subject: "",
            content: "",
        },
    });

    // Fetch Users for Recipient (Mocked or Real)
    // Need users to select. We have /api/students and /api/teachers
    const { data: students } = useQuery<any[]>({
        queryKey: ["students"],
        queryFn: async () => (await fetch("/api/students")).json(),
        enabled: recipientType === 'student'
    });
    const { data: teachers } = useQuery<any[]>({
        queryKey: ["teachers"],
        queryFn: async () => (await fetch("/api/teachers")).json(),
        enabled: recipientType === 'teacher'
    });

    // Fetch Messages
    const { data: messages, isLoading } = useQuery<any[]>({
        queryKey: ["messages", activeTab],
        queryFn: async () => {
            // Need a way to filter inbox/sent. Assuming backend defaults or filter param
            // Assuming the current user ID is handled by session/cookie in backend
            // Mocking: backend returns all for now maybe?
            const res = await fetch(`/api/messages`);
            return res.json();
        }
    });


    const mutation = useMutation({
        mutationFn: async (values: MessageFormValues) => {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, senderId: "current_user_id" }), // Backend should handle sender
            });

            if (!res.ok) {
                throw new Error("Failed to send message");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["messages"] });
            toast({ title: "Success", description: "Message sent successfully" });
            form.reset();
            setActiveTab("sent");
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
        },
    });

    const onSubmit = (values: MessageFormValues) => {
        mutation.mutate(values);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            </div>

            <Tabs defaultValue="inbox" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="inbox">Inbox</TabsTrigger>
                    <TabsTrigger value="compose">Compose</TabsTrigger>
                    <TabsTrigger value="sent">Sent Items</TabsTrigger>
                </TabsList>

                <TabsContent value="inbox">
                    <Card>
                        <CardHeader><CardTitle>Inbox</CardTitle></CardHeader>
                        <CardContent>
                            {/* Placeholder for inbox */}
                            <div className="text-center py-8 text-muted-foreground">No new messages</div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sent">
                    <Card>
                        <CardHeader><CardTitle>Sent Messages</CardTitle></CardHeader>
                        <CardContent>
                            {/* Placeholder for sent */}
                            <div className="text-center py-8 text-muted-foreground">No sent messages</div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="compose">
                    <Card>
                        <CardHeader>
                            <CardTitle>Compose Message</CardTitle>
                            <CardDescription>Send a message to a student, teacher, or parent.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="recipientType" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Recipient Type</FormLabel>
                                                <Select onValueChange={(val) => { field.onChange(val); setRecipientType(val); }} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="student">Student</SelectItem>
                                                        <SelectItem value="teacher">Teacher</SelectItem>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="recipientId" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Recipient</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={recipientType === 'admin'}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select User" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {recipientType === 'student' && students?.map(s => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
                                                        {recipientType === 'teacher' && teachers?.map(t => <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>)}
                                                        {recipientType === 'admin' && <SelectItem value="admin">Admin</SelectItem>}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>

                                    <FormField control={form.control} name="subject" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="content" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Message</FormLabel>
                                            <FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={mutation.isPending}>
                                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            <Send className="mr-2 h-4 w-4" /> Send Message
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
