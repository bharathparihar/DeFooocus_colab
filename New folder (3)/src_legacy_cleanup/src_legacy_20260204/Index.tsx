
import React, { useState, useEffect, useRef } from "react";
import {
    Upload, Loader2, X, Image as ImageIcon, Video, Plus, Trash2, RotateCcw,
    Instagram, Facebook, Youtube, Twitter, Linkedin, MessageCircle, Send,
    Camera, MapPin, Link as LinkIcon, ExternalLink, Globe, Search,
    AlertTriangle, Code, Phone, Mail, Clock, CheckCircle, XCircle,
    Calendar, List, Star, ShoppingBag, HelpCircle, Briefcase, Music,
    Gift, Plane, Heart, Images, Play, Quote, Copy, Check, Contact, Share2,
    BarChart3, Settings, ShieldAlert, ArrowRight, Eye, EyeOff, CreditCard, MessageSquarePlus, Book,
    AtSign, Ghost, Pin, Bike, Palette, Dribbble, Flame, Utensils, Edit, PlusCircle, LayoutGrid, List as ListIcon,
    Database, HardDrive, Filter, RefreshCcw, MoreVertical, Archive, CheckCircle2
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { supabase } from "@/pages/integrations/supabase/client";
import { format, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
    Product, Service, BusinessHours, Category, FAQ,
    ShopStats, SocialEmbed, SocialLinks, CustomLink,
    Inquiry, Appointment, ShopConfig, Template, Testimonial,
    SectionVisibility
} from "@/types/shop";
import { useShop, defaultShopConfig } from "@/hooks/use-shop";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useAuth } from "@/hooks/use-auth";
import { useLeads } from "@/hooks/use-leads";
import { cn } from "@/utils";
import { Progress } from "@/ui/progress";

// UI Components
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Switch } from "@/ui/switch";
import { Badge } from "@/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Slider } from "@/ui/slider";

// --- HELPERS ---
const isVideo = (url: string) => {
    if (!url) return false;
    const path = url.split('?')[0];
    return path.match(/\.(mp4|webm|ogg|mov)$/i);
};

