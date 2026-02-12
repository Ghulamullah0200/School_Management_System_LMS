import DashboardLayout from "@/components/DashboardLayout";

interface PlaceholderPageProps {
    role: 'admin' | 'teacher' | 'student' | 'parent';
    title: string;
    description: string;
}

export default function PlaceholderPage({ role, title, description }: PlaceholderPageProps) {
    return (
        <DashboardLayout role={role}>
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <i className="bi bi-tools fs-1 text-muted mb-3 d-block"></i>
                    <h4 className="fw-bold mb-2">{title}</h4>
                    <p className="text-muted">{description}</p>
                    <div className="mt-4">
                        <span className="badge bg-light-warning text-warning px-3 py-2">
                            <i className="bi bi-clock-history me-2"></i>
                            Coming Soon
                        </span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
