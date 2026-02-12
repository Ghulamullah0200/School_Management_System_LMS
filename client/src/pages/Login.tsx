import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
    const [, setLocation] = useLocation();
    const { login } = useAuth();
    const searchParams = new URLSearchParams(window.location.search);
    const role = searchParams.get('role') || 'admin';

    const roleNames: Record<string, string> = {
        'admin': 'Super Admin',
        'teacher': 'Teacher',
        'student': 'Student',
        'parent': 'Parent'
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(email, password, role);
            // Redirect to appropriate dashboard
            setLocation(`/${role}`);
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <div className="auth-box p-4 shadow-lg rounded-4 bg-white" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="text-center mb-4">
                    <Link href="/">
                        <a className="text-decoration-none">
                            <h2 className="fw-bold text-primary mb-2">
                                <i className="bi bi-mortarboard-fill me-2"></i>EduPrime
                            </h2>
                        </a>
                    </Link>
                    <p className="text-muted">Sign in to {roleNames[role] || 'Dashboard'}</p>
                </div>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError("")}></button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">EMAIL ADDRESS</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-envelope text-muted"></i>
                            </span>
                            <input
                                type="email"
                                className="form-control border-start-0 bg-light"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">PASSWORD</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-lock text-muted"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control border-start-0 bg-light"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="remember" />
                            <label className="form-check-label small text-muted" htmlFor="remember">
                                Remember me
                            </label>
                        </div>
                        <Link href="/forgot-password">
                            <a className="small text-primary text-decoration-none">Forgot Password?</a>
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="small text-muted">Don't have an account? <Link href="/contact-admin"><a className="text-primary text-decoration-none">Contact Admin</a></Link></p>
                </div>
            </div>
        </div>
    );
}
