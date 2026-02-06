import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Save, Settings, LayoutDashboard, FileText, MessageSquare, Zap } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';
import { DashboardTab } from '@/types/catalog';
import { cn } from '@/lib/utils';
import { ProfileTab } from '@/components/dashboard/ProfileTab';
import { ContentTab } from '@/components/dashboard/ContentTab';
import { LeadsTab } from '@/components/dashboard/LeadsTab';
import { AdvancedTab } from '@/components/dashboard/AdvancedTab';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const tabs: { id: DashboardTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'profile', label: 'Profile', icon: LayoutDashboard },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'leads', label: 'Leads', icon: MessageSquare },
  { id: 'advanced', label: 'Advanced', icon: Zap },
];

export function SellerDashboard() {
  const { shopData, isPreviewMode, setIsPreviewMode } = useShop();
  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const todayLeadsCount = shopData.inquiries.filter(i => i.isToday).length +
    shopData.appointments.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <div className="app-container">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-display font-bold text-foreground">
                B Catalog
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Preview Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="h-9 px-3"
              >
                {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>

              {/* View Live Button */}
              <Link to={`/shop/${shopData.info.alias}`}>
                <Button variant="outline" size="sm" className="h-9 px-3">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={isSaving}
                size="sm"
                className="h-9 px-3 bg-primary text-primary-foreground"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="sticky top-16 z-30 bg-card border-b border-border px-2">
          <nav className="tabs-scroll">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'leads' && todayLeadsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-accent text-accent-foreground">
                    {todayLeadsCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <main className="px-4 py-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'content' && <ContentTab />}
            {activeTab === 'leads' && <LeadsTab />}
            {activeTab === 'advanced' && <AdvancedTab />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
