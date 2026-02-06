
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/pages/integrations/supabase/client";
import { toast } from "sonner";
import {
    Loader2, Store, Mail, Lock, Phone, MessageCircle, MapPin, CheckCircle
} from "lucide-react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { Label } from "@/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Alert, AlertDescription } from "@/ui/alert";

const authSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Auth = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading, signIn, signUp } = useAuth();
    const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});
    const [shopName, setShopName] = useState('');
    const [slug, setSlug] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('+91 ');
    const [whatsapp, setWhatsapp] = useState('+91 ');
    const [sameAsPhone, setSameAsPhone] = useState(false);

    useEffect(() => {
        if (shopName && !slug) setSlug(shopName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''));
    }, [shopName]);

    useEffect(() => { if (sameAsPhone) setWhatsapp(phone); }, [phone, sameAsPhone]);

    useEffect(() => {
        const checkUserShop = async () => {
            if (user && !authLoading) {
                const { data: shop } = await supabase.from('shops').select('id, social_links').eq('user_id', user.id).maybeSingle();
                const shopSlug = (shop?.social_links as any)?.slug;
                if (shopSlug) navigate(`/v/${shopSlug}`); else navigate('/');
            }
        };
        checkUserShop();
    }, [user, authLoading, navigate]);

    const validateForm = (emailOnly = false) => {
        try {
            if (emailOnly) {
                z.string().email('Invalid email address').parse(email);
            } else {
                authSchema.parse({ email, password });
                if (mode === 'register') {
                    if (!shopName.trim()) throw new Error("Shop Name is required");
                    if (!slug.trim()) throw new Error("Shop Alias is required");
                    if (!phone.trim() || phone.length < 5) throw new Error("Valid Phone Number is required");
                    if (!whatsapp.trim() || whatsapp.length < 5) throw new Error("Valid WhatsApp Number is required");
                    if (!address.trim()) throw new Error("Address is required");
                }
            }
            setValidationErrors({});
            return true;
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                const errors: { email?: string; password?: string } = {};
                err.errors.forEach((error) => {
                    if (error.path[0] === 'email') errors.email = error.message;
                    if (error.path[0] === 'password') errors.password = error.message;
                });
                setValidationErrors(errors);
            } else {
                setError(err.message);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (mode === 'forgot') {
            if (!validateForm(true)) return;
            setLoading(true);
            try {
                const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/` });
                if (error) throw error;
                setResetSent(true);
                toast.success('Password reset email sent!');
            } catch (err: any) { setError(err.message); } finally { setLoading(false); }
            return;
        }
        if (!validateForm()) return;
        setLoading(true);
        try {
            if (mode === 'login') {
                const { error } = await signIn(email, password);
                if (error) setError(error.message.includes('Invalid login credentials') ? 'Invalid email or password.' : error.message);
            } else {
                const { error } = await signUp(email, password, { shop_name: shopName, slug: slug, address: address, phone: phone, whatsapp: whatsapp });
                if (error) setError(error.message.includes('User already registered') ? 'Account already exists. Please login.' : error.message);
            }
        } finally { setLoading(false); }
    };

    if (authLoading) return <div className="auth-page"><div className="auth-loading"><Loader2 className="auth-loading-spinner" /></div></div>;

    if (resetSent) return (
        <div className="auth-page"><div className="auth-container"><Card className="auth-card"><CardContent className="pt-6 text-center">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" /><h2 className="text-xl font-semibold mb-2">Check your email</h2>
            <p className="text-muted-foreground mb-4">We sent a password reset link to {email}</p>
            <Button onClick={() => { setResetSent(false); setMode('login'); }}>Back to Login</Button>
        </CardContent></Card></div></div>
    );

    return (
        <div className="auth-page"><div className="auth-container">
            <Card className="auth-card"><CardHeader className="auth-card-header">
                <div className="auth-logo"><Store className="auth-logo-icon" /></div>
                <CardTitle className="auth-card-title">{mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}</CardTitle>
                <CardDescription className="auth-card-description">{mode === 'forgot' ? 'Enter your email to receive a reset link' : mode === 'login' ? 'Sign in to manage your shop' : 'Register to create your shop'}</CardDescription>
            </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <Alert variant="destructive" className="auth-alert"><AlertDescription>{error}</AlertDescription></Alert>}
                        {mode === 'register' && (
                            <>
                                <div className="auth-form-field"><Label htmlFor="shopName" className="auth-label">Shop Name</Label><div className="auth-input-wrapper"><Store className="auth-input-icon" /><Input id="shopName" value={shopName} onChange={(e) => setShopName(e.target.value)} className="auth-input" disabled={loading} /></div></div>
                                <div className="auth-form-field"><Label htmlFor="slug" className="auth-label">Shop Alias</Label><div className="auth-input-wrapper"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-mono">/v/</span><Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} className="auth-input pl-8 font-mono text-sm" disabled={loading} /></div></div>
                                <div className="auth-form-field"><Label htmlFor="phone" className="auth-label">Phone</Label><div className="auth-input-wrapper"><Phone className="auth-input-icon" /><Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="auth-input" disabled={loading} /></div></div>
                                <div className="auth-form-field"><div className="flex justify-between items-center mb-1"><Label htmlFor="whatsapp" className="auth-label">WhatsApp</Label><div className="flex items-center space-x-2"><input type="checkbox" id="sameAsPhone" checked={sameAsPhone} onChange={(e) => setSameAsPhone(e.target.checked)} className="w-3 h-3 rounded border-gray-300 text-primary focus:ring-primary" /><Label htmlFor="sameAsPhone" className="text-xs text-muted-foreground cursor-pointer font-normal">Same as phone</Label></div></div><div className="auth-input-wrapper"><MessageCircle className="auth-input-icon" /><Input id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="auth-input" disabled={loading} /></div></div>
                                <div className="auth-form-field"><Label htmlFor="address" className="auth-label">Address</Label><div className="auth-input-wrapper"><MapPin className="auth-input-icon mt-2.5" /><Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="auth-input min-h-[80px] py-2" disabled={loading} /></div></div>
                            </>
                        )}
                        <div className="auth-form-field"><Label htmlFor="email" className="auth-label">Email</Label><div className="auth-input-wrapper"><Mail className="auth-input-icon" /><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" disabled={loading} /></div>{validationErrors.email && <p className="auth-error-text">{validationErrors.email}</p>}</div>
                        {mode !== 'forgot' && (<div className="auth-form-field"><Label htmlFor="password" className="auth-label">Password</Label><div className="auth-input-wrapper"><Lock className="auth-input-icon" /><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" disabled={loading} /></div>{validationErrors.password && <p className="auth-error-text">{validationErrors.password}</p>}</div>)}
                        {mode === 'login' && (<Button type="button" variant="link" className="p-0 h-auto text-sm" onClick={() => { setMode('forgot'); setError(null); }}>Forgot password?</Button>)}
                        <Button type="submit" className="auth-submit-button" disabled={loading}>{loading ? <><Loader2 className="auth-button-spinner" /> Please wait...</> : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}</Button>
                    </form>
                    <div className="auth-toggle"><p className="auth-toggle-text">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'}</p><Button variant="link" className="auth-toggle-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); setValidationErrors({}); }}>{mode === 'login' ? 'Create one' : 'Sign in'}</Button></div>
                </CardContent>
            </Card></div></div>
    );
};

export default Auth;
