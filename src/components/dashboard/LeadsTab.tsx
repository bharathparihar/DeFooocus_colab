import { motion } from 'framer-motion';
import { MessageSquare, Calendar, Check, Trash2, Clock, Phone, Mail, User, FileText, Bell } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function LeadsTab() {
  const { shopData, updateShopData } = useShop();
  const { inquiries, appointments } = shopData;

  const todayInquiries = inquiries.filter(i => i.isToday);
  const otherInquiries = inquiries.filter(i => !i.isToday);
  
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');

  const handleMarkResponded = (id: string) => {
    const updated = inquiries.map(i => 
      i.id === id ? { ...i, isResponded: true } : i
    );
    updateShopData({ inquiries: updated });
  };

  const handleDeleteInquiry = (id: string) => {
    updateShopData({ inquiries: inquiries.filter(i => i.id !== id) });
  };

  const handleUpdateAppointmentStatus = (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    const updated = appointments.map(a => 
      a.id === id ? { ...a, status } : a
    );
    updateShopData({ appointments: updated });
  };

  const handleDeleteAppointment = (id: string) => {
    updateShopData({ appointments: appointments.filter(a => a.id !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{inquiries.length}</div>
              <div className="text-sm text-muted-foreground">Total Inquiries</div>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10">
              <Bell className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold">{todayInquiries.length}</div>
              <div className="text-sm text-muted-foreground">Today</div>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-warning/10">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold">{pendingAppointments.length}</div>
              <div className="text-sm text-muted-foreground">Pending Bookings</div>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-success/10">
              <Check className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold">{confirmedAppointments.length}</div>
              <div className="text-sm text-muted-foreground">Confirmed</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Inquiries Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dashboard-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">Inquiries</h2>
        </div>

        {/* Today's Inquiries */}
        {todayInquiries.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Today
            </h3>
            <div className="space-y-3">
              {todayInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className={cn(
                    'p-4 rounded-xl border transition-colors',
                    inquiry.isResponded 
                      ? 'bg-secondary/30 border-border' 
                      : 'bg-accent/5 border-accent/20'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{inquiry.name}</span>
                        {!inquiry.isResponded && (
                          <span className="badge-new">New</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {inquiry.phone}
                        </span>
                        {inquiry.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {inquiry.email}
                          </span>
                        )}
                      </div>
                      <p className="text-foreground">{inquiry.message}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      {!inquiry.isResponded && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkResponded(inquiry.id)}
                          className="text-success hover:text-success"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteInquiry(inquiry.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Previous Inquiries */}
        {otherInquiries.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Previous</h3>
            <div className="space-y-3">
              {otherInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className={cn(
                    'p-4 rounded-xl border',
                    inquiry.isResponded 
                      ? 'bg-secondary/30 border-border' 
                      : 'bg-card border-border'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{inquiry.name}</span>
                        {inquiry.isResponded && (
                          <span className="badge-success">Responded</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{inquiry.message}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      {!inquiry.isResponded && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkResponded(inquiry.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteInquiry(inquiry.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {inquiries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No inquiries yet</p>
          </div>
        )}
      </motion.section>

      {/* Appointments Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="dashboard-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">Appointments</h2>
        </div>

        {/* Pending Appointments */}
        {pendingAppointments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Confirmation
            </h3>
            <div className="space-y-3">
              {pendingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 rounded-xl bg-warning/5 border border-warning/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{appointment.name}</span>
                        <span className="badge-warning">Pending</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(appointment.preferredDate), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {appointment.preferredTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {appointment.phone}
                        </span>
                        {appointment.service && (
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {appointment.service}
                          </span>
                        )}
                      </div>
                      {appointment.notes && (
                        <p className="mt-2 text-sm text-foreground">{appointment.notes}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmed')}
                        className="bg-success hover:bg-success/90"
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmed Appointments */}
        {confirmedAppointments.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Confirmed
            </h3>
            <div className="space-y-3">
              {confirmedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 rounded-xl bg-success/5 border border-success/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{appointment.name}</span>
                        <span className="badge-success">Confirmed</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(appointment.preferredDate), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {appointment.preferredTime}
                        </span>
                        {appointment.service && (
                          <span>{appointment.service}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateAppointmentStatus(appointment.id, 'completed')}
                        className="text-success hover:text-success"
                      >
                        Complete
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {appointments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No appointments yet</p>
          </div>
        )}
      </motion.section>
    </div>
  );
}
