import { useState, useEffect } from "react";
import { supabase } from "@/pages/integrations/supabase/client";
import { startOfDay } from "date-fns";
import { Badge } from "@/ui/badge";

interface StatsCardProps {
    shopId: string;
}

export const TodayInquiriesCount = ({ shopId }: StatsCardProps) => {
    const [count, setCount] = useState(0);

    const fetchStats = async () => {
        if (!shopId) return;
        const today = startOfDay(new Date()).toISOString();
        const { count: c } = await supabase
            .from("inquiries")
            .select("*", { count: "exact", head: true })
            .eq("shop_id", shopId)
            .gte("created_at", today);
        setCount(c || 0);
    };

    useEffect(() => {
        fetchStats();
        const channel = supabase.channel('inquiries-today-count')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'inquiries' }, fetchStats)
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [shopId]);

    if (count === 0) return null;

    return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 ml-auto">
            Today: {count}
        </Badge>
    );
};

export const TodayAppointmentsCount = ({ shopId }: StatsCardProps) => {
    const [count, setCount] = useState(0);

    const fetchStats = async () => {
        if (!shopId) return;
        const today = startOfDay(new Date()).toISOString();
        const { count: c } = await supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .eq("shop_id", shopId)
            .gte("created_at", today);
        setCount(c || 0);
    };

    useEffect(() => {
        fetchStats();
        const channel = supabase.channel('appointments-today-count')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'appointments' }, fetchStats)
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [shopId]);

    if (count === 0) return null;

    return (
        <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100 ml-auto">
            Today: {count}
        </Badge>
    );
};
