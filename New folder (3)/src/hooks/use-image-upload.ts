import { useState } from 'react';
import { supabase } from "@/pages/integrations/supabase/client";
import { toast } from "sonner";

export const useImageUpload = (userId?: string) => {
    const [uploading, setUploading] = useState(false);

    const uploadImage = async (file: File, folder: string, fileName?: string): Promise<string | null> => {
        if (!userId) {
            toast.error("User must be logged in to upload");
            return null;
        }

        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const path = `${userId}/${folder}/${fileName || Date.now()}.${fileExt}`;

            const { error: uploadError, data } = await supabase.storage
                .from('shop_assets')
                .upload(path, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('shop_assets')
                .getPublicUrl(path);

            return publicUrl;
        } catch (error: any) {
            toast.error(`Upload failed: ${error.message}`);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const deleteImage = async (url: string) => {
        try {
            // Extract path from URL
            // Example: https://.../storage/v1/object/public/shop_assets/USER_ID/FOLDER/FILE.PNG
            const pathParts = url.split('shop_assets/');
            if (pathParts.length < 2) return;
            const path = pathParts[1];

            const { error } = await supabase.storage
                .from('shop_assets')
                .remove([path]);

            if (error) throw error;
        } catch (error: any) {
            console.error("Delete failed:", error.message);
        }
    };

    return { uploading, uploadImage, deleteImage };
};
