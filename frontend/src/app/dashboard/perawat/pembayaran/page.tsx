"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Check, ChevronsUpDown, CreditCard, X } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/libs/utils";
import apiClient from "@/services/api.client";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { DashboardContent } from "../mainpr/page";

// Define schema for form validation
const paymentFormSchema = z.object({
    visitId: z.string().min(1, "Pilih kunjungan pasien"),
    paymentMethod: z.enum(["CASH", "TRANSFER", "CARD", "QRIS"], {
        errorMap: () => ({ message: "Pilih metode pembayaran" }),
    }),
    amount: z.coerce.number().min(1, "Total tagihan tidak valid"),
    paidAmount: z.coerce.number().min(1, "Jumlah bayar harus lebih dari 0"),
    notes: z.string().optional(),
}).refine((data) => data.paidAmount >= data.amount, {
    message: "Jumlah bayar kurang dari total tagihan",
    path: ["paidAmount"],
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface VisitOption {
    id: string;
    visitDate: string;
    patientName: string;
    totalCost: number;
    visitNumber: string;
}

export default function PaymentPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [visits, setVisits] = useState<VisitOption[]>([]);
    const [visitsLoading, setVisitsLoading] = useState(true);
    const [changeAmount, setChangeAmount] = useState<number | null>(null);

    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            amount: 0,
            paidAmount: 0,
            notes: "",
        },
    });

    // Watch values to calculate change
    const amount = form.watch("amount");
    const paidAmount = form.watch("paidAmount");

    useEffect(() => {
        if (paidAmount && amount) {
            setChangeAmount(Math.max(0, paidAmount - amount));
        } else {
            setChangeAmount(null);
        }
    }, [amount, paidAmount]);

    useEffect(() => {
        fetchPendingVisits();
    }, []);

    const fetchPendingVisits = async () => {
        try {
            setVisitsLoading(true);
            // Fetch visits that are COMPLETED but not yet PAID (implementation depends on backend API filters)
            // For now, fetching visits queues or similar. Since there's no specific endpoint for "unpaid visits" 
            // in the files I saw, I'll assume fetching general visits and filtering or using an existing endpoint.
            // Adjust this endpoint based on actual backend capabilities.
            // Using /doctor/visits endpoint as placeholder
            const response = await apiClient.get("/doctor/visits?status=COMPLETED");

            // Transform data to simple options
            // Access response.data.data.visits because the API returns { data: { visits: [], pagination: {} } }
            const visitsData = response.data.data.visits || [];
            const options = visitsData.map((v: any) => ({
                id: v.id,
                visitDate: v.visitDate,
                patientName: v.patient.fullName,
                totalCost: Number(v.totalCost) || 0, // Fallback if 0
                visitNumber: v.visitNumber
            }));
            setVisits(options);
        } catch (error) {
            console.error("Failed to fetch visits", error);
            toast({
                variant: "destructive",
                title: "Gagal memuat data",
                description: "Tidak dapat mengambil daftar kunjungan.",
            });
        } finally {
            setVisitsLoading(false);
        }
    };

    const onVisitSelect = (visitId: string) => {
        const selectedVisit = visits.find((v) => v.id === visitId);
        if (selectedVisit) {
            form.setValue("visitId", visitId);
            form.setValue("amount", selectedVisit.totalCost);
            // Reset paid amount when visit changes
            form.setValue("paidAmount", 0);
        }
    };

    async function onSubmit(data: PaymentFormValues) {
        console.log("=== PAYMENT SUBMISSION START ===");
        console.log("Form data:", data);

        try {
            setLoading(true);
            console.log("Sending payment to API...");
            const response = await apiClient.post("/payments", data);
            console.log("Payment response:", response);

            toast({
                title: "✅ Pembayaran Berhasil Dicatat",
                description: `Pembayaran sebesar Rp ${data.paidAmount.toLocaleString('id-ID')} telah dicatat. Komisi prosedur/layanan telah ditambahkan ke sistem.`,
                duration: 5000,
            });

            // Reset form
            form.reset({
                amount: 0,
                paidAmount: 0,
                notes: "",
                visitId: ""
            });
            setChangeAmount(null);

            // Refresh pending visits list
            fetchPendingVisits();

        } catch (error: any) {
            console.error("Payment error", error);
            toast({
                variant: "destructive",
                title: "Gagal memproses pembayaran",
                description: error.response?.data?.message || "Terjadi kesalahan pada server.",
            });
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="relative min-h-screen w-full">
            {/* Background Dashboard */}
            <div className="absolute inset-0 z-0 blur-[5px] opacity-80 pointer-events-none overflow-hidden h-screen w-full">
                <DashboardContent />
            </div>

            {/* Overlay */}
            <div className="fixed inset-0 bg-black/10 z-10" />

            {/* Form Container */}
            <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
                <Card className="border-white/40 bg-white/70 backdrop-blur-xl shadow-2xl w-full max-w-2xl">
                    <CardHeader className="border-b border-gray-100 pb-6 bg-white/50 rounded-t-xl relative">
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>

                        <CardTitle className="text-2xl font-bold text-pink-700 flex items-center gap-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                                <CreditCard className="h-6 w-6" />
                            </span>
                            Input Pembayaran
                        </CardTitle>
                        <CardDescription className="text-gray-500">
                            Catat pembayaran kunjungan pasien dengan mudah
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                {/* Visit Selection */}
                                <FormField
                                    control={form.control}
                                    name="visitId"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Pilih Kunjungan Pasien</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                            disabled={visitsLoading}
                                                        >
                                                            {field.value
                                                                ? visits.find((visit) => visit.id === field.value)?.patientName + " - " + visits.find((visit) => visit.id === field.value)?.visitNumber
                                                                : (visitsLoading ? "Memuat data..." : "Cari nama pasien atau nomor kunjungan...")}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="Cari pasien..." />
                                                        <CommandEmpty>Pasien tidak ditemukan.</CommandEmpty>
                                                        <CommandGroup className="max-h-64 overflow-y-auto">
                                                            {visits.map((visit) => (
                                                                <CommandItem
                                                                    value={`${visit.patientName} ${visit.visitNumber}`}
                                                                    key={visit.id}
                                                                    onSelect={() => {
                                                                        onVisitSelect(visit.id);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            visit.id === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium">{visit.patientName}</span>
                                                                        <span className="text-xs text-gray-500">{visit.visitNumber} - {format(new Date(visit.visitDate), "dd MMM yyyy")}</span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Total Amount (Editable) */}
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Tagihan (Rp)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="Masukkan total tagihan"
                                                    className="font-semibold"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Payment Method */}
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Metode Pembayaran</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih metode" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="CASH">Tunai (Cash)</SelectItem>
                                                    <SelectItem value="TRANSFER">Transfer Bank</SelectItem>
                                                    <SelectItem value="QRIS">QRIS</SelectItem>
                                                    <SelectItem value="CARD">Kartu Debit/Kredit</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Paid Amount */}
                                    <FormField
                                        control={form.control}
                                        name="paidAmount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Jumlah Bayar (Rp)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        {...field}
                                                        className="text-lg"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Change Amount (Display) */}
                                    <FormItem>
                                        <FormLabel>Kembalian (Rp)</FormLabel>
                                        <div className={cn(
                                            "flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 items-center font-bold text-lg",
                                            changeAmount !== null && changeAmount >= 0 ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500"
                                        )}>
                                            {changeAmount !== null ? changeAmount.toLocaleString('id-ID') : "-"}
                                        </div>
                                    </FormItem>
                                </div>

                                {/* Notes */}
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Catatan (Opsional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contoh: Lunas, DP, dll" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-6 text-lg shadow-md transition-all active:scale-[0.98]"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        "Simpan Pembayaran"
                                    )}
                                </Button>


                                {/* Info Box */}
                                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800 flex gap-3 items-start">
                                    <div className="bg-blue-100 p-2 rounded-full shrink-0">
                                        <Check className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Informasi</h4>
                                        <p>
                                            Pastikan total tagihan sudah sesuai dengan tindakan yang dilakukan dokter.
                                            Status kunjungan harus "Selesai" (COMPLETED) agar dapat dilakukan pembayaran.
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
