import { updateStudent } from "@/services/studentService";
import { deleteStudent } from "@/services/studentService";

// PUT = UPDATE
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const result = await updateStudent(id, body);
        return Response.json(result);
    } catch (error) {
        return Response.json({
            error: error.message
        }, { status: 500 });
    }
}

// DELETE = ELIMINAR
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const result = await deleteStudent(id);
        return Response.json(result);
    } catch (error) {
        return Response.json({
            error: error.message
        }, { status: 500 });
    }
}
