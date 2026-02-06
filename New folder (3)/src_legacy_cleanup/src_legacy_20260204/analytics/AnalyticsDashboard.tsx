import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { ShopStats } from "@/types/shop";
import { Eye, MousePointerClick, MessageCircle } from "lucide-react";

interface AnalyticsDashboardProps {
    stats: ShopStats;
}

export const AnalyticsDashboard = ({ stats }: AnalyticsDashboardProps) => {
    const views = stats.views || 0;
    const clicks = stats.clicks || 0;
    const conversions = stats.ctaClicks || 0;

    // Calculate conversion rate (Conversions / Views * 100)
    const conversionRate = views > 0 ? ((conversions / views) * 100).toFixed(1) : "0";
    const clickThroughRate = views > 0 ? ((clicks / views) * 100).toFixed(1) : "0";

    return (
        <div className="grid gap-4 grid-cols-2 animate-fade-in">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{views.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        Total visit to your shop
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{clicks.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        {clickThroughRate}% click-through rate
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{conversions.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        Inquiries and WhatsApp clicks
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{conversionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        Visits turning into actions
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
