import { Student } from '../models/Student';
import { Teacher } from '../models/Teacher';

export const generateStudentId = async (): Promise<string> => {
    // Determine the current year
    const year = new Date().getFullYear();

    // Find the latest student from this year to increment ID
    // ID Format: STU-YYYY-XXXX (e.g., STU-2024-0001)

    const lastStudent = await Student.findOne({ studentId: new RegExp(`^STU-${year}-`) }).sort({ studentId: -1 });

    let nextNum = 1;
    if (lastStudent && lastStudent.studentId) {
        const parts = lastStudent.studentId.split('-');
        if (parts.length === 3) {
            nextNum = parseInt(parts[2]) + 1;
        }
    }

    const paddedNum = nextNum.toString().padStart(4, '0');
    return `STU-${year}-${paddedNum}`;
};

export const generateTeacherId = async (): Promise<string> => {
    // Match ID format with prompt request if specific, otherwise: TEA-XXXX

    const lastTeacher = await Teacher.findOne({ teacherId: new RegExp(`^TEA-`) }).sort({ teacherId: -1 });

    let nextNum = 1;
    if (lastTeacher && lastTeacher.teacherId) {
        const parts = lastTeacher.teacherId.split('-');
        if (parts.length === 2) {
            nextNum = parseInt(parts[1]) + 1;
        }
    }

    const paddedNum = nextNum.toString().padStart(4, '0');
    return `TEA-${paddedNum}`;
};
