// Establecemos la API para conectar con frontend
// Importamos los metodos CRUD realizados en Service
//Aqui esta la logica de MySQL
import { createStudents } from "@/services/studentService";
import { getStudents } from "@/services/studentService";
import { updateStudent } from "@/services/studentService";
import { deleteStudent } from "@/services/studentService";

// POST = CREAR
// Request nos identifica lo que llega desde frontend con body
// Response es la respuesta de la API con su result
export async function POST(request) {
    
    try {
        const body = await request.json();
        const result = await createStudents(body);
        return Response.json(result);
    } catch(error) {
        return Response.json({
            error: error.message
        });
    }
}

//GET = READ
export async function GET() {
    try {
        const students = await getStudents();
        return Response.json(students);
    } catch(error) {
        return Response.json({
            error: error.message
        });
    }
}

//PUT = UPDATE
export async function PUT(request) {

    try {
        const body = await request.json();
        const { id } = body;
        const result = await updateStudent(id, body);
        return Response.json(result);
    } catch (error) {
        return Response.json({
            error: error.message
        });
    }
}

//DELETE = ELIMINAR 
export async function DELETE(request) {
    try {
        const body = await request.json();
        const { id } = body;
        const result = await deleteStudent(id);
        return Response.json(result);
    } catch(error) {
        return Response.json({
            error: error.message
        });
    }
}