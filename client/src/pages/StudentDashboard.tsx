import { useState, useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';

interface AttendanceRecord {
    _id: string;
    date: string;
    status: string;
    class: {
        name: string;
        subject: string;
    };
}

interface ClassSchedule {
    _id: string;
    name: string;
    subject: string;
    period: string;
    timings: string;
    teacher: {
        name: string;
    };
}

export default function StudentDashboard() {
    const { user, token } = useAuth();
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [schedule, setSchedule] = useState<ClassSchedule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !token) return;

            try {
                // Fetch attendance records
                const attendanceRes = await fetch(`/api/student/attendance/${user.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (attendanceRes.ok) {
                    const attendanceData = await attendanceRes.json();
                    setAttendance(attendanceData);
                }

                // Fetch class schedule
                const scheduleRes = await fetch(`/api/student/schedule/${user.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (scheduleRes.ok) {
                    const scheduleData = await scheduleRes.json();
                    setSchedule(scheduleData);
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, token]);

    // Calculate attendance percentage
    const calculateAttendancePercentage = () => {
        if (attendance.length === 0) return 0;
        const presentCount = attendance.filter(a => a.status === 'present').length;
        return Math.round((presentCount / attendance.length) * 100);
    };

    const attendancePercentage = calculateAttendancePercentage();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0 fw-bold">Student Portal</h4>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm rounded-pill px-3">
                        <i className="bi bi-download me-2"></i>Download Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted small mb-1">Attendance</p>
                                    <h3 className="mb-0 fw-bold">{attendancePercentage}%</h3>
                                </div>
                                <div className={`bg-light-${attendancePercentage >= 75 ? 'success' : 'warning'} p-3 rounded-circle`}>
                                    <i className={`bi bi-check-circle-fill fs-4 text-${attendancePercentage >= 75 ? 'success' : 'warning'}`}></i>
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
                                    <p className="text-muted small mb-1">Total Classes</p>
                                    <h3 className="mb-0 fw-bold">{schedule.length}</h3>
                                </div>
                                <div className="bg-light-primary p-3 rounded-circle">
                                    <i className="bi bi-book-fill fs-4 text-primary"></i>
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
                                    <p className="text-muted small mb-1">Present Days</p>
                                    <h3 className="mb-0 fw-bold">{attendance.filter(a => a.status === 'present').length}</h3>
                                </div>
                                <div className="bg-light-success p-3 rounded-circle">
                                    <i className="bi bi-calendar-check fs-4 text-success"></i>
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
                                    <p className="text-muted small mb-1">Absent Days</p>
                                    <h3 className="mb-0 fw-bold">{attendance.filter(a => a.status === 'absent').length}</h3>
                                </div>
                                <div className="bg-light-danger p-3 rounded-circle">
                                    <i className="bi bi-x-circle-fill fs-4 text-danger"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Schedule */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="fw-bold mb-4">Today's Schedule</h5>
                    {schedule.length === 0 ? (
                        <div className="text-center text-muted py-4">
                            <i className="bi bi-calendar-x fs-1 d-block mb-2"></i>
                            <p>No classes scheduled for today</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Period</th>
                                        <th>Subject</th>
                                        <th>Teacher</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedule.map((cls) => (
                                        <tr key={cls._id}>
                                            <td><span className="badge bg-primary">{cls.period}</span></td>
                                            <td className="fw-medium">{cls.subject}</td>
                                            <td>{cls.teacher?.name || 'TBA'}</td>
                                            <td><small className="text-muted">{cls.timings}</small></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Attendance */}
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <h5 className="fw-bold mb-4">Recent Attendance</h5>
                    {attendance.length === 0 ? (
                        <div className="text-center text-muted py-4">
                            <i className="bi bi-clipboard-x fs-1 d-block mb-2"></i>
                            <p>No attendance records found</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Subject</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendance.slice(0, 10).map((record) => (
                                        <tr key={record._id}>
                                            <td>{new Date(record.date).toLocaleDateString()}</td>
                                            <td>{record.class?.subject || 'N/A'}</td>
                                            <td>
                                                <span className={`badge bg-${record.status === 'present' ? 'success' :
                                                    record.status === 'absent' ? 'danger' : 'warning'
                                                    }`}>
                                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
