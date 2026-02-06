import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/pages/integrations/supabase/client";
import { toast } from "sonner";

export interface Inquiry {
    id: string;
    shop_id: string;
    name: string;
    email?: string;
    phone: string;
    message: string;
    status: 'new' | 'responded' | 'resolved' | 'archived';
    created_at: string;
}

export interface Appointment {
    id: string;
    shop_id: string;
    name: string;
    email?: string;
    phone: string;
    service?: string;
    preferred_date: string;
    preferred_time: string;
    notes?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    created_at: string;
}

export const useLeads = (shopId: string | undefined) => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLeads = useCallback(async () => {
        if (!shopId) return;
        setLoading(true);
        try {
            // Fetch Inquiries
            const { data: inqData, error: inqError } = await supabase
                .from('inquiries')
                .select('*')
                .eq('shop_id', shopId)
                .order('created_at', { ascending: false });

            if (inqError) throw inqError;
            setInquiries((inqData as any[]) || []);

            // Fetch Appointments
            const { data: apptData, error: apptError } = await supabase
                .from('appointments')
                .select('*')
                .eq('shop_id', shopId)
                .order('created_at', { ascending: false });

            if (apptError) throw apptError;
            setAppointments((apptData as any[]) || []);
        } catch (error: any) {
            console.error("Error fetching leads:", error);
            toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    }, [shopId]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const updateInquiryStatus = async (id: string, status: Inquiry['status']) => {
        try {
            const { error } = await supabase
                .from('inquiries')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
            toast.success("Inquiry updated");
        } catch (error) {
            toast.error("Failed to update inquiry");
        }
    };

    const deleteInquiry = async (id: string) => {
        try {
            const { error } = await supabase
                .from('inquiries')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setInquiries(prev => prev.filter(i => i.id !== id));
            toast.success("Inquiry deleted");
        } catch (error) {
            toast.error("Failed to delete inquiry");
        }
    };

    const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
            toast.success("Appointment updated");
        } catch (error) {
            toast.error("Failed to update appointment");
        }
    };

    const deleteAppointment = async (id: string) => {
        try {
            const { error } = await supabase
                .from('appointments')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setAppointments(prev => prev.filter(a => a.id !== id));
            toast.success("Appointment deleted");
        } catch (error) {
            toast.error("Failed to delete appointment");
        }
    };

    return {
        inquiries,
        appointments,
        loading,
        refresh: fetchLeads,
        updateInquiryStatus,
        deleteInquiry,
        updateAppointmentStatus,
        deleteAppointment
    };
};
