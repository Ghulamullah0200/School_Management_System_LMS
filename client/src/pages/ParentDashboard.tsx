

export default function ParentDashboard() {
    return (
        <div className="animate-fade-in-up">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0 fw-bold">Parent Portal</h4>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm rounded-pill px-3">
                        <i className="bi bi-download me-2"></i>Download Report
                    </button>
                </div>
            </div>

            {/* Children Overview */}
            <div className="row g-4 mb-4">
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted small mb-1">Total Children</p>
                                    <h3 className="mb-0 fw-bold">2</h3>
                                </div>
                                <div className="bg-light-primary p-3 rounded-circle">
                                    <i className="bi bi-people-fill fs-4 text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted small mb-1">Avg Attendance</p>
                                    <h3 className="mb-0 fw-bold">92%</h3>
                                </div>
                                <div className="bg-light-success p-3 rounded-circle">
                                    <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted small mb-1">Pending Fees</p>
                                    <h3 className="mb-0 fw-bold">$450</h3>
                                </div>
                                <div className="bg-light-warning p-3 rounded-circle">
                                    <i className="bi bi-currency-dollar fs-4 text-warning"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted small mb-1">Upcoming Events</p>
                                    <h3 className="mb-0 fw-bold">3</h3>
                                </div>
                                <div className="bg-light-info p-3 rounded-circle">
                                    <i className="bi bi-calendar-event fs-4 text-info"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Children Performance */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="fw-bold mb-4">Children Performance</h5>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Student Name</th>
                                    <th>Class</th>
                                    <th>Attendance</th>
                                    <th>Overall Grade</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <img src="https://ui-avatars.com/api/?name=Alice+Johnson&background=random" className="rounded-circle" width="32" height="32" alt="" />
                                            <span className="fw-medium">Alice Johnson</span>
                                        </div>
                                    </td>
                                    <td>Grade 10-A</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="progress flex-grow-1" style={{ height: '6px', maxWidth: '100px' }}>
                                                <div className="progress-bar bg-success" role="progressbar" style={{ width: '95%' }}></div>
                                            </div>
                                            <small className="fw-bold">95%</small>
                                        </div>
                                    </td>
                                    <td><span className="badge bg-success">A</span></td>
                                    <td><span className="badge bg-light-success text-success">Excellent</span></td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary">View Details</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Recent Notices */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="fw-bold mb-3">Recent Notices</h5>
                            <div className="list-group list-group-flush">
                                <div className="list-group-item px-0">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="bg-light-primary p-2 rounded">
                                            <i className="bi bi-megaphone text-primary"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1">Parent-Teacher Meeting</h6>
                                            <p className="text-muted small mb-0">Scheduled for Feb 10, 2026 at 3:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="list-group-item px-0">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="bg-light-warning p-2 rounded">
                                            <i className="bi bi-exclamation-triangle text-warning"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1">Fee Payment Reminder</h6>
                                            <p className="text-muted small mb-0">Due date: Feb 15, 2026</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="fw-bold mb-3">Upcoming Events</h5>
                            <div className="list-group list-group-flush">
                                <div className="list-group-item px-0">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="bg-light-info p-2 rounded">
                                            <i className="bi bi-calendar-event text-info"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1">Annual Sports Day</h6>
                                            <p className="text-muted small mb-0">Feb 20, 2026</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="list-group-item px-0">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="bg-light-success p-2 rounded">
                                            <i className="bi bi-trophy text-success"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1">Science Fair</h6>
                                            <p className="text-muted small mb-0">Feb 25, 2026</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
