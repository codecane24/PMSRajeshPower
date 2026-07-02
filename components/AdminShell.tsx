"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Boxes,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Command,
  CreditCard,
  Download,
  FileBarChart,
  FileText,
  Gauge,
  Headphones,
  Home,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  PackageCheck,
  PlugZap,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
  Wrench,
  X,
  Zap,
  Eye,
  Pencil,
  Trash2,
  type LucideIcon,
} from "lucide-react";

type UserInfo = {
  id: string;
  name: string;
  email: string;
  roles: string[];
};

type PermissionRecord = {
  id: string;
  description?: string | null;
  action?: { id: string; name: string; code: string } | null;
  submodule?: { id: string; name: string } | null;
};

type ModuleRecord = {
  id: string;
  name: string;
  description?: string | null;
  submodules: { id: string; name: string }[];
  permissions: PermissionRecord[];
};

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  roles: string[];
  departmentName: string | null;
  phone?: string | null;
  isActive: boolean;
  lastLogin: string;
  updatedAt: string;
};

type RoleRow = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
};

type DepartmentRow = {
  id: string;
  name: string;
  description?: string | null;
  userCount: number;
};

type SupportRow = {
  id: string;
  code: string;
  type: string;
  priority: string;
  moduleId?: string | null;
  title: string;
  description: string;
  attachmentUrl?: string | null;
  completeDate?: string | null;
  status: string;
  commentsCount: number;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
};

type SupportCommentRow = {
  id: string;
  text: string;
  createdBy?: string | null;
  createdAt: string;
};

type NavItem = { label: string; icon: LucideIcon; badge?: string; subItems?: string[] };

const navigation: { title: string; items: NavItem[] }[] = [
  {
    title: "Workspace",
    items: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Work Orders", icon: BriefcaseBusiness, badge: "12" },
      { label: "Customers", icon: Users },
      { label: "Assets", icon: Boxes },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Field Teams", icon: Wrench },
      { label: "User Management", icon: Users, subItems: ["Users", "Roles", "Departments"] },
      { label: "Billing", icon: CreditCard },
      { label: "Reports", icon: FileBarChart },
      { label: "Documents", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Support", icon: Headphones, subItems: ["Support Tickets"] },
      { label: "Modules", icon: PackageCheck },
      { label: "Settings", icon: Settings },
    ],
  },
];

const horizontalMenus = [
  {
    label: "Operations",
    icon: PlugZap,
    items: ["Service requests", "Preventive maintenance", "Site inspections"],
  },
  {
    label: "Commerce",
    icon: IndianRupee,
    items: ["Invoices & payments", "Quotations", "Vendors & purchase"],
  },
  {
    label: "Intelligence",
    icon: Gauge,
    items: ["Performance reports", "Energy analytics", "Audit activity"],
  },
];

const stats = [
  {
    label: "Active work orders",
    value: "148",
    delta: "12.4%",
    direction: "up",
    note: "vs. last month",
    icon: BriefcaseBusiness,
    tone: "blue",
  },
  {
    label: "Monthly revenue",
    value: "₹42.8L",
    delta: "8.2%",
    direction: "up",
    note: "vs. last month",
    icon: IndianRupee,
    tone: "red",
  },
  {
    label: "Service efficiency",
    value: "94.6%",
    delta: "2.1%",
    direction: "up",
    note: "vs. last month",
    icon: Gauge,
    tone: "green",
  },
  {
    label: "Pending approvals",
    value: "18",
    delta: "3.8%",
    direction: "down",
    note: "vs. last week",
    icon: Clock3,
    tone: "amber",
  },
];

const workOrders = [
  { id: "WO-2847", client: "Apex Industrial Park", service: "Transformer maintenance", date: "27 Jun, 10:30 AM", status: "In progress", avatar: "AI" },
  { id: "WO-2846", client: "Sarthak Textiles", service: "HT panel inspection", date: "27 Jun, 09:15 AM", status: "Scheduled", avatar: "ST" },
  { id: "WO-2845", client: "Meridian Heights", service: "Power audit & testing", date: "26 Jun, 04:40 PM", status: "Completed", avatar: "MH" },
  { id: "WO-2844", client: "Orbit Healthcare", service: "Emergency breakdown", date: "26 Jun, 02:20 PM", status: "Attention", avatar: "OH" },
  { id: "WO-2843", client: "Nova Foods Pvt. Ltd.", service: "DG synchronization", date: "26 Jun, 11:50 AM", status: "Completed", avatar: "NF" },
];

const activity = [
  { icon: CheckCircle2, tone: "green", title: "Work order completed", text: "WO-2845 · Meridian Heights", time: "8 min ago" },
  { icon: CreditCard, tone: "blue", title: "Payment received", text: "₹3,84,500 · Invoice #RP-9812", time: "24 min ago" },
  { icon: UserRound, tone: "purple", title: "Technician assigned", text: "Rohan K. → Apex Industrial Park", time: "1 hr ago" },
  { icon: AlertTriangle, tone: "amber", title: "SLA attention required", text: "WO-2844 · Orbit Healthcare", time: "2 hrs ago" },
];

function labelToSlug(label: string): string {
  return '/' + label.toLowerCase().replace(/\s+/g, '-');
}

