
import { useState, useEffect } from "react";
import { supabase } from "@/pages/integrations/supabase/client";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import {
    ShieldAlert, ShieldCheck, Search, Loader2, CreditCard, MessageSquarePlus, Trash2, Calendar, DollarSign, MoreVertical, Ban, CheckCircle2, AlertCircle
} from "lucide-react";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { ShopConfig } from "@/types/shop";

interface ShopRow extends ShopConfig { created_at: string; ownerName?: string; }

const Admin = () => {
    const [shops, setShops] = useState<ShopRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchShops = async () => {
        setLoading(true);
        console.log("Admin: Fetching shops...");
        const { data, error } = await supabase.from("shops").select("*, profiles(email)").order("created_at", { ascending: false });
        if (error) {
            toast.error("Failed to load shops");
            console.error("Fetch error:", error);
        } else {
            console.log(`Admin: Fetched ${data?.length || 0} shops.`);
            if (data && data.length > 0) console.table(data.map(s => ({ id: s.id, name: s.shop_name, user: s.user_id })));

            const mappedShops = (data || []).map((s: any) => ({
                ...s,
                shopName: s.shop_name,
                socialLinks: s.social_links || {},
                trialExtended: (s.social_links as any)?._trial_extended || false,
                email: s.email || s.profiles?.email || "No Email",
            }));
            setShops(mappedShops);
        }
        setLoading(false);
    };

    useEffect(() => { fetchShops(); }, []);

    const toggleBan = async (shop: ShopRow) => {
        setLoading(true);
        const currentStats = (shop.socialLinks as any)?._admin_status || "active";
        const newStatus = currentStats === "banned" ? "active" : "banned";
        const { error } = await supabase.from("shops").update({ social_links: { ...shop.socialLinks, _admin_status: newStatus } }).eq("id", shop.id);
        if (error) toast.error("Failed to update status"); else { toast.success(`Shop ${newStatus === "banned" ? "Banned" : "Activated"}`); fetchShops(); }
    };

    const toggleVerify = async (shop: ShopRow) => {
        setLoading(true);
        const newStatus = !(shop.socialLinks as any)._is_verified;
        const { error } = await supabase.from("shops").update({ social_links: { ...shop.socialLinks, _is_verified: newStatus } }).eq("id", shop.id);
        if (error) toast.error("Failed to update verification"); else { toast.success(`Shop ${newStatus ? "Verified" : "Unverified"}`); fetchShops(); }
    };

    const deleteShop = async (shop: any) => {
        const confirmMsg = `Are you sure you want to PERMANENTLY DELETE shop "${shop.shopName}"?\n\nThis will remove:\n- All Products & Categories\n- All Leads (Inquiries/Appointments)\n- The Seller Profile (Database)\n\nNote: The login credentials and storage files will remain in Supabase.`;
        if (!confirm(confirmMsg)) return;

        setLoading(true);
        try {
            const userId = shop.user_id;
            const shopId = shop.id;
            console.log(`[DELETION] Starting for Shop: ${shopId}, User: ${userId}`);

            // 1. Delete Inquiries
            const { error: inqErr } = await supabase.from("inquiries").delete().eq("shop_id", shopId);
            if (inqErr) console.warn("Inquiry deletion warning:", inqErr);

            // 2. Delete Appointments
            const { error: appErr } = await supabase.from("appointments").delete().eq("shop_id", shopId);
            if (appErr) console.warn("Appointment deletion warning:", appErr);

            // 3. Delete the Shop itself
            const { error: shopErr, count: shopCount } = await supabase.from("shops").delete({ count: 'exact' }).eq("id", shopId);
            if (shopErr) throw shopErr;
            console.log(`[DELETION] Shop record deleted. Count: ${shopCount}`);

            // 4. Delete the Profile
            if (userId) {
                const { error: profErr, count: profCount } = await supabase.from("profiles").delete({ count: 'exact' }).eq("id", userId);
                if (profErr) console.warn("Profile deletion warning:", profErr);
                console.log(`[DELETION] Profile records deleted. Count: ${profCount}`);
            }

            // SUCCESS FEEDBACK
            if (shopCount === 0 || shopCount === null) {
                console.error("[DELETION] Success reported, but count was 0 or null.");
                toast.error("Deletion might have failed at database level (0 rows affected).");
            } else {
                toast.success("Account and associated data have been permanently cleared.");
                // Update local state immediately for instant feedback
                setShops(prev => prev.filter(s => s.id !== shopId));
            }

            // Force a fresh fetch anyway
            setTimeout(() => fetchShops(), 500);

        } catch (e: any) {
            console.error("[DELETION] FATAL ERROR:", e);
            toast.error(`Deletion failed: ${e.message || "Unknown error"}. Check console.`);
        } finally {
            setLoading(false);
        }
    };

    const extendTrial = async (shop: ShopRow) => {
        setLoading(true);
        const { error } = await supabase.from("shops").update({ social_links: { ...shop.socialLinks, _trial_extended: true } }).eq("id", shop.id);
        if (error) toast.error("Failed to extend trial"); else { toast.success("Trial extended by 7 days"); fetchShops(); }
    };

    const togglePaid = async (shop: ShopRow) => {
        setLoading(true);
        const isCurrentlyPaid = (shop.socialLinks as any)._is_paid;
        const { error } = await supabase.from("shops").update({ social_links: { ...shop.socialLinks, _is_paid: !isCurrentlyPaid } }).eq("id", shop.id);
        if (error) toast.error("Failed to update payment status"); else { toast.success(isCurrentlyPaid ? "Status set to Unpaid" : "Status set to PAID"); fetchShops(); }
    };

    const filteredShops = shops.filter(s => s.shopName?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()) || s.phone?.includes(search));

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                            <ShieldAlert className="w-7 h-7 text-indigo-600" />
                            Admin Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">Manage shops, verification, and trials.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 bg-white border rounded-full shadow-sm text-xs font-semibold text-slate-600 flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                            {shops.length} Total Shops
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchShops} disabled={loading} className="bg-white">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
                        </Button>
                    </div>
                </header>

                <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search name, email, or phone..." className="pl-9 bg-slate-50 border-none h-10 ring-offset-indigo-600" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
                                    <TableHead className="w-[300px] font-semibold text-slate-900">Shop Profile</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Contact</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Status</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Billing / Trial</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Requests</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-900 pr-6">Manage</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && shops.length === 0 ? (
                                    <TableRow><TableCell colSpan={6} className="h-64 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 opacity-20" /> Loading database...</TableCell></TableRow>
                                ) : filteredShops.length === 0 ? (
                                    <TableRow><TableCell colSpan={6} className="h-64 text-center text-muted-foreground">No shops found matching your search.</TableCell></TableRow>
                                ) : filteredShops.map((shop) => {
                                    const daysSinceCreation = differenceInDays(new Date(), new Date(shop.created_at));
                                    const isPaid = (shop.socialLinks as any)._is_paid;
                                    const totalTrialDays = (shop.socialLinks as any)._trial_extended ? 14 : 7;
                                    const trialDaysLeft = totalTrialDays - daysSinceCreation;
                                    const isTrialExpired = !isPaid && trialDaysLeft <= 0;
                                    const isBanned = (shop.socialLinks as any)?._admin_status === "banned";
                                    const isVerified = (shop.socialLinks as any)?._is_verified;
                                    const nfcRequests = (shop.socialLinks as any)?._nfc_requests || [];
                                    const feedbacks = (shop.socialLinks as any)?._feedbacks || [];
                                    const hasPendingNFC = nfcRequests.some((r: any) => r.status === 'pending');
                                    const hasNewFeedback = feedbacks.some((f: any) => f.status === 'new');

                                    return (
                                        <TableRow key={shop.id} className={`${isBanned ? "bg-red-50/30 text-red-900" : "hover:bg-slate-50/80"} transition-colors border-slate-100`}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${isBanned ? "bg-red-100 text-red-600" : "bg-indigo-100 text-indigo-600"}`}>
                                                        {shop.shopName?.[0]?.toUpperCase() || "?"}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                                                            {shop.shopName || "Unnamed Shop"}
                                                            {isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                                                        </span>
                                                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            Joined {format(new Date(shop.created_at), "MMM d, yyyy")}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-medium">{shop.phone || "No Phone"}</span>
                                                    <span className="text-[11px] text-muted-foreground">{shop.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {isBanned ? (
                                                        <Badge variant="destructive" className="px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-wider">Banned</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                                                    )}
                                                    {isVerified && <Badge className="px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Verified</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {isPaid ? (
                                                    <Badge className="bg-emerald-500 text-white border-none px-2 py-1">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Lifetime Access
                                                    </Badge>
                                                ) : isTrialExpired ? (
                                                    <div className="flex items-center gap-1.5 text-red-500">
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span className="text-xs font-bold uppercase">Expired</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500">
                                                            <span>Trial</span>
                                                            <span>{trialDaysLeft}d left</span>
                                                        </div>
                                                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(trialDaysLeft / totalTrialDays) * 100}%` }}></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    {hasPendingNFC && (
                                                        <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 relative" title="Pending NFC Request">
                                                            <CreditCard className="w-4 h-4" />
                                                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-600 rounded-full border-2 border-white"></span>
                                                        </div>
                                                    )}
                                                    {hasNewFeedback && (
                                                        <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 relative" title="New Feedback">
                                                            <MessageSquarePlus className="w-4 h-4" />
                                                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-600 rounded-full border-2 border-white"></span>
                                                        </div>
                                                    )}
                                                    {!hasPendingNFC && !hasNewFeedback && <span className="text-slate-300 text-xs">-</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => toggleVerify(shop)}>
                                                            <ShieldCheck className="w-4 h-4 mr-2" />
                                                            {isVerified ? "Unverify Shop" : "Verify Shop"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => extendTrial(shop)} disabled={(shop.socialLinks as any)._trial_extended || isPaid}>
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            Extend Trial (+7d)
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => togglePaid(shop)} className={isPaid ? "text-slate-500" : "text-green-600 font-bold"}>
                                                            <DollarSign className="w-4 h-4 mr-2" />
                                                            {isPaid ? "Set as Unpaid" : "Mark as Paid"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => toggleBan(shop)} className={isBanned ? "text-indigo-600" : "text-orange-600"}>
                                                            <Ban className="w-4 h-4 mr-2" />
                                                            {isBanned ? "Lift Ban" : "Ban Shop"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => deleteShop(shop)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete Account
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
