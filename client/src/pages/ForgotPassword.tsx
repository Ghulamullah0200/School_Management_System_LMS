import { useState } from "react";
import { Link } from "wouter";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setIsSubmitted(true);
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to send reset link');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
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
                    <p className="text-muted">Reset your password</p>
                </div>

                {isSubmitted ? (
                    <div className="text-center py-4">
                        <div className="mb-3">
                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                        </div>
                        <h5 className="fw-bold mb-2">Check your email</h5>
                        <p className="text-muted mb-4">
                            We've sent a password reset link to <strong>{email}</strong>
                        </p>
                        <Link href="/login">
                            <a className="btn btn-primary w-100">Back to Login</a>
                        </Link>
                    </div>
                ) : (
                    <>
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
                                <small className="text-muted">Enter your email address and we'll send you a link to reset your password.</small>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2 fw-bold shadow-sm mb-3"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>

                            <Link href="/login">
                                <a className="btn btn-outline-secondary w-100">
                                    <i className="bi bi-arrow-left me-2"></i>Back to Login
                                </a>
                            </Link>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