const SectionToggle = ({ title, description, isVisible, onToggle, allowToggle = false }: { title: string, description?: string, isVisible: boolean, onToggle: () => void, allowToggle?: boolean }) => (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
        </div>
        {allowToggle && (
            <Button variant="ghost" size="sm" onClick={onToggle} className={isVisible ? "text-primary" : "text-muted-foreground"}>
                {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </Button>
        )}
    </CardHeader>
);

// --- DIALOG COMPONENTS ---
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay ref={ref} className={`fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ${className}`} {...props} />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content ref={ref} className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg ${className}`} {...props}>
            {children}
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// --- SELLER COMPONENTS ---

interface ImageUploadProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
    folder: string;
    userId: string | undefined;
    fileName?: string;
    aspectRatio?: "square" | "banner" | "video";
    acceptVideo?: boolean;
}

const ImageUpload = ({ label, value, onChange, folder, userId, fileName, aspectRatio = "square", acceptVideo = false }: ImageUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploading, uploadImage } = useImageUpload(userId);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = await uploadImage(file, folder, fileName);
        if (url) onChange(url);
    };

    const getAspectRatioClass = () => {
        switch (aspectRatio) {
            case "banner": return "aspect-[3/1]";
            case "video": return "aspect-video w-full";
            default: return "aspect-square w-24";
        }
    };

    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}
            <div className={cn("relative border-2 border-dashed border-border rounded-lg overflow-hidden bg-muted/50 transition-all duration-200 hover:border-primary/50", getAspectRatioClass())}>
                {value ? (
                    <>
                        {isVideo(value) ? (
                            <video src={value} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                        ) : (
                            <img src={value} alt={label} className="w-full h-full object-cover" />
                        )}
                        <button onClick={() => onChange("")} className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center transition-transform hover:scale-110">
                            <X className="w-3 h-3" />
                        </button>
                    </>
                ) : (
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Upload className="w-6 h-6" /><span className="text-xs">Upload</span></>}
                    </button>
                )}
            </div>
            <input ref={fileInputRef} type="file" accept={acceptVideo ? "video/*,image/*" : "image/*"} onChange={handleFileChange} className="hidden" />
        </div>
    );
};

// --- CONTENT MANAGERS ---

const ContentTab = ({ config, setConfig, userId }: { config: ShopConfig, setConfig: (c: ShopConfig) => void, userId: string | undefined }) => {
    const toggle = (key: keyof SectionVisibility) => {
        const currentvis = config.sectionVisibility || {} as any;
        setConfig({ ...config, sectionVisibility: { ...currentvis, [key]: !currentvis[key] } });
    };
    const isVis = (key: keyof SectionVisibility) => config.sectionVisibility?.[key] ?? true;

    return (
        <div className="space-y-8">
            <Card>
                <SectionToggle title="Categories" isVisible={isVis('categories')} onToggle={() => toggle('categories')} />
                {isVis('categories') && <CardContent>
                    <CategoriesManager categories={config.categories} onChange={c => setConfig({ ...config, categories: c })} userId={userId} />
                </CardContent>}
            </Card>

            <Card>
                <SectionToggle title="Products" isVisible={isVis('products')} onToggle={() => toggle('products')} />
                {isVis('products') && <CardContent>
                    <ProductsManager products={config.products} onChange={p => setConfig({ ...config, products: p })} userId={userId} />
                </CardContent>}
            </Card>

            <Card>
                <SectionToggle title="Services" isVisible={isVis('services')} onToggle={() => toggle('services')} />
                {isVis('services') && <CardContent>
                    <ServicesManager services={config.services} onChange={s => setConfig({ ...config, services: s })} userId={userId} />
                </CardContent>}
            </Card>

            <Card>
                <SectionToggle title="Featured Film" description="Embed a YouTube video to showcase your brand." isVisible={isVis('featuredVideo')} onToggle={() => toggle('featuredVideo')} />
                {isVis('featuredVideo') && <CardContent>
                    <Input placeholder="YouTube Video URL (e.g. https://youtu.be/...)" value={config.featuredVideo || ""} onChange={e => setConfig({ ...config, featuredVideo: e.target.value })} />
                </CardContent>}
            </Card>

            <Card>
                <SectionToggle title="Gallery & Media" isVisible={isVis('gallery')} onToggle={() => toggle('gallery')} />
                {isVis('gallery') && <CardContent className="space-y-6">
                    <GalleryManager images={config.galleryImages} onChange={i => setConfig({ ...config, galleryImages: i })} userId={userId} />
                    <SocialEmbedsManager embeds={config.socialEmbeds || []} onChange={e => setConfig({ ...config, socialEmbeds: e })} />
                </CardContent>}
            </Card>

            <Card>
                <SectionToggle title="Trust & FAQ" isVisible={isVis('testimonials')} onToggle={() => toggle('testimonials')} />
                {isVis('testimonials') && <CardContent className="space-y-6">
                    <TestimonialsManager testimonials={config.testimonials} onChange={t => setConfig({ ...config, testimonials: t })} userId={userId} />
                    <FAQManager faq={config.faq} onChange={f => setConfig({ ...config, faq: f })} />
                </CardContent>}
            </Card>
        </div>
    );
};

const ProductsManager = ({ products, onChange, userId }: { products: Product[], onChange: (p: Product[]) => void, userId?: string }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [status, setStatus] = useState<Product['status']>('ready-stock');
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!name || !price) {
            toast.error("Name and Price are required");
            return;
        }

        const newProduct: Product = {
            id: editingId || Date.now().toString(),
            name,
            price: parseFloat(price),
            imageUrl,
            status
        };

        if (editingId) {
            onChange(products.map(p => p.id === editingId ? { ...p, ...newProduct, status: p.status } : p));
            toast.success("Product updated!");
        } else {
            onChange([...products, newProduct]);
            toast.success("Product added!");
        }
        setOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setName("");
        setPrice("");
        setImageUrl("");
        setStatus('ready-stock');
        setEditingId(null);
    };

    const startEdit = (p: Product) => {
        setName(p.name);
        setPrice(p.price.toString());
        setImageUrl(p.imageUrl);
        setStatus(p.status);
        setEditingId(p.id);
        setOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="text-sm font-medium leading-none">Catalog</h3>
                    <p className="text-xs text-muted-foreground">Manage your product inventory.</p>
                </div>
                <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
                    <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Product</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{editingId ? "Edit Product" : "Add New Product"}</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="flex justify-center">
                                <ImageUpload label="Product Image" value={imageUrl} onChange={setImageUrl} userId={userId} folder="products" acceptVideo={true} />
                            </div>
                            <div className="space-y-2"><Label>Product Name</Label><Input placeholder="e.g. Wedding Album" value={name} onChange={e => setName(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Price (₹)</Label><Input type="number" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Status</Label>
                                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ready-stock">Ready Stock</SelectItem>
                                        <SelectItem value="made-to-order">Made to Order</SelectItem>
                                        <SelectItem value="coming-soon">Coming Soon</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleSubmit} className="w-full">{editingId ? "Save Changes" : "Create Product"}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border bg-card">
                <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-xs font-medium border-b text-muted-foreground">
                    <div className="col-span-2">Image</div>
                    <div className="col-span-5">Details</div>
                    <div className="col-span-3">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>
                {products.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">No products found. Add one to get started.</div>
                ) : (
                    products.map(p => (
                        <div key={p.id} className="grid grid-cols-12 gap-4 p-3 items-center text-sm border-b last:border-0 hover:bg-muted/5 transition-colors">
                            <div className="col-span-2 h-10 w-10 rounded-md overflow-hidden bg-muted border">
                                <ImageUpload label="" value={p.imageUrl} onChange={url => onChange(products.map(x => x.id === p.id ? { ...x, imageUrl: url } : x))} userId={userId} folder="products" />
                            </div>
                            <div className="col-span-5 space-y-1">
                                <p className="font-medium truncate">{p.name}</p>
                                <p className="text-xs text-muted-foreground">₹{p.price}</p>
                            </div>
                            <div className="col-span-3">
                                <Badge variant={p.status === 'ready-stock' ? 'default' : 'secondary'} className="cursor-pointer hover:opacity-80 text-[10px] h-5" onClick={() => onChange(products.map(x => x.id === p.id ? { ...x, status: p.status === 'ready-stock' ? 'made-to-order' : 'ready-stock' } : x))}>
                                    {p.status === 'ready-stock' ? 'In Stock' : 'Custom'}
                                </Badge>
                            </div>
                            <div className="col-span-2 flex justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(p)}><Edit className="w-3 h-3" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onChange(products.filter(x => x.id !== p.id))}><Trash2 className="w-3 h-3" /></Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const CategoriesManager = ({ categories, onChange, userId }: { categories: Category[], onChange: (c: Category[]) => void, userId?: string }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!name) {
            toast.error("Category Name required");
            return;
        }
        if (editingId) {
            onChange(categories.map(c => c.id === editingId ? { ...c, name, imageUrl } : c));
            toast.success("Category updated");
        } else {
            onChange([...categories, { id: Date.now().toString(), name, imageUrl }]);
            toast.success("Category added");
        }
        setOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setName("");
        setImageUrl("");
        setEditingId(null);
    };

    const startEdit = (c: Category) => {
        setName(c.name);
        setImageUrl(c.imageUrl);
        setEditingId(c.id);
        setOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="text-sm font-medium leading-none">Collections</h3>
                    <p className="text-xs text-muted-foreground">Organize your products.</p>
                </div>
                <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
                    <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Category</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{editingId ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="flex justify-center">
                                <ImageUpload label="Category Image" value={imageUrl} onChange={setImageUrl} userId={userId} folder="categories" />
                            </div>
                            <div className="space-y-2"><Label>Category Name</Label><Input placeholder="e.g. Summer Collection" value={name} onChange={e => setName(e.target.value)} /></div>
                            <Button onClick={handleSubmit} className="w-full">{editingId ? "Save Changes" : "Create Category"}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.length === 0 ? <div className="col-span-full p-8 text-center text-muted-foreground text-sm border rounded bg-muted/20">No categories found.</div> : categories.map(c => (
                    <div key={c.id} className="group relative border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-all">
                        <div className="aspect-square bg-muted">
                            <ImageUpload label="" value={c.imageUrl} onChange={url => onChange(categories.map(x => x.id === c.id ? { ...x, imageUrl: url } : x))} userId={userId} folder="categories" />
                        </div>
                        <div className="p-3 bg-card border-t z-10 relative">
                            <p className="font-bold text-center text-sm truncate">{c.name}</p>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-20">
                            <button onClick={() => startEdit(c)} className="bg-background/80 backdrop-blur p-1.5 rounded-full hover:bg-background border shadow-sm"><Edit className="w-3 h-3" /></button>
                            <button onClick={() => onChange(categories.filter(x => x.id !== c.id))} className="bg-destructive/80 backdrop-blur p-1.5 rounded-full hover:bg-destructive text-white border shadow-sm"><X className="w-3 h-3" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GalleryManager = ({ images, onChange, userId }: { images: string[], onChange: (i: string[]) => void, userId?: string }) => {
    return (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {images.map((url, idx) => (
                <div key={idx} className="relative group aspect-square">
                    <img src={url} className="w-full h-full object-cover rounded-lg border" />
                    <button onClick={() => onChange(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                </div>
            ))}
            <div className="aspect-square">
                <ImageUpload label="Add Image/Video" value="" onChange={url => onChange([...images, url])} userId={userId} folder="gallery" acceptVideo={true} />
            </div>
        </div>
    );
};

const ServicesManager = ({ services, onChange, userId }: { services: Service[], onChange: (s: Service[]) => void, userId?: string }) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!title) {
            toast.error("Title is required");
            return;
        }

        const newService: Service = {
            id: editingId || Date.now().toString(),
            title,
            description: desc,
            price: price,
            imageUrl: imageUrl,
            icon: "camera"
        };

        if (editingId) {
            onChange(services.map(s => s.id === editingId ? newService : s));
            toast.success("Service updated");
        } else {
            onChange([...services, newService]);
            toast.success("Service added");
        }
        setOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setTitle("");
        setDesc("");
        setPrice("");
        setImageUrl("");
        setEditingId(null);
    };

    const startEdit = (s: Service) => {
        setTitle(s.title);
        setDesc(s.description);
        setPrice(s.price || "");
        setImageUrl(s.imageUrl || "");
        setEditingId(s.id);
        setOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="text-sm font-medium leading-none">Services</h3>
                    <p className="text-xs text-muted-foreground">List the services you offer.</p>
                </div>
                <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
                    <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Service</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{editingId ? "Edit Service" : "Add Service"}</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="flex justify-center">
                                <ImageUpload label="Service Image" value={imageUrl} onChange={setImageUrl} userId={userId} folder="services" />
                            </div>
                            <div className="space-y-2"><Label>Service Title</Label><Input placeholder="e.g. Portrait Photography" value={title} onChange={e => setTitle(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Describe the service..." value={desc} onChange={e => setDesc(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Starting Price (Optional)</Label><Input type="number" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} /></div>
                            <Button onClick={handleSubmit} className="w-full">{editingId ? "Save Changes" : "Add Service"}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {services.length === 0 ? <div className="p-8 text-center text-muted-foreground text-sm border rounded bg-muted/20">No services listed.</div> : services.map(s => (
                    <div key={s.id} className="p-4 border rounded-lg bg-card flex gap-4 items-start hover:bg-muted/5 transition-colors group">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-muted border shrink-0">
                            {s.imageUrl ? <img src={s.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-primary bg-primary/10"><Briefcase className="w-6 h-6" /></div>}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                                <p className="font-bold text-sm">{s.title}</p>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startEdit(s)}><Edit className="w-3 h-3" /></Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange(services.filter(x => x.id !== s.id))}><Trash2 className="w-3 h-3" /></Button>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                            {s.price && <p className="text-xs font-bold text-primary">From ₹{s.price}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TestimonialsManager = ({ testimonials, onChange, userId }: { testimonials: Testimonial[], onChange: (t: Testimonial[]) => void, userId?: string }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState("5");
    const [imageUrl, setImageUrl] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!name) {
            toast.error("Client name is required");
            return;
        }
        if (!comment) {
            toast.error("Review text is required");
            return;
        }

        const safeRating = parseInt(rating) || 5;

        if (editingId) {
            onChange(testimonials.map(t => t.id === editingId ? { ...t, name, comment, rating: safeRating, imageUrl } : t));
            toast.success("Testimonial updated");
        } else {
            onChange([...testimonials, { id: Date.now().toString(), name, comment, rating: safeRating, imageUrl }]);
            toast.success("Testimonial added");
        }
        setOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setName("");
        setComment("");
        setRating("5");
        setImageUrl("");
        setEditingId(null);
    };

    const startEdit = (t: Testimonial) => {
        setName(t.name);
        setComment(t.comment);
        setRating(t.rating.toString());
        setImageUrl(t.imageUrl || "");
        setEditingId(t.id);
        setOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="text-sm font-medium leading-none">Testimonials</h3>
                    <p className="text-xs text-muted-foreground">What your clients say.</p>
                </div>
                <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
                    <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Review</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{editingId ? "Edit Review" : "Add Review"}</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="flex justify-center">
                                <ImageUpload label="Client Photo" value={imageUrl} onChange={setImageUrl} userId={userId} folder="testimonials" />
                            </div>
                            <div className="space-y-2"><Label>Client Name</Label><Input placeholder="e.g. John Doe" value={name} onChange={e => setName(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Review</Label><Textarea placeholder="The service was amazing..." value={comment} onChange={e => setComment(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Rating (0-5)</Label><Input type="number" min="0" max="5" value={rating} onChange={e => setRating(e.target.value)} /></div>
                            <Button onClick={handleSubmit} className="w-full">{editingId ? "Save Review" : "Add Review"}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.length === 0 ? <div className="col-span-full p-8 text-center text-muted-foreground text-sm border rounded bg-muted/20">No testimonials yet.</div> : testimonials.map(t => (
                    <div key={t.id} className="p-4 border rounded-xl bg-card space-y-3 relative group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                {t.imageUrl ? (
                                    <div className="w-8 h-8 rounded-full overflow-hidden border">
                                        <img src={t.imageUrl} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">{t.name.charAt(0)}</div>
                                )}
                                <div><p className="font-bold text-sm leading-none">{t.name}</p><div className="flex text-yellow-500 mt-1">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < t.rating ? "fill-current" : "text-muted opacity-30"}`} />)}</div></div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(t)} className="p-1.5 hover:bg-muted rounded"><Edit className="w-3 h-3 text-muted-foreground" /></button>
                                <button onClick={() => onChange(testimonials.filter(x => x.id !== t.id))} className="p-1.5 hover:bg-destructive/10 rounded"><X className="w-3 h-3 text-destructive" /></button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground italic line-clamp-3">"{t.comment}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FAQManager = ({ faq, onChange }: { faq: FAQ[], onChange: (f: FAQ[]) => void }) => {
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!question || !answer) {
            toast.error("Question and Answer required");
            return;
        }
        if (editingId) {
            onChange(faq.map(f => f.id === editingId ? { ...f, question, answer } : f));
            toast.success("FAQ updated");
        } else {
            onChange([...faq, { id: Date.now().toString(), question, answer }]);
            toast.success("FAQ added");
        }
        setOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setQuestion("");
        setAnswer("");
        setEditingId(null);
    };

    const startEdit = (f: FAQ) => {
        setQuestion(f.question);
        setAnswer(f.answer);
        setEditingId(f.id);
        setOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="text-sm font-medium leading-none">Standard Questions</h3>
                    <p className="text-xs text-muted-foreground">Answer common customer queries.</p>
                </div>
                <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
                    <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add FAQ</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{editingId ? "Edit FAQ" : "Add FAQ"}</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2"><Label>Question</Label><Input placeholder="e.g. Do you deliver?" value={question} onChange={e => setQuestion(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Answer</Label><Textarea placeholder="Yes, we deliver worldwide..." value={answer} onChange={e => setAnswer(e.target.value)} /></div>
                            <Button onClick={handleSubmit} className="w-full">{editingId ? "Save Changes" : "Add FAQ"}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-2">
                {faq.length === 0 ? <div className="p-8 text-center text-muted-foreground text-sm border rounded bg-muted/20">No FAQs added.</div> : faq.map(f => (
                    <div key={f.id} className="p-4 border rounded-lg bg-card group hover:shadow-sm transition-all">
                        <div className="flex justify-between items-start">
                            <p className="font-bold text-sm">{f.question}</p>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(f)} className="p-1 hover:bg-muted rounded"><Edit className="w-3 h-3 text-muted-foreground" /></button>
                                <button onClick={() => onChange(faq.filter(x => x.id !== f.id))} className="p-1 hover:bg-destructive/10 rounded"><X className="w-3 h-3 text-destructive" /></button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{f.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SocialEmbedsManager = ({ embeds, onChange }: { embeds: SocialEmbed[], onChange: (e: SocialEmbed[]) => void }) => {
    const parseUrl = (val: string) => {
        if (val.includes('<iframe')) {
            const match = val.match(/src="([^"]+)"/);
            if (match && match[1]) return match[1];
        }
        return val;
    };
    return (
        <div className="space-y-4">
            <Button onClick={() => onChange([...embeds, { id: Date.now().toString(), type: 'youtube', url: "", title: "" }])} variant="outline" className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Embed</Button>
            {embeds.map(e => (
                <div key={e.id} className="p-3 border rounded space-y-2">
                    <div className="flex justify-between">
                        <Select value={e.type} onValueChange={(v: any) => onChange(embeds.map(x => x.id === e.id ? { ...x, type: v } : x))}>
                            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="maps">Google Maps</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon" onClick={() => onChange(embeds.filter(x => x.id !== e.id))} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                    <Input placeholder="Embed URL or iframe code" value={e.url} onChange={val => onChange(embeds.map(x => x.id === e.id ? { ...x, url: parseUrl(val.target.value) } : x))} />
                    <p className="text-[10px] text-muted-foreground">Supports direct links or iframe embed codes.</p>
                </div>
            ))}
        </div>
    );
};

// --- LEADS COMPONENTS ---

const LeadsTab = ({ shopId }: { shopId: string | undefined }) => {
    const {
        inquiries, appointments, loading,
        updateInquiryStatus, deleteInquiry,
        updateAppointmentStatus, deleteAppointment
    } = useLeads(shopId);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const newInquiries = inquiries.filter(i => i.status === 'new').length;
    const pendingAppts = appointments.filter(a => a.status === 'pending').length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                            Total Inquiries
                            {newInquiries > 0 && <Badge variant="destructive" className="h-5">{newInquiries} New</Badge>}
                        </CardTitle>
                        <p className="text-2xl font-bold">{inquiries.length}</p>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                            Pending Appointments
                            {pendingAppts > 0 && <Badge variant="outline" className="h-5 text-amber-600 border-amber-200 bg-amber-50">{pendingAppts} Pending</Badge>}
                        </CardTitle>
                        <p className="text-2xl font-bold">{appointments.length}</p>
                    </CardHeader>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5" /> Inquiries</CardTitle>
                    <CardDescription>Messages from potential customers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-xs font-medium border-b text-muted-foreground">
                            <div className="col-span-3">Contact</div>
                            <div className="col-span-5">Message</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>
                        <div className="divide-y">
                            {inquiries.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-sm">No inquiries yet.</div>
                            ) : inquiries.map(inq => (
                                <div key={inq.id} className="grid grid-cols-12 gap-4 p-3 text-sm items-center hover:bg-muted/30 transition-colors group">
                                    <div className="col-span-3 flex flex-col gap-0.5">
                                        <span className="font-bold">{inq.name}</span>
                                        <span className="text-[10px] text-muted-foreground">{inq.phone}</span>
                                        {inq.email && <span className="text-[10px] text-muted-foreground truncate">{inq.email}</span>}
                                    </div>
                                    <div className="col-span-5">
                                        <p className="text-xs line-clamp-2" title={inq.message}>{inq.message}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">{format(new Date(inq.created_at), 'MMM d, h:mm a')}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <Select value={inq.status} onValueChange={(val: any) => updateInquiryStatus(inq.id, val)}>
                                            <SelectTrigger className="h-7 text-[10px] px-2 w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="new">New</SelectItem>
                                                <SelectItem value="responded">Responded</SelectItem>
                                                <SelectItem value="resolved">Resolved</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => { if (confirm("Delete this inquiry?")) deleteInquiry(inq.id); }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Appointments</CardTitle>
                    <CardDescription>Upcoming scheduled services.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-xs font-medium border-b text-muted-foreground">
                            <div className="col-span-3">Client & Time</div>
                            <div className="col-span-5">Service / Notes</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>
                        <div className="divide-y">
                            {appointments.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-sm">No upcoming appointments.</div>
                            ) : appointments.map(appt => (
                                <div key={appt.id} className="grid grid-cols-12 gap-4 p-3 text-sm items-center hover:bg-muted/30 transition-colors group">
                                    <div className="col-span-3 flex flex-col gap-0.5">
                                        <span className="font-bold">{appt.name}</span>
                                        <span className="text-[10px] text-muted-foreground">{appt.preferred_date} • {appt.preferred_time}</span>
                                        <span className="text-[10px] text-muted-foreground">{appt.phone}</span>
                                    </div>
                                    <div className="col-span-5">
                                        <span className="text-xs font-medium block">{appt.service || "General Inquiry"}</span>
                                        {appt.notes && <p className="text-[10px] text-muted-foreground line-clamp-1 italic">{appt.notes}</p>}
                                    </div>
                                    <div className="col-span-2">
                                        <Select value={appt.status} onValueChange={(val: any) => updateAppointmentStatus(appt.id, val)}>
                                            <SelectTrigger className="h-7 text-[10px] px-2 w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => { if (confirm("Delete this appointment?")) deleteAppointment(appt.id); }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// --- ADVANCED COMPONENTS ---

const AdvancedTab = ({ config, setConfig }: { config: ShopConfig, setConfig: (c: ShopConfig) => void }) => {
    const navigate = useNavigate();
    const ctr = config.stats?.views ? ((config.stats.clicks / config.stats.views) * 100).toFixed(1) : "0";

    // Mock data for chart based on current stats
    const chartData = [
        { name: 'Mon', views: Math.floor((config.stats?.views || 0) * 0.1), clicks: Math.floor((config.stats?.clicks || 0) * 0.1) },
        { name: 'Tue', views: Math.floor((config.stats?.views || 0) * 0.15), clicks: Math.floor((config.stats?.clicks || 0) * 0.15) },
        { name: 'Wed', views: Math.floor((config.stats?.views || 0) * 0.12), clicks: Math.floor((config.stats?.clicks || 0) * 0.1) },
        { name: 'Thu', views: Math.floor((config.stats?.views || 0) * 0.2), clicks: Math.floor((config.stats?.clicks || 0) * 0.25) },
        { name: 'Fri', views: Math.floor((config.stats?.views || 0) * 0.18), clicks: Math.floor((config.stats?.clicks || 0) * 0.15) },
        { name: 'Sat', views: Math.floor((config.stats?.views || 0) * 0.12), clicks: Math.floor((config.stats?.clicks || 0) * 0.1) },
        { name: 'Sun', views: config.stats?.views || 0, clicks: config.stats?.clicks || 0 },
    ];

    const resetShop = () => {
        if (confirm("Are you sure you want to reset your shop? All content, images, and settings will be reverted to defaults. This cannot be undone.")) {
            const resetConfig = { ...defaultShopConfig, id: config.id, shopName: config.shopName, email: config.email, phone: config.phone, createdAt: config.createdAt };
            setConfig(resetConfig);
            toast.success("Shop reset to defaults. Click 'Save Changes' to apply.");
        }
    };

    const deleteAccount = async () => {
        if (confirm("PERMANENT DELETE: Are you sure? All your data, shop, and account will be deleted forever.")) {
            try {
                const { error } = await supabase.from('shops').delete().eq('id', config.id);
                if (error) throw error;
                await supabase.auth.signOut();
                toast.success("Account deleted successfully.");
                navigate("/auth");
            } catch (err) {
                toast.error("Failed to delete account.");
            }
        }
    };

    const nfcRequests = (config.socialLinks as any)?._nfc_requests || [];
    const feedbacks = (config.socialLinks as any)?._feedbacks || [];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Analytics & Performance</CardTitle>
                    <CardDescription>Traffic and engagement trends for your shop.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-muted rounded-xl border border-muted-foreground/10"><p className="text-2xl font-bold">{config.stats?.views || 0}</p><p className="text-[10px] text-muted-foreground uppercase font-bold">Views</p></div>
                        <div className="p-4 bg-muted rounded-xl border border-muted-foreground/10"><p className="text-2xl font-bold">{config.stats?.clicks || 0}</p><p className="text-[10px] text-muted-foreground uppercase font-bold">Clicks</p></div>
                        <div className="p-4 bg-muted rounded-xl border border-muted-foreground/10"><p className="text-2xl font-bold text-primary">{ctr}%</p><p className="text-[10px] text-muted-foreground uppercase font-bold">Avg. CTR</p></div>
                    </div>

                    <div className="h-[200px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                                <Area type="monotone" dataKey="clicks" stroke="#10b981" fillOpacity={0} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><HardDrive className="w-5 h-5" /> Support & Physical Services</CardTitle><CardDescription>Need help or marketing materials?</CardDescription></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 items-center justify-center rounded-2xl border-dashed hover:border-primary hover:bg-primary/5 transition-all">
                                    <CreditCard className="w-10 h-10 text-primary" />
                                    <span className="font-bold">Order NFC Card</span>
                                    <span className="text-[10px] text-muted-foreground">Digital Business Cards</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Order NFC / PVC Card</DialogTitle></DialogHeader>
                                <div className="space-y-4 py-4">
                                    <p className="text-sm text-muted-foreground">Request a custom NFC card linked to your shop. Admin will contact you for payment.</p>
                                    <div className="space-y-2"><Label>Shipping Name</Label><Input id="nfc-name" placeholder="Your Name" /></div>
                                    <div className="space-y-2"><Label>Shipping Address</Label><Textarea id="nfc-address" placeholder="Full Address" /></div>
                                    <div className="space-y-2"><Label>Quantity</Label><Input id="nfc-qty" type="number" min="1" defaultValue="1" /></div>
                                    <Button onClick={() => {
                                        const name = (document.getElementById('nfc-name') as HTMLInputElement).value;
                                        const address = (document.getElementById('nfc-address') as HTMLTextAreaElement).value;
                                        const qty = (document.getElementById('nfc-qty') as HTMLInputElement).value;
                                        if (!name || !address) return toast.error("Please fill all fields");

                                        const sr = config.socialLinks || {};
                                        const requests = (sr as any)._nfc_requests || [];
                                        requests.push({ id: Date.now(), name, address, qty, date: new Date().toISOString(), status: 'pending' });

                                        setConfig({ ...config, socialLinks: { ...sr, _nfc_requests: requests } as any });
                                        toast.success("Request sent successfully!");
                                    }} className="w-full">Submit Order Request</Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 items-center justify-center rounded-2xl border-dashed hover:border-primary hover:bg-primary/5 transition-all">
                                    <MessageSquarePlus className="w-10 h-10 text-primary" />
                                    <span className="font-bold">Submit Feedback</span>
                                    <span className="text-[10px] text-muted-foreground">Bugs or Feature Requests</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Submit Feedback</DialogTitle></DialogHeader>
                                <div className="space-y-4 py-4">
                                    <p className="text-sm text-muted-foreground">Let us know how we can improve your experience.</p>
                                    <Textarea id="feedback-text" placeholder="Your feedback..." className="min-h-[100px]" />
                                    <Button onClick={() => {
                                        const text = (document.getElementById('feedback-text') as HTMLTextAreaElement).value;
                                        if (!text) return toast.error("Please enter feedback");

                                        const sr = config.socialLinks || {};
                                        const feedbacks = (sr as any)._feedbacks || [];
                                        feedbacks.push({ id: Date.now(), text, date: new Date().toISOString(), status: 'new' });

                                        setConfig({ ...config, socialLinks: { ...sr, _feedbacks: feedbacks } as any });
                                        toast.success("Feedback submitted!");
                                    }} className="w-full">Send Feedback</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {(nfcRequests.length > 0 || feedbacks.length > 0) && (
                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"><RefreshCcw className="w-3 h-3" /> Recent Requests</h4>
                            <div className="space-y-2">
                                {nfcRequests.map((r: any) => (
                                    <div key={r.id} className="text-[10px] flex items-center justify-between p-2 bg-muted/50 rounded-lg border">
                                        <div className="flex items-center gap-2"><CreditCard className="w-3 h-3 text-primary" /> <span>Order: {r.qty} NFC Card(s)</span></div>
                                        <Badge variant="outline" className="h-4 text-[8px] uppercase">{r.status}</Badge>
                                    </div>
                                ))}
                                {feedbacks.map((f: any) => (
                                    <div key={f.id} className="text-[10px] flex items-center justify-between p-2 bg-muted/50 rounded-lg border">
                                        <div className="flex items-center gap-2"><MessageSquarePlus className="w-3 h-3 text-primary" /> <span className="truncate max-w-[150px]">{f.text}</span></div>
                                        <Badge variant="outline" className="h-4 text-[8px] uppercase">{f.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> SEO Settings</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Meta Title</Label><Input value={config.socialLinks?.seo?.title || ""} onChange={e => setConfig({ ...config, socialLinks: { ...config.socialLinks, seo: { ...config.socialLinks?.seo, title: e.target.value } } })} placeholder="e.g. Best Pizza in Town - My Shop" /></div>
                    <div className="space-y-2"><Label>Meta Description</Label><Textarea value={config.socialLinks?.seo?.description || ""} onChange={e => setConfig({ ...config, socialLinks: { ...config.socialLinks, seo: { ...config.socialLinks?.seo, description: e.target.value } } })} placeholder="Brief summary shown in Google results." /></div>
                    <ImageUpload label="Social Share Image" value={config.socialLinks?.seo?.image || ""} onChange={u => setConfig({ ...config, socialLinks: { ...config.socialLinks, seo: { ...config.socialLinks?.seo, image: u } } })} userId={config.id} folder="seo" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Code className="w-5 h-5" /> Custom Codes & Legal</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Custom CSS</Label><Textarea placeholder=".my-class { color: red; }" className="font-mono text-xs" value={config.customCss || ""} onChange={e => setConfig({ ...config, customCss: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Custom JS</Label><Textarea placeholder="console.log('Hello');" className="font-mono text-xs" value={config.customJs || ""} onChange={e => setConfig({ ...config, customJs: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Privacy Policy</Label><Textarea placeholder="Enter your privacy policy text..." value={config.privacyPolicy || ""} onChange={e => setConfig({ ...config, privacyPolicy: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Terms & Conditions</Label><Textarea placeholder="Enter your terms and conditions..." value={config.termsConditions || ""} onChange={e => setConfig({ ...config, termsConditions: e.target.value })} /></div>
                </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader><CardTitle className="text-destructive flex items-center gap-2"><ShieldAlert className="w-5 h-5" /> Danger Zone</CardTitle><CardDescription>High-risk actions for your shop</CardDescription></CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                    <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white" onClick={resetShop}><RotateCcw className="w-4 h-4 mr-2" /> Reset Shop Content</Button>
                    <Button variant="destructive" onClick={deleteAccount}><Trash2 className="w-4 h-4 mr-2" /> Delete Entire Account</Button>
                </CardContent>
            </Card>
        </div>
    );
};

// --- PROFILE COMPONENTS ---

const ProfileTab = ({ config, setConfig, userId }: { config: ShopConfig, setConfig: (c: ShopConfig) => void, userId: string | undefined }) => {
    const toggle = (key: keyof SectionVisibility) => {
        const currentvis = config.sectionVisibility || {} as any;
        setConfig({ ...config, sectionVisibility: { ...currentvis, [key]: !currentvis[key] } });
    };
    const isVis = (key: keyof SectionVisibility) => config.sectionVisibility?.[key] ?? true;

    const copyLink = () => {
        const url = `${window.location.origin}/v/${config.slug || config.id}`;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader><CardTitle>Share Shop</CardTitle><CardDescription>Your shop's public identity</CardDescription></CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex gap-2 items-end">
                        <div className="space-y-2 flex-1"><Label>Shop URL Alias</Label>
                            <div className="flex items-center gap-1"><span className="text-muted-foreground text-sm">{window.location.origin}/v/</span>
                                <Input value={config.slug || ""} onChange={e => setConfig({ ...config, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} placeholder="my-shop-name" /></div>
                        </div>
                        <Button variant="outline" onClick={copyLink}><Copy className="w-4 h-4 mr-2" /> Copy Link</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white p-2 rounded-lg border flex items-center justify-center text-muted-foreground"><ImageIcon className="w-8 h-8" /></div>
                            <div><p className="font-bold text-sm">QR Code</p><p className="text-xs text-muted-foreground">Download for print & marketing</p></div>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => toast.success("QR Code download started!")}>Download QR</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <SectionToggle title="Announcement Banner" description="A scrolling message at the top of your shop." isVisible={isVis('announcement')} onToggle={() => toggle('announcement')} />
                {isVis('announcement') && <CardContent>
                    <Input placeholder="Big Sale this weekend! 50% OFF!" value={config.socialLinks?.announcement || ""} onChange={e => setConfig({ ...config, socialLinks: { ...config.socialLinks, announcement: e.target.value } })} />
                </CardContent>}
            </Card>

            <Card>
                <SectionToggle
                    title="Welcome Popup"
                    description="Show a message when customers visit."
                    isVisible={config.socialLinks?.popup?.enabled || false}
                    onToggle={() => {
                        const current = config.socialLinks?.popup?.enabled || false;
                        setConfig({ ...config, socialLinks: { ...config.socialLinks, popup: { ...config.socialLinks?.popup, enabled: !current } } });
                    }}
                    allowToggle={true}
                />
                {config.socialLinks?.popup?.enabled && (
                    <CardContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1"><ImageUpload label="Popup Image" value={config.socialLinks?.popup?.image || ""} onChange={u => setConfig({ ...config, socialLinks: { ...config.socialLinks, popup: { ...config.socialLinks?.popup, image: u } } })} userId={userId} folder="popup" /></div>
                            <div className="md:col-span-2 space-y-2"><Label>Popup Text</Label><Textarea value={config.socialLinks?.popup?.text || ""} onChange={e => setConfig({ ...config, socialLinks: { ...config.socialLinks, popup: { ...config.socialLinks?.popup, text: e.target.value } } })} rows={5} placeholder="Welcome to our shop! Check out our new collection." /></div>
                        </div>
                    </CardContent>
                )}
            </Card>

            <Card>
                <SectionToggle title="Shop Info" isVisible={isVis('about')} onToggle={() => toggle('about')} />
                {isVis('about') && <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Shop Name</Label><Input value={config.shopName} onChange={e => setConfig({ ...config, shopName: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Tagline</Label><Input value={config.tagline} onChange={e => setConfig({ ...config, tagline: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Owner Name</Label><Input value={config.ownerName} onChange={e => setConfig({ ...config, ownerName: e.target.value })} /></div>
                    </div>
                    <div className="space-y-2"><Label>Description</Label><Textarea value={config.description} onChange={e => setConfig({ ...config, description: e.target.value })} /></div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="space-y-2"><Label>Job Title</Label><Input value={config.jobTitle || ""} onChange={e => setConfig({ ...config, jobTitle: e.target.value })} placeholder="e.g. Photographer" /></div>
                        <div className="space-y-2"><Label>Occupation</Label><Input value={config.occupation || ""} onChange={e => setConfig({ ...config, occupation: e.target.value })} placeholder="e.g. Freelance" /></div>
                        <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={config.dateOfBirth || ""} onChange={e => setConfig({ ...config, dateOfBirth: e.target.value })} /></div>
                    </div>
                </CardContent>}
            </Card>

            <Card className="mb-6">
                <CardContent className="py-4 flex justify-between items-center">
                    <div className="space-y-1">
                        <h3 className="font-semibold">Map Embed Configuration</h3>
                        <p className="text-xs text-muted-foreground">Configure the map displayed on your contact page</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild><Button variant="outline" size="sm">Configure Map</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Google Maps Embed</DialogTitle></DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Embed Code</Label>
                                    <Textarea
                                        placeholder="<iframe src='...' ...></iframe>"
                                        value={config.socialLinks.mapEmbed || ""}
                                        onChange={e => {
                                            let val = e.target.value;
                                            if (val.includes('<iframe')) {
                                                const match = val.match(/src="([^"]+)"/);
                                                if (match && match[1]) val = match[1];
                                            }
                                            setConfig({ ...config, socialLinks: { ...config.socialLinks, mapEmbed: val } });
                                        }}
                                        className="font-mono text-xs h-32"
                                    />
                                    <p className="text-xs text-muted-foreground">Go to Google Maps &rarr; Share &rarr; Embed a map &rarr; Copy HTML. Paste it here.</p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            <Card>
                <SectionToggle title="Branding" isVisible={isVis('banner')} onToggle={() => toggle('banner')} />
                {isVis('banner') && <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUpload label="Logo (Favicon)" value={config.logoUrl || ""} onChange={u => setConfig({ ...config, logoUrl: u })} userId={userId} folder="branding" />
                    <ImageUpload label="Cover Banner" value={config.bannerUrl || ""} onChange={u => setConfig({ ...config, bannerUrl: u })} userId={userId} folder="branding" aspectRatio="banner" />
                </CardContent>}
            </Card>

            <Card>
                <SectionToggle title="Contact Details" isVisible={isVis('visitUs')} onToggle={() => toggle('visitUs')} />
                {isVis('visitUs') && <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Primary Phone</Label><Input value={config.phone} onChange={e => setConfig({ ...config, phone: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Alt. Phone</Label><Input value={config.alternatePhone || ""} onChange={e => setConfig({ ...config, alternatePhone: e.target.value })} placeholder="Secondary contact" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Primary Email</Label><Input value={config.email} onChange={e => setConfig({ ...config, email: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Alt. Email</Label><Input value={config.alternateEmail || ""} onChange={e => setConfig({ ...config, alternateEmail: e.target.value })} placeholder="Secondary email" /></div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>WhatsApp Number</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold">Same as Phone</span>
                                <Switch checked={config.whatsappNumber === config.phone} onCheckedChange={checked => setConfig({ ...config, whatsappNumber: checked ? config.phone : "" })} />
                            </div>
                        </div>
                        <Input value={config.whatsappNumber} onChange={e => setConfig({ ...config, whatsappNumber: e.target.value })} />
                    </div>
                    <div className="space-y-2"><Label>Address</Label><Textarea value={config.address} onChange={e => setConfig({ ...config, address: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Google Map Link (Directions Button)</Label>
                        <Input
                            value={config.socialLinks.maps || ""}
                            onChange={e => setConfig({ ...config, socialLinks: { ...config.socialLinks, maps: e.target.value } })}
                            placeholder="https://maps.app.goo.gl/..."
                        />
                    </div>

                </CardContent>}
            </Card>

            <Card>
                <SectionToggle title="Business Hours" isVisible={isVis('businessHours')} onToggle={() => toggle('businessHours')} />
                {isVis('businessHours') && <CardContent>
                    <BusinessHoursManager hours={config.businessHours} onChange={h => setConfig({ ...config, businessHours: h })} />
                </CardContent>}
            </Card>

            <Card>
                <SectionToggle title="Social Links" isVisible={isVis('socialLinks')} onToggle={() => toggle('socialLinks')} />
                {isVis('socialLinks') && <CardContent>
                    <SocialLinksManager socialLinks={config.socialLinks} onChange={s => setConfig({ ...config, socialLinks: s })} />
                    <div className="my-4 border-t" />
                    <CustomLinksManager links={config.customLinks || []} onChange={l => setConfig({ ...config, customLinks: l })} />
                </CardContent>}
            </Card>
        </div>
    );
};

const BusinessHoursManager = ({ hours, onChange }: { hours: BusinessHours[], onChange: (h: BusinessHours[]) => void }) => {
    return (
        <div className="space-y-2">
            {hours.map((h, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="w-24 font-medium">{h.day}</span>
                    <Input type="time" value={h.open} onChange={e => {
                        const newHours = [...hours];
                        newHours[idx] = { ...h, open: e.target.value };
                        onChange(newHours);
                    }} className="w-28 h-8" />
                    <span>-</span>
                    <Input type="time" value={h.close} onChange={e => {
                        const newHours = [...hours];
                        newHours[idx] = { ...h, close: e.target.value };
                        onChange(newHours);
                    }} className="w-28 h-8" />
                    <Switch checked={!h.isClosed} onCheckedChange={checked => {
                        const newHours = [...hours];
                        newHours[idx] = { ...h, isClosed: !checked };
                        onChange(newHours);
                    }} />
                    <span className="text-xs text-muted-foreground w-12">{h.isClosed ? "Closed" : "Open"}</span>
                </div>
            ))}
        </div>
    );
};

const SocialLinksManager = ({ socialLinks, onChange }: { socialLinks: SocialLinks, onChange: (s: SocialLinks) => void }) => {
    const fields: Array<keyof SocialLinks> = [
        'instagram', 'facebook', 'youtube', 'twitter', 'linkedin', 'snapchat',
        'pinterest', 'telegram', 'threads', 'justdial', 'indiamart', 'zomato', 'swiggy', 'behance', 'dribbble', 'paytm'
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fields.map(f => (
                <div key={f} className="flex items-center gap-2">
                    <span className="capitalize w-20 text-[10px] font-bold text-muted-foreground uppercase">{f}</span>
                    <Input placeholder={`https://${f}.com/...`} value={(socialLinks[f] as string) || ""} onChange={e => onChange({ ...socialLinks, [f]: e.target.value })} className="h-8 text-xs" />
                </div>
            ))}
        </div>
    );
};

const CustomLinksManager = ({ links, onChange }: { links: CustomLink[], onChange: (l: CustomLink[]) => void }) => {
    const [label, setLabel] = useState("");
    const [url, setUrl] = useState("");
    return (
        <div className="space-y-4">
            <Label>Custom Links</Label>
            <div className="flex gap-2">
                <Input placeholder="Label" value={label} onChange={e => setLabel(e.target.value)} />
                <Input placeholder="URL" value={url} onChange={e => setUrl(e.target.value)} />
                <Button onClick={() => {
                    if (!label || !url) return;
                    onChange([...links, { id: Date.now().toString(), label, url }]);
                    setLabel(""); setUrl("");
                }}>Add</Button>
            </div>
            <div className="space-y-2">
                {links.map(l => (
                    <div key={l.id} className="flex justify-between items-center p-2 border rounded bg-muted/20">
                        <span className="text-sm font-bold flex items-center gap-2"><LinkIcon className="w-4 h-4" /> {l.label}</span>
                        <Button variant="ghost" size="sm" onClick={() => onChange(links.filter(x => x.id !== l.id))} className="text-red-500 h-6"><Trash2 className="w-3 h-3" /></Button>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- BUYER COMPONENTS ---

const AnnouncementBanner = ({ text }: { text: string }) => {
    if (!text) return null;
    return (
        <div className="bg-primary text-primary-foreground py-2 px-4 overflow-hidden relative">
            <div className="whitespace-nowrap animate-marquee inline-block font-bold text-xs uppercase tracking-wider">
                {text} • {text} • {text} • {text}
            </div>
        </div>
    );
};

const WelcomePopup = ({ popup, shopName }: { popup: ShopConfig['socialLinks']['popup'], shopName: string }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (popup?.enabled) {
            const timer = setTimeout(() => setOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [popup]);

    if (!open || !popup?.enabled) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-background rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
                {popup.image && <img src={popup.image} className="w-full aspect-video object-cover" />}
                <div className="p-6 text-center space-y-4">
                    <h3 className="text-xl font-bold">{shopName}</h3>
                    <p className="text-muted-foreground">{popup.text}</p>
                    <Button onClick={() => setOpen(false)} className="w-full rounded-xl">Continue to Shop</Button>
                </div>
            </div>
        </div>
    );
};

const CategoriesSection = ({ categories }: { categories: Category[] }) => {
    if (!categories?.length) return null;
    return (
        <section className="py-6 px-4 space-y-4">
            <h2 className="text-lg font-bold">Browse Categories</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(c => (
                    <div key={c.id} className="shrink-0 w-24 space-y-2 text-center group cursor-pointer">
                        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
                            <img src={c.imageUrl || "/placeholder.svg"} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[10px] font-bold uppercase truncate">{c.name}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

const FeaturedFilm = ({ url }: { url: string }) => {
    if (!url) return null;
    const embedUrl = url.includes('watch?v=') ? url.replace('watch?v=', 'embed/') : url.includes('youtu.be/') ? url.replace('youtu.be/', 'youtube.com/embed/') : url;
    return (
        <section className="py-6 px-4 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><Play className="w-5 h-5 text-primary" /> Featured Film</h2>
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border bg-muted">
                <iframe src={embedUrl} className="w-full h-full" allowFullScreen />
            </div>
        </section>
    );
};

const TestimonialsSlider = ({ testimonials }: { testimonials: Testimonial[] }) => {
    if (!testimonials?.length) return null;
    const [active, setActive] = useState(0);

    return (
        <section className="py-8 px-4 bg-muted/30">
            <div className="max-w-md mx-auto space-y-6">
                <h2 className="text-lg font-bold flex items-center gap-2"><Quote className="w-5 h-5 text-primary" /> Kind Words</h2>
                <div className="relative">
                    {testimonials.map((t, i) => (
                        <div key={t.id} className={cn("transition-all duration-500 space-y-4", i === active ? "opacity-100 translate-x-0" : "opacity-0 absolute inset-0 translate-x-8 pointer-events-none")}>
                            <div className="flex gap-1">
                                {[...Array(Math.max(0, Math.min(5, t.rating || 0)))].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                            </div>
                            <p className="text-lg italic font-medium leading-relaxed">"{t.comment}"</p>
                            <div className="flex items-center gap-3">
                                {t.imageUrl ? (
                                    <img src={t.imageUrl} className="w-10 h-10 rounded-full object-cover border" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">{t.name.charAt(0)}</div>
                                )}
                                <p className="font-bold">{t.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                        <button key={i} onClick={() => setActive(i)} className={cn("h-1.5 transition-all rounded-full", i === active ? "w-8 bg-primary" : "w-1.5 bg-primary/20")} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const FAQSection = ({ faqs }: { faqs: FAQ[] }) => {
    const [openId, setOpenId] = useState<string | null>(null);
    if (!faqs?.length) return null;
    return (
        <section className="py-6 px-4 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><HelpCircle className="w-5 h-5 text-primary" /> FAQs</h2>
            <div className="space-y-2">
                {faqs.map(f => (
                    <div key={f.id} className="border rounded-xl overflow-hidden bg-card">
                        <button onClick={() => setOpenId(openId === f.id ? null : f.id)} className="w-full p-4 flex justify-between items-center text-left hover:bg-muted/50 transition-colors">
                            <span className="font-bold text-sm">{f.question}</span>
                            <Plus className={cn("w-4 h-4 transition-transform", openId === f.id && "rotate-45")} />
                        </button>
                        {openId === f.id && <div className="p-4 pt-0 text-sm text-muted-foreground animate-in slide-in-from-top-2 duration-200">{f.answer}</div>}
                    </div>
                ))}
            </div>
        </section>
    );
};

const BusinessHoursSection = ({ hours }: { hours: BusinessHours[] }) => {
    if (!hours?.length) return null;
    return (
        <section className="py-6 px-4 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Store Hours</h2>
            <div className="bg-muted/30 rounded-2xl p-4 space-y-2">
                {hours.map(h => (
                    <div key={h.day} className="flex justify-between items-center text-sm">
                        <span className="font-medium">{h.day}</span>
                        {h.isClosed ? <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-none">Closed</Badge> : <span className="font-bold">{h.open} - {h.close}</span>}
                    </div>
                ))}
            </div>
        </section>
    );
};

const FloatingWhatsApp = ({ number, shopName }: { number: string, shopName: string }) => {
    const message = encodeURIComponent(`Hi ${shopName}, I'm interested in your services!`);
    return (
        <a href={`https://wa.me/${number}?text=${message}`} target="_blank" rel="noopener" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95">
            <MessageCircle className="w-8 h-8" />
        </a>
    );
};

const isVis = (key: keyof SectionVisibility, config: ShopConfig) => config.sectionVisibility?.[key] ?? true;

const ShopBanner = ({ config }: { config: ShopConfig }) => (
    <section className="relative w-full">
        <div className="relative aspect-video w-full overflow-hidden">
            {config.bannerUrl ? (
                isVideo(config.bannerUrl) ? <video src={config.bannerUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" /> : <img src={config.bannerUrl} className="w-full h-full object-cover" />
            ) : <div className="w-full h-full bg-muted flex items-center justify-center"><ImageIcon className="w-12 h-12 text-muted-foreground/20" /></div>}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="relative px-4 -mt-20 text-center pb-6">
            <div className="w-32 h-32 rounded-full border-4 border-background bg-card mx-auto overflow-hidden shadow-lg">
                {config.logoUrl ? <img src={config.logoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">{config.shopName?.charAt(0)}</div>}
            </div>
            <h1 className="mt-4 text-2xl font-bold">{config.shopName}</h1>
            <p className="text-muted-foreground text-sm font-medium">{config.tagline}</p>
        </div>
    </section>
);

const ActionButtons = ({ config }: { config: ShopConfig }) => {
    const requestCatalog = () => {
        const text = encodeURIComponent(`Hi ${config.shopName}, I would like to request your full catalog/price list.`);
        window.open(`https://wa.me/${config.whatsappNumber}?text=${text}`, '_blank');
    };

    return (
        <section className="grid grid-cols-4 gap-2 px-4 py-4">
            <a href={`tel:${config.phone}`} className="flex flex-col items-center gap-1 group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all"><Phone className="w-5 h-5" /></div>
                <span className="text-[10px] font-medium">Call</span>
            </a>
            <a href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener" className="flex flex-col items-center gap-1 group">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all"><MessageCircle className="w-5 h-5" /></div>
                <span className="text-[10px] font-medium">WhatsApp</span>
            </a>
            <button onClick={requestCatalog} className="flex flex-col items-center gap-1 group">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all"><Book className="w-5 h-5" /></div>
                <span className="text-[10px] font-medium">Catalog</span>
            </button>
            <button onClick={() => { navigator.share({ title: config.shopName, url: window.location.href }); }} className="flex flex-col items-center gap-1 group">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all"><Share2 className="w-5 h-5" /></div>
                <span className="text-[10px] font-medium">Share</span>
            </button>
        </section>
    );
};

const ProductsSection = ({ products, shopName, whatsappNumber }: { products: Product[], shopName: string, whatsappNumber: string }) => {
    const orderOnWhatsApp = (productName: string, price: number) => {
        const text = encodeURIComponent(`Hi ${shopName}, I would like to order "${productName}" (₹${price}). Is it available?`);
        window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
    };

    return (
        <section className="py-6 px-4 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-primary" /> Products</h2>
            <div className="grid grid-cols-2 gap-4">
                {products.map(p => (
                    <div key={p.id} className="bg-card rounded-xl overflow-hidden shadow-sm border flex flex-col">
                        <div className="aspect-square bg-muted relative group">
                            <img src={p.imageUrl || "/placeholder.svg"} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            {p.status === 'made-to-order' && <Badge className="absolute top-2 left-2 bg-black/60 backdrop-blur-md">Custom</Badge>}
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                            <div>
                                <p className="font-bold text-sm truncate">{p.name}</p>
                                <p className="text-primary font-bold">₹{p.price}</p>
                            </div>
                            <Button size="sm" variant="outline" className="w-full text-[10px] h-7 rounded-lg border-primary/20 hover:bg-primary/5 transition-colors gap-1" onClick={() => orderOnWhatsApp(p.name, p.price)}>
                                <MessageCircle className="w-3 h-3" /> Order
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- MAIN SHOP COMPONENT ---

const Shop = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { shop, loading, saveShop, incrementStats } = useShop(user);
    const [viewMode, setViewMode] = useState<'buyer' | 'seller'>('seller');
    const [config, setConfig] = useState<ShopConfig>(defaultShopConfig);

    useEffect(() => {
        if (shop) setConfig(shop);
    }, [shop]);

    useEffect(() => {
        if (viewMode === 'buyer') incrementStats('views');
    }, [viewMode, incrementStats]);

    useEffect(() => {
        if (viewMode === 'buyer' && config.customCss) {
            const style = document.createElement('style');
            style.id = 'custom-shop-css';
            style.innerHTML = config.customCss;
            document.head.appendChild(style);
            return () => { document.getElementById('custom-shop-css')?.remove(); };
        }
    }, [viewMode, config.customCss]);

    useEffect(() => {
        if (viewMode === 'buyer' && config.customJs) {
            try {
                const script = document.createElement('script');
                script.id = 'custom-shop-js';
                script.innerHTML = config.customJs;
                document.body.appendChild(script);
                return () => { document.getElementById('custom-shop-js')?.remove(); };
            } catch (e) { console.error("Custom JS Error:", e); }
        }
    }, [viewMode, config.customJs]);



    // SEO Effect
    useEffect(() => {
        if (viewMode === 'buyer') {
            // Update Title
            document.title = config.socialLinks?.seo?.title || config.shopName || "My Shop";

            // Update Meta Description
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', config.socialLinks?.seo?.description || config.tagline || "");

            // Update OG Image (Best effort for client-side)
            let ogImage = document.querySelector('meta[property="og:image"]');
            if (!ogImage) {
                ogImage = document.createElement('meta');
                ogImage.setAttribute('property', 'og:image');
                document.head.appendChild(ogImage);
            }
            if (config.socialLinks?.seo?.image) {
                ogImage.setAttribute('content', config.socialLinks?.seo?.image);
            }
        }
    }, [viewMode, config]);

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    if (viewMode === 'buyer') {
        const isV = (key: keyof SectionVisibility) => isVis(key, config);

        return (
            <div className="min-h-screen bg-background text-foreground pb-20">
                <WelcomePopup popup={config.socialLinks?.popup} shopName={config.shopName} />
                {isV('announcement') && <AnnouncementBanner text={config.socialLinks?.announcement || ""} />}

                {user && (
                    <div className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur border p-1 rounded-full shadow-lg flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setViewMode('seller')} className="rounded-full">Editor</Button>
                        <Button variant="default" size="sm" onClick={() => setViewMode('buyer')} className="rounded-full">Preview</Button>
                    </div>
                )}

                <div className="max-w-md mx-auto bg-card min-h-screen shadow-xl relative overflow-x-hidden">
                    {isV('banner') && <ShopBanner config={config} />}
                    {isV('actionButtons') && <ActionButtons config={config} />}

                    {isV('categories') && <CategoriesSection categories={config.categories} />}
                    {isV('featuredVideo') && <FeaturedFilm url={config.featuredVideo || ""} />}
                    {isV('products') && <ProductsSection products={config.products} shopName={config.shopName} whatsappNumber={config.whatsappNumber} />}

                    {isV('services') && (
                        <section className="p-4 space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> Services</h2>
                            {config.services.map(s => (
                                <div key={s.id} className="flex gap-4 p-4 bg-muted/50 rounded-xl group transition-colors hover:bg-muted">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform"><Camera className="w-5 h-5" /></div>
                                    <div>
                                        <p className="font-bold">{s.title}</p>
                                        <p className="text-sm text-muted-foreground">{s.description}</p>
                                        {s.price && <p className="text-xs font-bold text-primary mt-1">Starting from ₹{s.price}</p>}
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}

                    {isV('gallery') && (
                        <section className="p-4 space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2"><Images className="w-5 h-5 text-primary" /> Gallery</h2>
                            <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-xl border">
                                {config.galleryImages.map((img, i) => (
                                    <img key={i} src={img} className="aspect-square object-cover hover:scale-105 transition-transform" />
                                ))}
                            </div>
                            {config.socialEmbeds && config.socialEmbeds.length > 0 && isV('socialEmbeds') && (
                                <div className="space-y-4 pt-4 border-t mt-4">
                                    {config.socialEmbeds.map(e => (
                                        <div key={e.id} className="aspect-video w-full rounded-xl overflow-hidden border shadow-sm">
                                            <iframe src={e.url} className="w-full h-full" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {isV('testimonials') && <TestimonialsSlider testimonials={config.testimonials} />}
                    {isV('faq') && <FAQSection faqs={config.faq} />}
                    {isV('businessHours') && <BusinessHoursSection hours={config.businessHours} />}

                    {isV('visitUs') && (
                        <section className="p-4 space-y-4 border-t">
                            <h2 className="text-lg font-bold">Visit Us</h2>
                            <p className="text-sm text-muted-foreground">{config.address}</p>
                            {config.socialLinks.mapEmbed && (
                                <div className="aspect-video w-full rounded-xl overflow-hidden border shadow-inner">
                                    <iframe src={config.socialLinks.mapEmbed} className="w-full h-full" />
                                </div>
                            )}
                        </section>
                    )}

                    {isV('about') && (
                        <section className="p-8 text-center space-y-4 bg-muted/20">
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold">About Us</h2>
                                <p className="text-sm leading-relaxed text-muted-foreground">{config.description}</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4">
                                {config.socialLinks.instagram && <a href={config.socialLinks.instagram} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm"><Instagram className="w-5 h-5" /></a>}
                                {config.socialLinks.facebook && <a href={config.socialLinks.facebook} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm"><Facebook className="w-5 h-5" /></a>}
                                {config.socialLinks.youtube && <a href={config.socialLinks.youtube} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm"><Youtube className="w-5 h-5" /></a>}
                                {config.socialLinks.twitter && <a href={config.socialLinks.twitter} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm"><Twitter className="w-5 h-5" /></a>}
                                {config.socialLinks.linkedin && <a href={config.socialLinks.linkedin} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm"><Linkedin className="w-5 h-5" /></a>}
                                {config.socialLinks.snapchat && <a href={config.socialLinks.snapchat} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm"><Ghost className="w-5 h-5" /></a>}
                                {config.socialLinks.pinterest && <a href={config.socialLinks.pinterest} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm"><Pin className="w-5 h-5" /></a>}
                                {config.socialLinks.telegram && <a href={config.socialLinks.telegram} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm"><Send className="w-5 h-5" /></a>}
                                {config.socialLinks.threads && <a href={config.socialLinks.threads} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm"><AtSign className="w-5 h-5" /></a>}
                                {config.socialLinks.justdial && <a href={config.socialLinks.justdial} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm flex items-center justify-center font-bold text-xs">JD</a>}
                                {config.socialLinks.indiamart && <a href={config.socialLinks.indiamart} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm"><ShoppingBag className="w-5 h-5" /></a>}
                                {config.socialLinks.zomato && <a href={config.socialLinks.zomato} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm"><Flame className="w-5 h-5" /></a>}
                                {config.socialLinks.swiggy && <a href={config.socialLinks.swiggy} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm"><Bike className="w-5 h-5" /></a>}
                                {config.socialLinks.behance && <a href={config.socialLinks.behance} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm"><Palette className="w-5 h-5" /></a>}
                                {config.socialLinks.dribbble && <a href={config.socialLinks.dribbble} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm"><Dribbble className="w-5 h-5" /></a>}
                                {config.socialLinks.paytm && <a href={config.socialLinks.paytm} className="text-primary hover:scale-110 transition-all p-2 bg-background rounded-full shadow-sm flex items-center justify-center font-bold text-[8px]">PAYTM</a>}
                            </div>
                        </section>
                    )}

                    <footer className="p-12 text-center space-y-4 border-t bg-card">
                        <div className="text-muted-foreground text-[10px] space-x-4">
                            {config.privacyPolicy && <button className="hover:underline">Privacy Policy</button>}
                            {config.termsConditions && <button className="hover:underline">Terms & Conditions</button>}
                        </div>
                        <p className="text-xs text-muted-foreground italic font-medium">✨ Powered by CartChat ✨</p>
                    </footer>
                </div>
                <FloatingWhatsApp number={config.whatsappNumber} shopName={config.shopName} />
            </div>
        );
    }

    // SELLER MODE
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-white border-b sticky top-0 z-40 px-6 py-4 flex flex-col gap-4 shadow-sm">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold flex items-center gap-2"><Settings className="w-5 h-5" /> Shop Editor</h1>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 w-48">
                            {(() => {
                                // Estimate storage usage: images ~ 0.5MB, videos ~ 5MB. Quota ~ 50MB.
                                const imgCount = (config.galleryImages?.length || 0) + (config.products?.length || 0) + (config.services?.filter(s => s.imageUrl).length || 0) + (config.logoUrl ? 1 : 0) + (config.bannerUrl ? 1 : 0);
                                const vidCount = (config.featuredVideo ? 1 : 0) + (config.products?.filter(p => isVideo(p.imageUrl)).length || 0);
                                const estimatedMB = (imgCount * 0.5) + (vidCount * 5);
                                const quotaMB = 50;
                                const usagePercent = Math.min(Math.round((estimatedMB / quotaMB) * 100), 100);

                                return (
                                    <div className="flex flex-col items-end w-full">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Server Storage</span>
                                        <div className="w-full flex items-center gap-2">
                                            <Progress value={usagePercent} className={cn("h-2", usagePercent > 90 ? "bg-red-100" : "")} />
                                            <span className={cn("text-[10px] font-bold", usagePercent > 90 ? "text-red-500" : "")}>{usagePercent}%</span>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={async () => { await supabase.auth.signOut(); navigate("/auth"); }}>Log Out</Button>
                            <Button variant="outline" size="sm" onClick={() => setViewMode('buyer')}><Eye className="w-4 h-4 mr-2" /> Preview</Button>
                            <Button onClick={async () => {
                                const success = await saveShop(config);
                                if (success) toast.success("Changes saved successfully!");
                            }}>Save Changes</Button>
                        </div>
                    </div>
                </div>
                {(() => {
                    const daysSinceCreation = differenceInDays(new Date(), new Date(config.createdAt || new Date()));
                    const isPaid = (config.socialLinks as any)?._is_paid;
                    const totalTrialDays = (config.socialLinks as any)?._trial_extended ? 14 : 7;
                    const trialDaysLeft = totalTrialDays - daysSinceCreation;
                    const isTrialExpired = !isPaid && trialDaysLeft <= 0;

                    if (isPaid) return (
                        <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
                                <CheckCircle className="w-4 h-4" /> Lifetime Account Activated
                            </div>
                        </div>
                    );

                    if (isTrialExpired) return (
                        <div className="bg-red-50 border border-red-100 p-2 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2 text-red-700 text-xs font-bold">
                                <AlertTriangle className="w-4 h-4" /> Trial Expired. Please contact support to continue.
                            </div>
                            <Button variant="destructive" size="sm" className="h-7 text-[10px] uppercase font-bold px-3" onClick={() => window.location.href = 'https://wa.me/919914444007'}>Contact Support</Button>
                        </div>
                    );

                    return (
                        <div className="bg-amber-50 border border-amber-100 p-2 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2 text-amber-700 text-xs font-bold">
                                <Clock className="w-4 h-4" /> {trialDaysLeft} Days of Trial Remaining
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-amber-600 font-bold uppercase">Upgrade to Lifetime</span>
                                <Button variant="outline" size="sm" className="h-7 text-[10px] uppercase font-bold px-3 border-amber-200 text-amber-700 hover:bg-amber-100" onClick={() => window.location.href = 'https://wa.me/919914444007'}>Pay Now</Button>
                            </div>
                        </div>
                    );
                })()}
            </header>

            <div className="container max-w-5xl mx-auto p-6">
                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="grid grid-cols-4 w-full h-12">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="leads">Leads</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-6">
                        <ProfileTab config={config} setConfig={setConfig} userId={user?.id} />
                    </TabsContent>

                    <TabsContent value="content" className="space-y-6">
                        <ContentTab config={config} setConfig={setConfig} userId={user?.id} />
                    </TabsContent>

                    <TabsContent value="leads" className="space-y-6">
                        <LeadsTab shopId={config.id} />
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-6">
                        <AdvancedTab config={config} setConfig={setConfig} />
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    );
};

export default Shop;