function slugToLabel(pathname: string): string {
  const seg = pathname.replace(/^\//, '').replace(/-/g, ' ');
  return seg.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default function AdminShell() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [period, setPeriod] = useState("This month");
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [modules, setModules] = useState<ModuleRecord[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [departments, setDepartments] = useState<DepartmentRow[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [support, setSupport] = useState<SupportRow[]>([]);
  const [loadingSupport, setLoadingSupport] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'New',
    priority: 'Normal',
    moduleId: '',
    title: '',
    description: '',
    completeDate: '',
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [generatedTicketCode, setGeneratedTicketCode] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [viewingTicket, setViewingTicket] = useState<SupportRow | null>(null);
  const [editingTicket, setEditingTicket] = useState<SupportRow | null>(null);
  const [editFormData, setEditFormData] = useState({ status: 'Open', priority: 'Normal', description: '', completeDate: '' });
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [ticketComments, setTicketComments] = useState<SupportCommentRow[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Module CRUD states
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleRecord | null>(null);
  const [viewingModule, setViewingModule] = useState<ModuleRecord | null>(null);
  const [moduleFormData, setModuleFormData] = useState({ name: '', description: '' });
  const [isSubmittingModule, setIsSubmittingModule] = useState(false);
  const [moduleSuccessMessage, setModuleSuccessMessage] = useState<string | null>(null);
  const [newSubmoduleName, setNewSubmoduleName] = useState('');
  const [isAddingSubmodule, setIsAddingSubmodule] = useState(false);
  const [editingSubmodule, setEditingSubmodule] = useState<{ id: string; name: string } | null>(null);
  const [editSubmoduleName, setEditSubmoduleName] = useState('');
  const [isDeletingSubmodule, setIsDeletingSubmodule] = useState<string | null>(null);

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(new Date()),
    []
  );

  function chooseNav(label: string) {
    setActiveNav(label);
    setActiveMenu(label);
    setOpenSubmenu(null);
    setSidebarOpen(false);
    router.push(labelToSlug(label));
  }

  function toggleSubmenu(label: string) {
    setOpenSubmenu((current) => (current === label ? null : label));
  }

  useEffect(() => {
    if (!pathname) return;
    // /dashboard → Overview, /reports → Reports, /support-tickets → Support Tickets, etc.
    if (pathname === '/dashboard') {
      setActiveNav('Overview');
      setActiveMenu('Overview');
    } else {
      const label = slugToLabel(pathname);
      setActiveNav(label);
      setActiveMenu(label);
    }
  }, [pathname]);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (res.ok && data.ok && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to load user info', error);
      } finally {
        setLoadingUser(false);
      }
    }

    async function fetchModules() {
      setLoadingModules(true);
      try {
        const res = await fetch('/api/modules');
        const data = await res.json();
        if (res.ok && data.ok && Array.isArray(data.data)) {
          setModules(data.data);
        }
      } catch (error) {
        console.error('Failed to load modules', error);
      } finally {
        setLoadingModules(false);
      }
    }

    async function fetchUsers() {
      setLoadingUsers(true);
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (res.ok && data.ok && Array.isArray(data.data)) {
          setUsers(data.data);
        }
      } catch (error) {
        console.error('Failed to load users', error);
      } finally {
        setLoadingUsers(false);
      }
    }

    async function fetchRoles() {
      setLoadingRoles(true);
      try {
        const res = await fetch('/api/roles');
        const data = await res.json();
        if (res.ok && data.ok && Array.isArray(data.data)) {
          setRoles(data.data);
        }
      } catch (error) {
        console.error('Failed to load roles', error);
      } finally {
        setLoadingRoles(false);
      }
    }

    async function fetchDepartments() {
      setLoadingDepartments(true);
      try {
        const res = await fetch('/api/departments');
        const data = await res.json();
        if (res.ok && data.ok && Array.isArray(data.data)) {
          setDepartments(data.data);
        }
      } catch (error) {
        console.error('Failed to load departments', error);
      } finally {
        setLoadingDepartments(false);
      }
    }

    async function fetchSupport() {
      setLoadingSupport(true);
      try {
        const res = await fetch('/api/support');
        const data = await res.json();
        if (res.ok && data.ok && Array.isArray(data.data)) {
          setSupport(data.data);
        }
      } catch (error) {
        console.error('Failed to load support tickets', error);
      } finally {
        setLoadingSupport(false);
      }
    }

    fetchMe();
    fetchModules();
    fetchUsers();
    fetchRoles();
    fetchDepartments();
    fetchSupport();
  }, []);

  async function handleCreateSupport() {
    setIsSubmittingForm(true);
    try {
      const payload = {
        ...formData,
        completeDate: formData.completeDate ? new Date(formData.completeDate).toISOString() : null,
        moduleId: formData.moduleId || null,
      };
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSupport([data.data, ...support]);
        setGeneratedTicketCode(data.data.code);
        setSuccessMessage(`Ticket ${data.data.code} created successfully!`);
        setFormData({ type: 'New', priority: 'Normal', moduleId: '', title: '', description: '', completeDate: '' });
        setTimeout(() => { setShowSupportForm(false); setSuccessMessage(null); setGeneratedTicketCode(null); }, 3000);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to create support ticket', error);
      alert('Failed to create support ticket');
    } finally {
      setIsSubmittingForm(false);
    }
  }

  async function handleEditSupport() {
    if (!editingTicket) return;
    setIsSubmittingEdit(true);
    try {
      const payload = {
        status: editFormData.status,
        priority: editFormData.priority,
        description: editFormData.description,
        completeDate: editFormData.completeDate ? new Date(editFormData.completeDate).toISOString() : null,
      };
      const res = await fetch(`/api/support/${editingTicket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSupport(support.map(t => t.id === editingTicket.id ? data.data : t));
        setSuccessMessage(`Ticket ${editingTicket.code} updated successfully!`);
        setEditingTicket(null);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to update support ticket', error);
    } finally {
      setIsSubmittingEdit(false);
    }
  }

  async function handleViewTicket(ticket: SupportRow) {
    setViewingTicket(ticket);
    setEditingTicket(null);
    setTicketComments([]);
    try {
      const res = await fetch(`/api/support/${ticket.id}/comments`);
      const data = await res.json();
      if (res.ok && data.ok && Array.isArray(data.data)) {
        setTicketComments(data.data);
      }
    } catch (error) {
      console.error('Failed to load comments', error);
    }
  }

  async function handleAddComment() {
    if (!viewingTicket || !newComment.trim()) return;
    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/support/${viewingTicket.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment.trim(), createdBy: user?.name || 'User' }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setTicketComments([...ticketComments, data.data]);
        setNewComment('');
        setSupport(support.map(t => t.id === viewingTicket.id ? { ...t, commentsCount: t.commentsCount + 1 } : t));
      }
    } catch (error) {
      console.error('Failed to add comment', error);
    } finally {
      setIsSubmittingComment(false);
    }
  }

  async function handleSaveModule() {
    if (!moduleFormData.name.trim()) return;
    setIsSubmittingModule(true);
    try {
      const url = editingModule ? `/api/modules/${editingModule.id}` : '/api/modules';
      const method = editingModule ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: moduleFormData.name.trim(), description: moduleFormData.description.trim() || null }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        // Refresh modules list
        const refreshed = await fetch('/api/modules');
        const refreshedData = await refreshed.json();
        if (refreshed.ok && refreshedData.ok) setModules(refreshedData.data);
        setModuleSuccessMessage(editingModule ? `Module "${data.data.name}" updated.` : `Module "${data.data.name}" created.`);
        setShowModuleForm(false);
        setEditingModule(null);
        setModuleFormData({ name: '', description: '' });
        setTimeout(() => setModuleSuccessMessage(null), 3000);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to save module', err);
    } finally {
      setIsSubmittingModule(false);
    }
  }

  async function handleAddSubmodule() {
    if (!viewingModule || !newSubmoduleName.trim()) return;
    setIsAddingSubmodule(true);
    try {
      const res = await fetch(`/api/modules/${viewingModule.id}/submodules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubmoduleName.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        const updated = { ...viewingModule, submodules: [...viewingModule.submodules, data.data] };
        setViewingModule(updated);
        setModules(modules.map(m => m.id === viewingModule.id ? updated : m));
        setNewSubmoduleName('');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to add submodule', err);
    } finally {
      setIsAddingSubmodule(false);
    }
  }

  async function handleUpdateSubmodule() {
    if (!viewingModule || !editingSubmodule || !editSubmoduleName.trim()) return;
    try {
      const res = await fetch(`/api/modules/${viewingModule.id}/submodules/${editingSubmodule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editSubmoduleName.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        const updated = { ...viewingModule, submodules: viewingModule.submodules.map(s => s.id === editingSubmodule.id ? { ...s, name: data.data.name } : s) };
        setViewingModule(updated);
        setModules(modules.map(m => m.id === viewingModule.id ? updated : m));
        setEditingSubmodule(null);
        setEditSubmoduleName('');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to update submodule', err);
    }
  }

  async function handleDeleteSubmodule(subId: string) {
    if (!viewingModule) return;
    setIsDeletingSubmodule(subId);
    try {
      const res = await fetch(`/api/modules/${viewingModule.id}/submodules/${subId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.ok) {
        const updated = { ...viewingModule, submodules: viewingModule.submodules.filter(s => s.id !== subId) };
        setViewingModule(updated);
        setModules(modules.map(m => m.id === viewingModule.id ? updated : m));
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to delete submodule', err);
    } finally {
      setIsDeletingSubmodule(null);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      router.push('/');
    }
  }

  return (
    <div className={`admin-layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      {sidebarOpen && <button className="mobile-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}

      <aside className={`sidebar ${sidebarOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <Image
            src="/rajesh-power-logo.png"
            alt="Rajesh Power Services"
            width={190}
            height={80}
            className="sidebar-logo"
            priority
          />
          <div className="brand-mini"><Zap size={22} fill="currentColor" /></div>
          <button className="mobile-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav className="side-nav">
          {navigation.map((section) => (
            <div className="nav-section" key={section.title}>
              <span className="nav-title">{section.title}</span>
              {section.items.map((item) => {
                const Icon = item.icon;
                if (item.subItems?.length) {
                  return (
                    <div className="sub-nav-section" key={item.label}>
                      <button
                        className={`nav-item ${openSubmenu === item.label ? "active" : ""}`}
                        onClick={() => toggleSubmenu(item.label)}
                        title={collapsed ? item.label : undefined}
                        type="button"
                      >
                        <Icon size={19} strokeWidth={1.9} />
                        <span>{item.label}</span>
                        <ChevronDown size={16} className={openSubmenu === item.label ? "submenu-open" : ""} />
                      </button>
                      {openSubmenu === item.label && !collapsed && (
                        <div className="sub-items">
                          {item.subItems.map((subItem) => (
                            <button
                              className={`nav-item sub-item ${activeNav === subItem ? "active" : ""}`}
                              key={subItem}
                              onClick={() => chooseNav(subItem)}
                            >
                              <span>{subItem}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    className={`nav-item ${activeNav === item.label ? "active" : ""}`}
                    key={item.label}
                    onClick={() => chooseNav(item.label)}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={19} strokeWidth={1.9} />
                    <span>{item.label}</span>
                    {item.badge && <em>{item.badge}</em>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-card">
          <div className="sidebar-card-icon"><Sparkles size={18} /></div>
          <strong>Need a hand?</strong>
          <p>Our support team is ready to help.</p>
          <button><MessageSquareText size={15} /> Chat with support</button>
        </div>

        <button className="collapse-button" onClick={() => setCollapsed((value) => !value)}>
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          <span>Collapse sidebar</span>
        </button>
      </aside>

      <div className="admin-main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-trigger" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={21} /></button>
            <button className="global-search" onClick={() => setSearchOpen(true)}>
              <Search size={18} />
              <span>Search anything...</span>
              <kbd><Command size={12} /> K</kbd>
            </button>
          </div>

          <div className="topbar-actions">
            <button className="icon-button help-button" aria-label="Help"><CircleHelp size={20} /></button>
            <div className="popover-wrap">
              <button
                className={`icon-button ${notificationsOpen ? "selected" : ""}`}
                onClick={() => {
                  setNotificationsOpen((value) => !value);
                  setProfileOpen(false);
                }}
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="notification-dot" />
              </button>
              {notificationsOpen && (
                <div className="popover notification-popover">
                  <div className="popover-head"><strong>Notifications</strong><button>Mark all read</button></div>
                  <div className="notification-item unread">
                    <span className="notice-icon warning"><AlertTriangle size={17} /></span>
                    <div><strong>SLA needs attention</strong><p>Work order WO-2844 is nearing its limit.</p><small>12 minutes ago</small></div>
                  </div>
                  <div className="notification-item">
                    <span className="notice-icon success"><Check size={17} /></span>
                    <div><strong>Payment confirmed</strong><p>Invoice RP-9812 has been settled.</p><small>24 minutes ago</small></div>
                  </div>
                  <button className="popover-footer">View all notifications <ArrowRight size={15} /></button>
                </div>
              )}
            </div>

            <span className="topbar-divider" />

            <div className="popover-wrap">
              <button
                className="profile-trigger"
                onClick={() => {
                  setProfileOpen((value) => !value);
                  setNotificationsOpen(false);
                }}
              >
                <span className="profile-avatar">{user ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                <span className="profile-copy">
                  <strong>{user ? user.name : 'Loading...'}</strong>
                  <small>{user ? user.email : 'Fetching user'}</small>
                </span>
                <ChevronDown size={16} />
              </button>
              {profileOpen && (
                <div className="popover profile-popover">
                  <div className="profile-popover-head">
                    <span className="profile-avatar large">{user ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                    <div>
                      <strong>{user ? user.name : 'Loading user'}</strong>
                      <small>{user ? user.email : ''}</small>
                    </div>
                  </div>
                  <button><UserRound size={17} /> My profile</button>
                  <button><Settings size={17} /> Account settings</button>
                  <button className="danger" onClick={handleLogout}><LogOut size={17} /> Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <nav className="horizontal-nav">
          <span className="horizontal-label">Quick access</span>
          {horizontalMenus.map((menu) => {
            const Icon = menu.icon;
            return (
              <div className="horizontal-menu-wrap" key={menu.label}>
                <button
                  className={activeMenu === menu.label ? "active" : ""}
                  onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
                >
                  <Icon size={16} /> {menu.label} <ChevronDown size={14} />
                </button>
                {activeMenu === menu.label && (
                  <div className="horizontal-dropdown">
                    <span>{menu.label}</span>
                    {menu.items.map((item) => <button key={item} onClick={() => { setActiveNav(item); setActiveMenu(null); }}>{item}<ChevronRight size={14} /></button>)}
                  </div>
                )}
              </div>
            );
          })}
          <span className="nav-spacer" />
          <button className="quick-link"><BookOpen size={16} /> Knowledge base</button>
        </nav>

        <main className="dashboard-content">
          <div className="page-heading">
            <div>
              <span className="mobile-date">{today}</span>
              <h1>{activeNav === "Overview" ? "Good morning, Rajesh" : activeNav}</h1>
              <p>{activeNav === "Overview" ? "Here’s what’s happening across your operations today." : `Manage and review ${activeNav.toLowerCase()} across Rajesh Power.`}</p>
            </div>
            <div className="heading-actions">
              <button className="secondary-button"><Download size={17} /> Export report</button>
              <button className="primary-button"><Plus size={18} /> New work order</button>
            </div>
          </div>

          {activeNav === "Modules" ? (
            <section className="modules-view">

              {/* ── Header ── */}
              <div className="panel-header section-header">
                <div>
                  <span className="eyebrow">System Administration</span>
                  <h2>Modules &amp; Permissions</h2>
                  <p>Create modules, manage submodules, and define permission structures.</p>
                </div>
                <button className="primary-button" onClick={() => {
                  setViewingModule(null); setEditingModule(null);
                  setModuleFormData({ name: '', description: '' });
                  setShowModuleForm(true);
                }}><Plus size={17} /> New Module</button>
              </div>

              {/* ── Success Alert ── */}
              {moduleSuccessMessage && (
                <div className="success-alert">
                  <CheckCircle2 size={18} /><span>{moduleSuccessMessage}</span>
                </div>
              )}

              {/* ── Create / Edit Form ── */}
              {(showModuleForm || editingModule) && (
                <div className="sp-form-card" style={{ borderTop: editingModule ? '3px solid #f59e0b' : '3px solid #3b82f6' }}>
                  <div className="sp-form-header">
                    <div className="sp-form-title-block">
                      <span className="sp-form-eyebrow">{editingModule ? 'Edit Module' : 'New Module'}</span>
                      <h3>{editingModule ? `Editing: ${editingModule.name}` : 'Create New Module'}</h3>
                    </div>
                    <button className="close-btn" onClick={() => { setShowModuleForm(false); setEditingModule(null); setModuleFormData({ name: '', description: '' }); }}><X size={18} /></button>
                  </div>
                  <div className="sp-form-body">
                    <div className="sp-section-row sp-row-2col">
                      <div className="form-group">
                        <label>Module Name</label>
                        <input type="text" placeholder="e.g. Billing, HR, Operations…"
                          value={moduleFormData.name}
                          onChange={(e) => setModuleFormData({ ...moduleFormData, name: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Description <span className="optional-tag">Optional</span></label>
                        <input type="text" placeholder="Brief description of this module"
                          value={moduleFormData.description}
                          onChange={(e) => setModuleFormData({ ...moduleFormData, description: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="sp-form-footer">
                    <button className="secondary-button" onClick={() => { setShowModuleForm(false); setEditingModule(null); setModuleFormData({ name: '', description: '' }); }} disabled={isSubmittingModule}>Cancel</button>
                    <button className="primary-button" onClick={handleSaveModule}
                      disabled={isSubmittingModule || !moduleFormData.name.trim()}>
                      {isSubmittingModule ? 'Saving…' : editingModule ? 'Save Changes' : 'Create Module'}
                    </button>
                  </div>
                </div>
              )}

              {/* ── View / Submodule Panel ── */}
              {viewingModule && !editingModule && !showModuleForm && (
                <div className="sp-view-card">
                  <div className="sp-view-header">
                    <div className="sp-view-badges">
                      <span className="mod-icon-badge"><Boxes size={16} /></span>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{viewingModule.name}</h3>
                      <span className="chip">{viewingModule.submodules.length} submodule{viewingModule.submodules.length !== 1 ? 's' : ''}</span>
                      <span className="chip">{viewingModule.permissions.length} permission{viewingModule.permissions.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="sp-view-actions">
                      <button className="secondary-button" onClick={() => {
                        setEditingModule(viewingModule);
                        setModuleFormData({ name: viewingModule.name, description: viewingModule.description || '' });
                        setViewingModule(null);
                        setShowModuleForm(false);
                      }}>Edit</button>
                      <button className="close-btn" onClick={() => setViewingModule(null)}><X size={18} /></button>
                    </div>
                  </div>

                  {viewingModule.description && <p className="sp-view-description" style={{ marginBottom: '20px' }}>{viewingModule.description}</p>}

                  <div className="mod-view-grid">
                    {/* Submodules */}
                    <div className="mod-view-col">
                      <div className="sp-view-section-label">Submodules</div>
                      {viewingModule.submodules.length === 0 ? (
                        <p className="sp-no-comments">No submodules yet.</p>
                      ) : (
                        <div className="mod-sub-list">
                          {viewingModule.submodules.map(sub => (
                            <div key={sub.id} className="mod-sub-item">
                              {editingSubmodule?.id === sub.id ? (
                                <>
                                  <input
                                    type="text"
                                    className="sp-comment-input"
                                    value={editSubmoduleName}
                                    onChange={(e) => setEditSubmoduleName(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleUpdateSubmodule();
                                      if (e.key === 'Escape') { setEditingSubmodule(null); setEditSubmoduleName(''); }
                                    }}
                                    autoFocus
                                  />
                                  <button className="row-action row-action-edit" title="Save" onClick={handleUpdateSubmodule} disabled={!editSubmoduleName.trim()}><Check size={14} /></button>
                                  <button className="row-action" title="Cancel" onClick={() => { setEditingSubmodule(null); setEditSubmoduleName(''); }}><X size={14} /></button>
                                </>
                              ) : (
                                <>
                                  <span className="mod-sub-dot" />
                                  <span style={{ flex: 1 }}>{sub.name}</span>
                                  <button className="row-action row-action-edit" title="Edit" onClick={() => { setEditingSubmodule(sub); setEditSubmoduleName(sub.name); }}><Pencil size={14} /></button>
                                  <button className="row-action row-action-delete" title="Delete" onClick={() => handleDeleteSubmodule(sub.id)} disabled={isDeletingSubmodule === sub.id}>
                                    {isDeletingSubmodule === sub.id ? '…' : <Trash2 size={14} />}
                                  </button>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="sp-comment-input-row" style={{ marginTop: '14px' }}>
                        <input type="text" className="sp-comment-input" placeholder="New submodule name…"
                          value={newSubmoduleName} onChange={(e) => setNewSubmoduleName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubmodule(); }} />
                        <button className="primary-button" onClick={handleAddSubmodule}
                          disabled={isAddingSubmodule || !newSubmoduleName.trim()}>
                          {isAddingSubmodule ? '…' : '+ Add'}
                        </button>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div className="mod-view-col">
                      <div className="sp-view-section-label">Permissions</div>
                      {viewingModule.permissions.length === 0 ? (
                        <p className="sp-no-comments">No permissions assigned.</p>
                      ) : (
                        <div className="mod-perm-list">
                          {viewingModule.permissions.map(perm => {
                            const label = perm.action ? `${perm.action.name} (${perm.action.code})` : perm.description || 'Permission';
                            const sub = perm.submodule ? perm.submodule.name : null;
                            return (
                              <div key={perm.id} className="mod-perm-item">
                                <span className="mod-perm-action">{label}</span>
                                {sub && <span className="mod-perm-sub">{sub}</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Modules Table ── */}
              <div className="panel module-table-panel">
                <div className="table-scroll">
                  <table className="module-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Module Name</th>
                        <th>Submodules</th>
                        <th>Permissions</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingModules ? (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#8a95a4' }}>Loading modules…</td></tr>
                      ) : modules.length === 0 ? (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#8a95a4' }}>No modules found. Click New Module to create one.</td></tr>
                      ) : modules.map((mod, idx) => (
                        <tr key={mod.id} className={viewingModule?.id === mod.id || editingModule?.id === mod.id ? 'tr-active' : ''}>
                          <td>{idx + 1}</td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <strong>{mod.name}</strong>
                              {mod.description && <small style={{ color: '#8a95a4', fontWeight: 400 }}>{mod.description}</small>}
                            </div>
                          </td>
                          <td>
                            {mod.submodules.length === 0 ? <em style={{ color: '#8a95a4' }}>None</em> : (
                              <div className="chip-list">
                                {mod.submodules.slice(0, 3).map(sub => <span className="chip" key={sub.id}>{sub.name}</span>)}
                                {mod.submodules.length > 3 && <span className="chip">+{mod.submodules.length - 3}</span>}
                              </div>
                            )}
                          </td>
                          <td>
                            {mod.permissions.length === 0 ? <em style={{ color: '#8a95a4' }}>None</em> : (
                              <div className="chip-list">
                                {mod.permissions.slice(0, 2).map(p => {
                                  const label = p.action ? p.action.code : p.description || '—';
                                  return <span className="chip" key={p.id}>{label}</span>;
                                })}
                                {mod.permissions.length > 2 && <span className="chip">+{mod.permissions.length - 2}</span>}
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="sp-row-actions">
                              <button className="row-action" title="View" onClick={() => { setViewingModule(mod); setEditingModule(null); setShowModuleForm(false); }}><Eye size={15} /></button>
                              <button className="row-action row-action-edit" title="Edit" onClick={() => {
                                setEditingModule(mod);
                                setModuleFormData({ name: mod.name, description: mod.description || '' });
                                setViewingModule(null); setShowModuleForm(false);
                              }}><Pencil size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : activeNav === "Users" ? (
            <section className="users-view">
              <div className="panel-header section-header">
                <div>
                  <span className="eyebrow">User Management</span>
                  <h2>Users</h2>
                  <p>Manage your active users, roles, departments, and connection details.</p>
                </div>
                <button className="primary-button" onClick={() => setActiveNav("Overview")}><Home size={17} /> Back to overview</button>
              </div>

              <div className="panel user-table-panel">
                <div className="table-scroll">
                  <table className="module-table">
                    <thead>
                      <tr>
                        <th>S. No</th>
                        <th>Name</th>
                        <th>Role & department</th>
                        <th>Phone & email</th>
                        <th>Status</th>
                        <th>Last login</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingUsers ? (
                        <tr><td colSpan={7}>Loading users…</td></tr>
                      ) : users.length === 0 ? (
                        <tr><td colSpan={7}>No users available.</td></tr>
                      ) : users.map((userRow, index) => (
                        <tr key={userRow.id}>
                          <td>{index + 1}</td>
                          <td>
                            <strong>{userRow.name || 'Unknown'}</strong>
                            <small>{userRow.email}</small>
                          </td>
                          <td>
                            <div>{userRow.roles.length > 0 ? userRow.roles.join(', ') : 'No role assigned'}</div>
                            <small>{userRow.departmentName || 'No department'}</small>
                          </td>
                          <td>
                            <div>{userRow.phone || '-'} </div>
                            <small>{userRow.email}</small>
                          </td>
                          <td>
                            <span className={`status ${userRow.isActive ? 'active' : 'inactive'}`}>
                              {userRow.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(userRow.lastLogin).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                          <td><button className="row-action" title="View"><Eye size={15} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : activeNav === "Roles" ? (
            <section className="roles-view">
              <div className="panel-header section-header">
                <div>
                  <span className="eyebrow">User Management</span>
                  <h2>Roles</h2>
                  <p>Review role definitions and manage access levels without superuser roles.</p>
                </div>
                <button className="primary-button" onClick={() => setActiveNav("Overview")}><Home size={17} /> Back to overview</button>
              </div>

              <div className="panel module-table-panel">
                <div className="table-scroll">
                  <table className="module-table">
                    <thead>
                      <tr>
                        <th>S. No</th>
                        <th>Role name</th>
                        <th>Description</th>
                        <th>Created</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingRoles ? (
                        <tr><td colSpan={5}>Loading roles…</td></tr>
                      ) : roles.length === 0 ? (
                        <tr><td colSpan={5}>No roles found.</td></tr>
                      ) : roles.map((roleRow, index) => (
                        <tr key={roleRow.id}>
                          <td>{index + 1}</td>
                          <td><strong>{roleRow.name}</strong></td>
                          <td>{roleRow.description || 'No description'}</td>
                          <td>{new Date(roleRow.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                          <td><button className="row-action row-action-edit" title="Edit"><Pencil size={14} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : activeNav === "Departments" ? (
            <section className="departments-view">
              <div className="panel-header section-header">
                <div>
                  <span className="eyebrow">User Management</span>
                  <h2>Departments</h2>
                  <p>View department groups and the number of users assigned to each.</p>
                </div>
                <button className="primary-button" onClick={() => setActiveNav("Overview")}><Home size={17} /> Back to overview</button>
              </div>

              <div className="panel module-table-panel">
                <div className="table-scroll">
                  <table className="module-table">
                    <thead>
                      <tr>
                        <th>S. No</th>
                        <th>Department</th>
                        <th>Description</th>
                        <th>User count</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingDepartments ? (
                        <tr><td colSpan={5}>Loading departments…</td></tr>
                      ) : departments.length === 0 ? (
                        <tr><td colSpan={5}>No departments found.</td></tr>
                      ) : departments.map((department, index) => (
                        <tr key={department.id}>
                          <td>{index + 1}</td>
                          <td><strong>{department.name}</strong></td>
                          <td>{department.description || 'No description'}</td>
                          <td>{department.userCount}</td>
                          <td><button className="row-action" title="Manage"><SlidersHorizontal size={14} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : activeNav === "Support Tickets" ? (
            <section className="support-view">

              {/* ── Section Header ── */}
              <div className="panel-header section-header">
                <div>
                  <span className="eyebrow">Support Management</span>
                  <h2>Support Tickets</h2>
                  <p>Track and manage all support requests across your organization.</p>
                </div>
                <button className="primary-button" onClick={async () => {
                  setViewingTicket(null);
                  setEditingTicket(null);
                  setShowSupportForm(true);
                  setGeneratedTicketCode(null);
                  try {
                    const res = await fetch('/api/support/preview-code');
                    const data = await res.json();
                    if (res.ok && data.ok) setGeneratedTicketCode(data.data.code);
                    else console.error('Preview code error:', data.error);
                  } catch (err) { console.error('Preview code fetch failed:', err); }
                }}><Plus size={17} /> New Ticket</button>
              </div>

              {/* ── Success Alert ── */}
              {successMessage && (
                <div className="success-alert">
                  <CheckCircle2 size={18} />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* ── Create Form ── */}
              {showSupportForm && !editingTicket && (
                <div className="sp-form-card">
                  <div className="sp-form-header">
                    <div className="sp-form-title-block">
                      <span className="sp-form-eyebrow">New Ticket</span>
                      <h3>Create New Support Ticket</h3>
                    </div>
                    <div className="sp-form-header-right">
                      {generatedTicketCode && (
                        <div className="sp-code-badge">
                          <span className="sp-code-label">Ticket No.</span>
                          <span className="sp-code-value">{generatedTicketCode}</span>
                        </div>
                      )}
                      <button className="close-btn" onClick={() => { setShowSupportForm(false); setGeneratedTicketCode(null); }}><X size={18} /></button>
                    </div>
                  </div>

                  <div className="sp-form-body">
                    {/* Row 1: Type + Priority */}
                    <div className="sp-section-row">
                      <div className="form-group">
                        <label>Type</label>
                        <div className="sp-type-tabs">
                          {['New', 'Modification', 'Error'].map(t => (
                            <button key={t} type="button"
                              className={`sp-type-tab sp-type-${t.toLowerCase()} ${formData.type === t ? 'active' : ''}`}
                              onClick={() => setFormData({ ...formData, type: t })}>{t}</button>
                          ))}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Priority</label>
                        <div className="sp-priority-group">
                          {[
                            { label: 'Critical', color: '#dc2626' },
                            { label: 'High', color: '#ea580c' },
                            { label: 'Moderate', color: '#d97706' },
                            { label: 'Normal', color: '#2563eb' },
                            { label: 'Low', color: '#16a34a' },
                          ].map(p => (
                            <button key={p.label} type="button"
                              className={`sp-priority-pill ${formData.priority === p.label ? 'active' : ''}`}
                              style={{ '--pill-color': p.color } as React.CSSProperties}
                              onClick={() => setFormData({ ...formData, priority: p.label })}>{p.label}</button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Module + Complete Date */}
                    <div className="sp-section-row sp-row-2col">
                      <div className="form-group">
                        <label>Module <span className="optional-tag">Optional</span></label>
                        <select value={formData.moduleId} onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}>
                          <option value="">— Select Module —</option>
                          {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Complete Date</label>
                        <input type="date" value={formData.completeDate} onChange={(e) => setFormData({ ...formData, completeDate: e.target.value })} />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="form-group">
                      <label>Title</label>
                      <input type="text" placeholder="Brief title of the issue…" value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                      <label>Description</label>
                      <textarea placeholder="Describe the issue in detail — steps to reproduce, expected vs actual behaviour…" rows={6}
                        value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>

                    {/* File Upload */}
                    <div className="form-group">
                      <label>Attachment <span className="optional-tag">Optional</span></label>
                      <div className="sp-file-zone">
                        <input type="file" id="sp-file-new" style={{ display: 'none' }} />
                        <label htmlFor="sp-file-new" className="sp-file-inner">
                          <div className="sp-file-icon-wrap"><Plus size={20} /></div>
                          <div>
                            <strong>Click to upload</strong> or drag &amp; drop
                            <small>PNG, JPG, PDF, DOCX up to 10 MB</small>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="sp-form-footer">
                    <button className="secondary-button" onClick={() => { setShowSupportForm(false); setGeneratedTicketCode(null); }} disabled={isSubmittingForm}>Cancel</button>
                    <button className="primary-button" onClick={handleCreateSupport}
                      disabled={isSubmittingForm || !formData.title.trim() || !formData.description.trim()}>
                      {isSubmittingForm ? 'Creating…' : 'Create Ticket'}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Edit Form ── */}
              {editingTicket && (
                <div className="sp-form-card sp-edit-card">
                  <div className="sp-form-header">
                    <div className="sp-form-title-block">
                      <span className="sp-form-eyebrow">Editing Ticket</span>
                      <h3>{editingTicket.title}</h3>
                    </div>
                    <div className="sp-form-header-right">
                      <div className="sp-code-badge">
                        <span className="sp-code-label">Ticket No.</span>
                        <span className="sp-code-value">{editingTicket.code}</span>
                      </div>
                      <button className="close-btn" onClick={() => setEditingTicket(null)}><X size={18} /></button>
                    </div>
                  </div>

                  <div className="sp-form-body">
                    <div className="sp-section-row">
                      <div className="form-group">
                        <label>Priority</label>
                        <div className="sp-priority-group">
                          {[
                            { label: 'Critical', color: '#dc2626' },
                            { label: 'High', color: '#ea580c' },
                            { label: 'Moderate', color: '#d97706' },
                            { label: 'Normal', color: '#2563eb' },
                            { label: 'Low', color: '#16a34a' },
                          ].map(p => (
                            <button key={p.label} type="button"
                              className={`sp-priority-pill ${editFormData.priority === p.label ? 'active' : ''}`}
                              style={{ '--pill-color': p.color } as React.CSSProperties}
                              onClick={() => setEditFormData({ ...editFormData, priority: p.label })}>{p.label}</button>
                          ))}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Status</label>
                        <select value={editFormData.status} onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}>
                          <option>Open</option>
                          <option>In Progress</option>
                          <option>Resolved</option>
                          <option>Closed</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Complete Date</label>
                        <input type="date" value={editFormData.completeDate} onChange={(e) => setEditFormData({ ...editFormData, completeDate: e.target.value })} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea rows={6} value={editFormData.description}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} />
                    </div>
                  </div>

                  <div className="sp-form-footer">
                    <button className="secondary-button" onClick={() => setEditingTicket(null)} disabled={isSubmittingEdit}>Cancel</button>
                    <button className="primary-button" onClick={handleEditSupport}
                      disabled={isSubmittingEdit || !editFormData.description.trim()}>
                      {isSubmittingEdit ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* ── View Panel ── */}
              {viewingTicket && !editingTicket && (
                <div className="sp-view-card">
                  <div className="sp-view-header">
                    <div className="sp-view-badges">
                      <span className="sp-code-badge">
                        <span className="sp-code-label">Ticket No.</span>
                        <span className="sp-code-value">{viewingTicket.code}</span>
                      </span>
                      <span className={`chip priority-${viewingTicket.priority.toLowerCase()}`}>{viewingTicket.priority}</span>
                      <span className={`status ${viewingTicket.status.toLowerCase().replace(/\s+/g, '-')}`}>{viewingTicket.status}</span>
                      <span className="chip">{viewingTicket.type}</span>
                    </div>
                    <div className="sp-view-actions">
                      <button className="secondary-button" onClick={() => {
                        setEditingTicket(viewingTicket);
                        setEditFormData({ status: viewingTicket.status, priority: viewingTicket.priority, description: viewingTicket.description, completeDate: viewingTicket.completeDate ? viewingTicket.completeDate.split('T')[0] : '' });
                        setViewingTicket(null);
                      }}>Edit</button>
                      <button className="close-btn" onClick={() => setViewingTicket(null)}><X size={18} /></button>
                    </div>
                  </div>

                  <h3 className="sp-view-title">{viewingTicket.title}</h3>

                  <div className="sp-view-meta">
                    <div className="sp-meta-item"><span className="sp-meta-label">Created by</span><span>{viewingTicket.createdBy || 'System'}</span></div>
                    <div className="sp-meta-item"><span className="sp-meta-label">Created on</span><span>{new Date(viewingTicket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                    {viewingTicket.completeDate && <div className="sp-meta-item"><span className="sp-meta-label">Due date</span><span>{new Date(viewingTicket.completeDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>}
                    <div className="sp-meta-item"><span className="sp-meta-label">Comments</span><span>{viewingTicket.commentsCount}</span></div>
                  </div>

                  <div className="sp-view-section">
                    <div className="sp-view-section-label">Description</div>
                    <p className="sp-view-description">{viewingTicket.description}</p>
                  </div>

                  <div className="sp-view-section">
                    <div className="sp-view-section-label">Comments &amp; Replies</div>
                    <div className="sp-comments-list">
                      {ticketComments.length === 0 ? (
                        <p className="sp-no-comments">No comments yet. Be the first to comment.</p>
                      ) : ticketComments.map(c => (
                        <div key={c.id} className="sp-comment">
                          <div className="sp-comment-avatar">{(c.createdBy || 'U').charAt(0).toUpperCase()}</div>
                          <div className="sp-comment-body">
                            <div className="sp-comment-meta">
                              <strong>{c.createdBy || 'User'}</strong>
                              <time>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
                            </div>
                            <p>{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="sp-comment-input-row">
                      <input type="text" className="sp-comment-input" placeholder="Add a comment…"
                        value={newComment} onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }} />
                      <button className="primary-button" onClick={handleAddComment} disabled={isSubmittingComment || !newComment.trim()}>
                        {isSubmittingComment ? '…' : 'Send'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Tickets Table ── */}
              <div className="panel module-table-panel">
                <div className="table-scroll">
                  <table className="module-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Code</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Comments</th>
                        <th>Created by</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingSupport ? (
                        <tr><td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: '#8a95a4' }}>Loading tickets…</td></tr>
                      ) : support.length === 0 ? (
                        <tr><td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: '#8a95a4' }}>No support tickets found. Click New Ticket to create one.</td></tr>
                      ) : support.map((ticket, index) => (
                        <tr key={ticket.id} className={viewingTicket?.id === ticket.id || editingTicket?.id === ticket.id ? 'tr-active' : ''}>
                          <td>{index + 1}</td>
                          <td><code className="sp-ticket-code">{ticket.code}</code></td>
                          <td style={{ maxWidth: '240px' }}><span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</span></td>
                          <td><span className="chip">{ticket.type}</span></td>
                          <td><span className={`chip priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span></td>
                          <td><span className={`status ${ticket.status.toLowerCase().replace(/\s+/g, '-')}`}>{ticket.status}</span></td>
                          <td><span className="comment-count">{ticket.commentsCount}</span></td>
                          <td>{ticket.createdBy || 'System'}</td>
                          <td>
                            <div className="sp-row-actions">
                              <button className="row-action" title="View" onClick={() => handleViewTicket(ticket)}><Eye size={15} /></button>
                              <button className="row-action row-action-edit" title="Edit" onClick={() => {
                                setViewingTicket(null);
                                setShowSupportForm(false);
                                setEditingTicket(ticket);
                                setEditFormData({ status: ticket.status, priority: ticket.priority, description: ticket.description, completeDate: ticket.completeDate ? ticket.completeDate.split('T')[0] : '' });
                              }}><Pencil size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : (
            <>
              <section className="stats-grid">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <article className="stat-card" key={stat.label}>
                      <div className="stat-top">
                        <span className={`stat-icon ${stat.tone}`}><Icon size={20} /></span>
                        <button aria-label={`More options for ${stat.label}`}><MoreHorizontal size={20} /></button>
                      </div>
                      <span className="stat-label">{stat.label}</span>
                      <div className="stat-value-row">
                        <strong>{stat.value}</strong>
                        <span className={stat.direction === "down" ? "negative" : "positive"}>
                          {stat.direction === "down" ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                          {stat.delta}
                        </span>
                      </div>
                      <small>{stat.note}</small>
                    </article>
                  );
                })}
              </section>

              <section className="dashboard-grid">
                <article className="panel revenue-panel">
                  <div className="panel-header">
                    <div><h2>Revenue overview</h2><p>Income performance across the year</p></div>
                    <select value={period} onChange={(event) => setPeriod(event.target.value)}>
                      <option>This month</option>
                      <option>Last 3 months</option>
                      <option>This year</option>
                    </select>
                  </div>
                  <div className="chart-summary">
                    <div><span>Total revenue</span><strong>₹42,84,750</strong></div>
                    <span className="positive"><TrendingUp size={15} /> 8.2% from last month</span>
                  </div>
                  <RevenueChart />
                  <div className="chart-legend"><span><i className="legend-current" /> Current period</span><span><i className="legend-previous" /> Previous period</span></div>
                </article>

                <article className="panel performance-panel">
                  <div className="panel-header">
                    <div><h2>Service performance</h2><p>Monthly completion score</p></div>
                    <button className="panel-action"><MoreHorizontal size={19} /></button>
                  </div>
                  <div className="gauge-wrap">
                    <svg viewBox="0 0 200 118" role="img" aria-label="94.6 percent service performance">
                      <path className="gauge-bg" d="M 25 100 A 75 75 0 0 1 175 100" />
                      <path className="gauge-value" d="M 25 100 A 75 75 0 0 1 175 100" />
                    </svg>
                    <div className="gauge-number"><strong>94.6%</strong><span>Excellent</span></div>
                  </div>
                  <div className="performance-list">
                    <div><span><i className="dot blue" /> On-time completion</span><strong>96%</strong></div>
                    <div><span><i className="dot red" /> First-time resolution</span><strong>92%</strong></div>
                    <div><span><i className="dot green" /> Customer satisfaction</span><strong>4.8/5</strong></div>
                  </div>
                </article>
              </section>

              <section className="dashboard-grid lower-grid">
                <article className="panel work-panel">
                  <div className="panel-header">
                    <div><h2>Recent work orders</h2><p>Latest service activity across all locations</p></div>
                    <div className="table-actions">
                      <button><SlidersHorizontal size={16} /> Filter</button>
                      <button className="view-all">View all <ArrowRight size={15} /></button>
                    </div>
                  </div>
                  <div className="table-scroll">
                    <table>
                      <thead><tr><th>Order</th><th>Customer & service</th><th>Scheduled</th><th>Status</th><th /></tr></thead>
                      <tbody>
                        {workOrders.map((order, index) => (
                          <tr key={order.id}>
                            <td><strong>{order.id}</strong></td>
                            <td>
                              <div className="customer-cell">
                                <span className={`customer-avatar tone-${index % 4}`}>{order.avatar}</span>
                                <div><strong>{order.client}</strong><small>{order.service}</small></div>
                              </div>
                            </td>
                            <td>{order.date}</td>
                            <td><span className={`status ${order.status.toLowerCase().replace(" ", "-")}`}>{order.status}</span></td>
                            <td><button className="row-action"><ChevronRight size={17} /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>

                <article className="panel activity-panel">
                  <div className="panel-header">
                    <div><h2>Live activity</h2><p>Updates from your team</p></div>
                    <span className="live-label"><i /> Live</span>
                  </div>
                  <div className="activity-list">
                    {activity.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div className="activity-item" key={item.title}>
                          <span className={`activity-icon ${item.tone}`}><Icon size={17} /></span>
                          <div><strong>{item.title}</strong><p>{item.text}</p><small>{item.time}</small></div>
                        </div>
                      );
                    })}
                  </div>
                  <button className="activity-button">See complete activity <ArrowRight size={15} /></button>
                </article>
              </section>
            </>
          )}
        </main>

        <nav className="mobile-bottom-nav">
          {[
            { label: "Home", icon: Home, target: "Overview" },
            { label: "Orders", icon: BriefcaseBusiness, target: "Work Orders" },
            { label: "New", icon: Plus, target: "New work order" },
            { label: "Alerts", icon: Bell, target: "Alerts" },
            { label: "Profile", icon: UserRound, target: "Profile" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={`${activeNav === item.target ? "active" : ""} ${item.label === "New" ? "new-action" : ""}`}
                key={item.label}
                onClick={() => chooseNav(item.target)}
              >
                <span><Icon size={item.label === "New" ? 22 : 19} /></span>
                <small>{item.label}</small>
              </button>
            );
          })}
        </nav>
      </div>

      {searchOpen && (
        <div className="search-modal-backdrop" onClick={() => setSearchOpen(false)}>
          <div className="search-modal" onClick={(event) => event.stopPropagation()}>
            <div className="search-modal-input"><Search size={20} /><input autoFocus placeholder="Search work orders, customers, invoices..." /><kbd>ESC</kbd></div>
            <div className="search-suggestions">
              <span>QUICK ACTIONS</span>
              <button onClick={() => setSearchOpen(false)}><BriefcaseBusiness size={18} /><div><strong>Create work order</strong><small>Start a new service request</small></div><ChevronRight size={16} /></button>
              <button onClick={() => setSearchOpen(false)}><Users size={18} /><div><strong>Find customer</strong><small>Search customer directory</small></div><ChevronRight size={16} /></button>
              <button onClick={() => setSearchOpen(false)}><FileBarChart size={18} /><div><strong>Open reports</strong><small>View performance analytics</small></div><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RevenueChart() {
  return (
    <div className="chart-area">
      <div className="chart-y-labels"><span>50L</span><span>40L</span><span>30L</span><span>20L</span><span>10L</span><span>0</span></div>
      <svg viewBox="0 0 700 220" preserveAspectRatio="none" role="img" aria-label="Revenue trend chart">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1261d8" stopOpacity=".24" />
            <stop offset="100%" stopColor="#1261d8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 60, 100, 140, 180, 219].map((y) => <line key={y} x1="0" x2="700" y1={y} y2={y} className="chart-grid-line" />)}
        <path className="chart-previous" d="M0,178 C55,160 70,185 120,155 S205,125 245,140 S330,150 370,112 S450,90 490,104 S575,82 610,78 S675,64 700,72" />
        <path className="chart-area-fill" d="M0,187 C50,178 75,150 120,162 S198,128 245,120 S325,138 370,92 S450,68 490,78 S570,48 610,57 S672,30 700,39 L700,220 L0,220 Z" />
        <path className="chart-current" d="M0,187 C50,178 75,150 120,162 S198,128 245,120 S325,138 370,92 S450,68 490,78 S570,48 610,57 S672,30 700,39" />
        <circle cx="700" cy="39" r="5" className="chart-dot" />
      </svg>
      <div className="chart-x-labels">{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => <span key={month}>{month}</span>)}</div>
    </div>
  );
}
