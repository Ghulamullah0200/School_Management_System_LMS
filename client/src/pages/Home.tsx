import { Link } from "wouter";

export default function Home() {
    return (
        <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center">
            <div className="text-center mb-5 animate-fade-in">
                <h1 className="display-4 fw-bold text-primary mb-3">
                    <i className="bi bi-mortarboard-fill me-2"></i>EduPrime
                </h1>
                <p className="lead text-muted">Next-Gen School Management ERP System</p>
            </div>

            <div className="row g-4 w-100 justify-content-center animate-fade-in" style={{ maxWidth: '1000px' }}>
                {/* Admin */}
                <div className="col-md-6 col-lg-3">
                    <Link href="/login?role=admin">
                        <div className="card h-100 role-card border-0 shadow-sm text-center p-4" style={{ cursor: 'pointer' }}>
                            <div className="card-body">
                                <div className="mb-4">
                                    <span className="badge bg-light-primary p-3 rounded-circle">
                                        <i className="bi bi-shield-lock-fill fs-2 text-primary"></i>
                                    </span>
                                </div>
                                <h5 className="card-title text-dark fw-bold">Super Admin</h5>
                                <p className="card-text text-muted small">Full access to all modules and settings</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Teacher */}
                <div className="col-md-6 col-lg-3">
                    <Link href="/login?role=teacher">
                        <div className="card h-100 role-card border-0 shadow-sm text-center p-4" style={{ cursor: 'pointer' }}>
                            <div className="card-body">
                                <div className="mb-4">
                                    <span className="badge bg-light-success p-3 rounded-circle">
                                        <i className="bi bi-person-video3 fs-2 text-success"></i>
                                    </span>
                                </div>
                                <h5 className="card-title text-dark fw-bold">Teacher</h5>
                                <p className="card-text text-muted small">Manage classes, exams, and attendance</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Student */}
                <div className="col-md-6 col-lg-3">
                    <Link href="/login?role=student">
                        <div className="card h-100 role-card border-0 shadow-sm text-center p-4" style={{ cursor: 'pointer' }}>
                            <div className="card-body">
                                <div className="mb-4">
                                    <span className="badge bg-light-info p-3 rounded-circle">
                                        <i className="bi bi-backpack-fill fs-2 text-info"></i>
                                    </span>
                                </div>
                                <h5 className="card-title text-dark fw-bold">Student</h5>
                                <p className="card-text text-muted small">View results, routine, and notices</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Parent */}
                <div className="col-md-6 col-lg-3">
                    <Link href="/login?role=parent">
                        <div className="card h-100 role-card border-0 shadow-sm text-center p-4" style={{ cursor: 'pointer' }}>
                            <div className="card-body">
                                <div className="mb-4">
                                    <span className="badge bg-light-warning p-3 rounded-circle">
                                        <i className="bi bi-people-fill fs-2 text-warning"></i>
                                    </span>
                                </div>
                                <h5 className="card-title text-dark fw-bold">Parent</h5>
                                <p className="card-text text-muted small">Monitor child performance and fees</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="mt-5 text-muted small">
                &copy; 2024 EduPrime School ERP. All rights reserved.
            </div>
        </div>
    );
}
