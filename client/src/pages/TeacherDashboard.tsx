import { useState } from 'react';

import { motion, AnimatePresence } from "framer-motion";

const mockStudents = [
    { id: 'STU001', name: 'John Doe', attendancePercent: 95 },
    { id: 'STU002', name: 'Alice Smith', attendancePercent: 88 },
    { id: 'STU003', name: 'Robert Brown', attendancePercent: 72 },
    { id: 'STU004', name: 'Sarah Wilson', attendancePercent: 91 },
    { id: 'STU005', name: 'James Cook', attendancePercent: 84 },
];

export default function TeacherDashboard() {
    const [attendance, setAttendance] = useState<Record<string, string>>({});
    const [showMarksModal, setShowMarksModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const handleAttendance = (studentId: string, status: string) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    return (
        <div className="animate-fade-in-up">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0 fw-bold">Teacher Portal</h4>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm rounded-pill px-3">
                        <i className="bi bi-calendar-event me-2"></i>Daily Routine
                    </button>
                    <button className="btn btn-primary btn-sm rounded-pill px-3">
                        <i className="bi bi-cloud-upload me-2"></i>Save Records
                    </button>
                </div>
            </div>

            {/* Advanced Attendance Table */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold mb-0">Attendance: Mathematics - 10A</h5>
                        <div className="badge bg-light-primary text-primary p-2">Feb 02, 2026 - 1st Period</div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle custom-attendance-table">
                            <thead className="table-light">
                                <tr>
                                    <th>S.no</th>
                                    <th>ID</th>
                                    <th>Student Name</th>
                                    <th>Current %</th>
                                    <th className="text-center">Present</th>
                                    <th className="text-center">Absent</th>
                                    <th className="text-center">Leave</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {mockStudents.map((student, index) => (
                                        <motion.tr
                                            key={student.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={attendance[student.id] ? `row-active-${attendance[student.id]}` : ''}
                                        >
                                            <td>{index + 1}</td>
                                            <td><code className="text-primary fw-bold">{student.id}</code></td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <img src={`https://ui-avatars.com/api/?name=${student.name}&background=random`} className="rounded-circle" width="32" height="32" alt="" />
                                                    <span className="fw-medium">{student.name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="progress flex-grow-1" style={{ height: '6px', maxWidth: '100px' }}>
                                                        <div
                                                            className={`progress-bar ${student.attendancePercent > 80 ? 'bg-success' : 'bg-warning'}`}
                                                            role="progressbar"
                                                            style={{ width: `${student.attendancePercent}%` }}
                                                        ></div>
                                                    </div>
                                                    <small className="fw-bold">{student.attendancePercent}%</small>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="form-check d-inline-block">
                                                    <input
                                                        className="form-check-input attendance-input-present"
                                                        type="radio"
                                                        name={`att-${student.id}`}
                                                        onChange={() => handleAttendance(student.id, 'present')}
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="form-check d-inline-block">
                                                    <input
                                                        className="form-check-input attendance-input-absent"
                                                        type="radio"
                                                        name={`att-${student.id}`}
                                                        onChange={() => handleAttendance(student.id, 'absent')}
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="form-check d-inline-block">
                                                    <input
                                                        className="form-check-input attendance-input-leave"
                                                        type="radio"
                                                        name={`att-${student.id}`}
                                                        onChange={() => handleAttendance(student.id, 'leave')}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-light-primary"
                                                    onClick={() => { setSelectedStudent(student); setShowMarksModal(true); }}
                                                >
                                                    <i className="bi bi-plus-circle me-1"></i> Add Marks
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Marks Entry Modal (Simplified UI for demo) */}
            {showMarksModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Enter Marks - {selectedStudent?.name}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowMarksModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Exam Type</label>
                                        <select className="form-select">
                                            <option>Quiz</option>
                                            <option>Midterm</option>
                                            <option>Final</option>
                                            <option>Assignment</option>
                                        </select>
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Marks Obtained</label>
                                            <input type="number" className="form-control" placeholder="0" />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Total Marks</label>
                                            <input type="number" className="form-control" placeholder="100" />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Remarks</label>
                                        <textarea className="form-control" rows={2}></textarea>
                                    </div>
                                    <button type="button" className="btn btn-primary w-100" onClick={() => setShowMarksModal(false)}>Submit Marks</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Additional UI styles for the enhanced table */}
            <style>{`
        .custom-attendance-table .progress-bar {
            transition: width 0.6s ease;
        }
        .attendance-input-present:checked { background-color: #10b981; border-color: #10b981; }
        .attendance-input-absent:checked { background-color: #ef4444; border-color: #ef4444; }
        .attendance-input-leave:checked { background-color: #f59e0b; border-color: #f59e0b; }
        
        .row-active-present { background-color: rgba(16, 185, 129, 0.03); }
        .row-active-absent { background-color: rgba(239, 68, 68, 0.03); }
        .row-active-leave { background-color: rgba(245, 158, 11, 0.03); }
        
        .btn-light-primary { 
            background: rgba(67, 56, 202, 0.08); 
            color: #4338ca; 
            border: none;
            font-size: 0.8rem;
            font-weight: 600;
        }
        .btn-light-primary:hover {
            background: #4338ca;
            color: #fff;
        }
      `}</style>
        </div>
    );
}
