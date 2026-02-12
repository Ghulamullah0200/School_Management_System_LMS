import { useState, useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';

interface Stats {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    attendanceToday: number;
}

export default function AdminDashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState<Stats>({ totalStudents: 0, totalTeachers: 0, totalClasses: 0, attendanceToday: 0 });
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        period: '',
        timings: '',
        teacher: '',
        students: [] as string[],
        schedule: [] as { day: string; active: boolean }[]
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;

            try {
                // Fetch all teachers
                const teachersRes = await fetch('/api/admin/teachers', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const teachers = teachersRes.ok ? await teachersRes.json() : [];

                // Fetch all students
                const studentsRes = await fetch('/api/admin/students', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const students = studentsRes.ok ? await studentsRes.json() : [];

                // Fetch all classes
                const classesRes = await fetch('/api/admin/classes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const classes = classesRes.ok ? await classesRes.json() : [];

                setStats({
                    totalStudents: students.length,
                    totalTeachers: teachers.length,
                    totalClasses: classes.length,
                    attendanceToday: 0 // Can be calculated from attendance records
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/admin/classes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Class created successfully!');
                setFormData({
                    name: '',
                    subject: '',
                    period: '',
                    timings: '',
                    teacher: '',
                    students: [],
                    schedule: []
                });
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error creating class:', error);
            alert('Failed to create class');
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0 fw-bold">Admin Dashboard</h4>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><a href="#" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                    </ol>
                </nav>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="row g-4 mb-4">
                        <div className="col-md-6 col-lg-3">
                            <div className="stat-card">
                                <div className="stat-icon bg-light-primary">
                                    <i className="bi bi-people-fill"></i>
                                </div>
                                <div className="stat-title">Total Students</div>
                                <div className="stat-value">{stats.totalStudents}</div>
                                <div className="text-muted small mt-2">Enrolled Students</div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="stat-card">
                                <div className="stat-icon bg-light-success">
                                    <i className="bi bi-person-video3"></i>
                                </div>
                                <div className="stat-title">Total Teachers</div>
                                <div className="stat-value">{stats.totalTeachers}</div>
                                <div className="text-muted small mt-2">Active Staff</div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="stat-card">
                                <div className="stat-icon bg-light-warning">
                                    <i className="bi bi-calendar3"></i>
                                </div>
                                <div className="stat-title">Total Classes</div>
                                <div className="stat-value">{stats.totalClasses}</div>
                                <div className="text-muted small mt-2">Active Classes</div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="stat-card">
                                <div className="stat-icon bg-light-info">
                                    <i className="bi bi-calendar-check"></i>
                                </div>
                                <div className="stat-title">System Status</div>
                                <div className="stat-value">Active</div>
                                <div className="text-success small mt-2"><i className="bi bi-check-circle"></i> All Systems Operational</div>
                            </div>
                        </div>
                    </div>

                    {/* Class Generation Section */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="fw-bold mb-4">Generate New Class</h5>
                            <form className="row g-3" onSubmit={handleSubmit}>
                                <div className="col-md-4">
                                    <label className="form-label">Class Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Class 10-A"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Subject</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Mathematics"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Period</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. 1st Period"
                                        value={formData.period}
                                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Timings</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. 09:00 AM - 10:00 AM"
                                        value={formData.timings}
                                        onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary">Create Class</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm rounded-12 overflow-hidden">
                                <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 fw-bold">System Overview</h5>
                                </div>
                                <div className="card-body">
                                    <div className="text-center text-muted py-4">
                                        <i className="bi bi-info-circle fs-1 d-block mb-2"></i>
                                        <p>Use the sidebar to manage students, teachers, and classes</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
