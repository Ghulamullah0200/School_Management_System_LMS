import { useState } from "react";
import { Link } from "wouter";

export default function ContactAdmin() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/contact-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsSubmitted(true);
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to send message');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <div className="auth-box p-4 shadow-lg rounded-4 bg-white" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="text-center mb-4">
                    <Link href="/">
                        <a className="text-decoration-none">
                            <h2 className="fw-bold text-primary mb-2">
                                <i className="bi bi-mortarboard-fill me-2"></i>EduPrime
                            </h2>
                        </a>
                    </Link>
                    <p className="text-muted">Contact Administrator</p>
                </div>

                {isSubmitted ? (
                    <div className="text-center py-4">
                        <div className="mb-3">
                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                        </div>
                        <h5 className="fw-bold mb-2">Message Sent!</h5>
                        <p className="text-muted mb-4">
                            Your message has been sent to the administrator. You will receive a response within 24-48 hours.
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
                                <label className="form-label text-muted small fw-bold">YOUR NAME</label>
                                <input
                                    type="text"
                                    className="form-control bg-light"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-muted small fw-bold">EMAIL ADDRESS</label>
                                <input
                                    type="email"
                                    className="form-control bg-light"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-muted small fw-bold">SUBJECT</label>
                                <select
                                    className="form-select bg-light"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">Select a subject</option>
                                    <option value="account">Account Access Issue</option>
                                    <option value="registration">New Registration Request</option>
                                    <option value="technical">Technical Support</option>
                                    <option value="other">Other Inquiry</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-muted small fw-bold">MESSAGE</label>
                                <textarea
                                    className="form-control bg-light"
                                    rows={4}
                                    placeholder="Describe your issue or request..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    disabled={isLoading}
                                ></textarea>
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
                                    <>
                                        <i className="bi bi-send me-2"></i>Send Message
                                    </>
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

                <div className="mt-4 text-center">
                    <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        For urgent matters, call: +1 (555) 123-4567
                    </small>
                </div>
            </div>
        </div>
    );
}
