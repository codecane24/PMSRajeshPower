"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Headphones,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

type ToastState = { message: string; type: 'success' | 'error' } | null;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@rajeshpower.com");
  const [password, setPassword] = useState("power@2026");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setToast({ message: data.error || 'Login failed. Check your credentials.', type: 'error' });
        setLoading(false);
        return;
      }

      setToast({ message: 'Signed in successfully. Redirecting…', type: 'success' });
      window.setTimeout(() => {
        router.push(data.redirect || '/dashboard');
      }, 650);
    } catch (error) {
      setToast({ message: 'Unable to connect to the server. Try again later.', type: 'error' });
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="login-grid" />
        <div className="login-glow login-glow-one" />
        <div className="login-glow login-glow-two" />

        <div className="visual-top">
          <Image
            src="/rajesh-power-logo.png"
            alt="Rajesh Power Services"
            width={282}
            height={119}
            className="brand-logo light-logo"
            priority
          />
          <span className="secure-pill">
            <ShieldCheck size={15} />
            Secure portal
          </span>
        </div>

        <div className="visual-copy">
          <span className="eyebrow">
            <Sparkles size={15} /> Powering better operations
          </span>
          <h1>Every connection.<br />One powerful view.</h1>
          <p>
            Monitor services, manage teams, and keep every customer connected
            from one intelligent command center.
          </p>

          {/* <div className="login-proof">
            <div className="proof-stack">
              <span>RK</span><span>PS</span><span>AM</span><span>+8</span>
            </div>
            <div>
              <strong>Trusted by the operations team</strong>
              <small><CheckCircle2 size={13} /> All systems operational</small>
            </div>
          </div> */}
        </div>

        <div className="visual-footer">
          <span>© 2026 Rajesh Power Services Ltd.</span>
          <span><Zap size={14} fill="currentColor" /> Built for reliable service</span>
        </div>
      </section>

      <section className="login-panel">
        <div className="mobile-brand">
          <Image
            src="/rajesh-power-logo.png"
            alt="Rajesh Power Services"
            width={210}
            height={89}
            className="brand-logo"
            priority
          />
        </div>

        <div className="login-form-wrap">
          <div className="welcome-icon"><Zap size={23} fill="currentColor" /></div>
          <span className="login-kicker">ADMIN CONSOLE</span>
          <h2>Welcome back</h2>
          <p className="login-subtitle">Sign in to continue to your operations dashboard.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <label>
              <span>Email address</span>
              <div className="input-wrap">
                <Mail size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  required
                />
              </div>
            </label>

            <label>
              <span>Password</span>
              <div className="input-wrap">
                <LockKeyhole size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="form-options">
              <label className="check-label">
                <input type="checkbox" defaultChecked />
                <span className="custom-check"><CheckCircle2 size={12} /></span>
                Remember me
              </label>
              <button type="button" className="text-button">Forgot password?</button>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              <span>{loading ? "Signing you in..." : "Sign in to dashboard"}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="login-help">
            <Headphones size={18} />
            <span>Need help? <button type="button">Contact IT support</button></span>
          </div>
        </div>
      </section>
      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          <div className="toast-icon">{toast.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}</div>
          <span>{toast.message}</span>
        </div>
      )}
    </main>
  );
}
