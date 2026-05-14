"use client";

import { useState, useEffect } from "react";

// Estado inicial del formulario
const INITIAL_FORM = {
  cedula: "",
  nombre: "",
  apellido: "",
  correo: "",
  carrera: "",
  edad: "",
};

export default function Home() {
  // Lista de estudiantes
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Control del formulario
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  // Para cuando el usuario elige "Otros" en carrera
  const [otraCarrera, setOtraCarrera] = useState(false);

  // Notificaciones
  const [notification, setNotification] = useState(null);

  // Cargar estudiantes al iniciar
  useEffect(() => {
    fetchStudents();
  }, []);

  // Obtener todos los estudiantes de la API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      showNotification("Error al cargar los estudiantes", "error");
    } finally {
      setLoading(false);
    }
  };

  // Mostrar notificacion por 3 segundos
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Validar campos del formulario
  const validate = () => {
    let newErrors = {};

    if (!formData.cedula.trim()) newErrors.cedula = "La cédula es requerida";
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es requerido";
    if (!formData.carrera.trim()) newErrors.carrera = "La carrera es requerida";

    if (!formData.edad || isNaN(formData.edad) || Number(formData.edad) <= 0) {
      newErrors.edad = "Ingresa una edad válida";
    }

    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "El correo no es válido";
    }

    return newErrors;
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Abrir formulario para crear
  const openCreate = () => {
    setEditingStudent(null);
    setFormData(INITIAL_FORM);
    setErrors({});
    setOtraCarrera(false);
    setShowForm(true);
  };

  // Abrir formulario para editar
  const openEdit = (student) => {
    setEditingStudent(student);

    const carrerasLista = [
      "Ingeniería en Sistemas", "Informática Empresarial", "Ingeniería en Computación",
      "Administración de Empresas", "Contaduría Pública", "Derecho", "Medicina",
      "Enfermería", "Psicología", "Educación", "Arquitectura", "Ingeniería Civil",
      "Ingeniería Eléctrica", "Biología", "Química", "Economía", "Sociología",
      "Comunicación", "Turismo", "Nutrición",
    ];

    // Si la carrera guardada no está en la lista, es una carrera personalizada
    const esOtra = student.carrera && !carrerasLista.includes(student.carrera);
    setOtraCarrera(esOtra);

    setFormData({
      cedula: student.cedula || "",
      nombre: student.nombre || "",
      apellido: student.apellido || "",
      correo: student.correo || "",
      carrera: student.carrera || "",
      edad: student.edad || "",
    });
    setErrors({});
    setShowForm(true);
  };

  // Cerrar formulario
  const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  // Guardar estudiante (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar antes de enviar
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingStudent) {
        // Actualizar estudiante existente
        const res = await fetch(`/api/students/${editingStudent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, edad: Number(formData.edad) }),
        });
        if (!res.ok) throw new Error("Error al actualizar");
        showNotification("Estudiante actualizado correctamente");
      } else {
        // Crear nuevo estudiante
        const res = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, edad: Number(formData.edad) }),
        });
        if (!res.ok) throw new Error("Error al crear");
        showNotification("Estudiante creado correctamente");
      }

      setShowForm(false);
      setEditingStudent(null);
      fetchStudents(); // Recargar la lista
    } catch (error) {
      showNotification("Error al guardar el estudiante", "error");
    }
  };

  // Eliminar estudiante
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este estudiante?")) return;

    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      showNotification("Estudiante eliminado correctamente");
      fetchStudents(); // Recargar la lista
    } catch (error) {
      showNotification("Error al eliminar el estudiante", "error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>

      {/* Notificacion */}
      {notification && (
        <div style={{
          position: "fixed", top: 20, right: 20,
          padding: "1rem 1.5rem", borderRadius: 12,
          fontSize: 14, fontWeight: 500, zIndex: 1000,
          background: notification.type === "error" ? "#fef2f2" : "#f0fdf4",
          color: notification.type === "error" ? "#7f1d1d" : "#166534",
          border: `1.5px solid ${notification.type === "error" ? "#fecaca" : "#bbf7d0"}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          animation: "slideIn 0.3s ease-out",
        }}>
          {notification.message}
        </div>
      )}

      {/* Encabezado */}
      <header style={{ background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)", borderBottom: "1px solid #e5e7eb", padding: "2rem 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 700, color: "#1f2937", letterSpacing: "-0.02em" }}>
              Registro de Estudiantes
            </h1>
            <p style={{ margin: "0.5rem 0 0", fontSize: 14, color: "#9ca3af", fontWeight: 500 }}>
              Total: {students.length} {students.length === 1 ? "estudiante" : "estudiantes"}
            </p>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 2rem" }}>

        {/* Formulario */}
        {showForm && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "2rem", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <h2 style={{ margin: "0 0 1.75rem", fontSize: "1.3rem", fontWeight: 700, color: "#1f2937" }}>
              {editingStudent ? "✏️ Editar estudiante" : "Nuevo estudiante"}
            </h2>

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

                {/* Cedula */}
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Cédula</label>
                  <input name="cedula" type="text" value={formData.cedula} onChange={handleChange}
                    placeholder="1-2345-6789"
                    style={{ width: "100%", padding: "0.75rem 1rem", border: `1.5px solid ${errors.cedula ? "#ef4444" : "#e5e7eb"}`, borderRadius: 10, fontSize: 14, boxSizing: "border-box", transition: "all 0.2s ease" }} />
                  {errors.cedula && <p style={{ margin: "0.5rem 0 0", fontSize: 13, color: "#ef4444", fontWeight: 500 }}>⚠️ {errors.cedula}</p>}
                </div>

                {/* Edad */}
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Edad</label>
                  <input name="edad" type="number" min="1" max="100" value={formData.edad} onChange={handleChange}
                    placeholder="20"
                    style={{ width: "100%", padding: "0.75rem 1rem", border: `1.5px solid ${errors.edad ? "#ef4444" : "#e5e7eb"}`, borderRadius: 10, fontSize: 14, boxSizing: "border-box", transition: "all 0.2s ease" }} />
                  {errors.edad && <p style={{ margin: "0.5rem 0 0", fontSize: 13, color: "#ef4444", fontWeight: 500 }}>⚠️ {errors.edad}</p>}
                </div>

                {/* Nombre */}
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Nombre</label>
                  <input name="nombre" type="text" value={formData.nombre} onChange={handleChange}
                    placeholder="Juan"
                    style={{ width: "100%", padding: "0.75rem 1rem", border: `1.5px solid ${errors.nombre ? "#ef4444" : "#e5e7eb"}`, borderRadius: 10, fontSize: 14, boxSizing: "border-box", transition: "all 0.2s ease" }} />
                  {errors.nombre && <p style={{ margin: "0.5rem 0 0", fontSize: 13, color: "#ef4444", fontWeight: 500 }}>⚠️ {errors.nombre}</p>}
                </div>

                {/* Apellido */}
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Apellido</label>
                  <input name="apellido" type="text" value={formData.apellido} onChange={handleChange}
                    placeholder="Pérez"
                    style={{ width: "100%", padding: "0.75rem 1rem", border: `1.5px solid ${errors.apellido ? "#ef4444" : "#e5e7eb"}`, borderRadius: 10, fontSize: 14, boxSizing: "border-box", transition: "all 0.2s ease" }} />
                  {errors.apellido && <p style={{ margin: "0.5rem 0 0", fontSize: 13, color: "#ef4444", fontWeight: 500 }}>⚠️ {errors.apellido}</p>}
                </div>

                {/* Correo - ocupa todo el ancho */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Correo</label>
                  <input name="correo" type="email" value={formData.correo} onChange={handleChange}
                    placeholder="juan@correo.com"
                    style={{ width: "100%", padding: "0.75rem 1rem", border: `1.5px solid ${errors.correo ? "#ef4444" : "#e5e7eb"}`, borderRadius: 10, fontSize: 14, boxSizing: "border-box", transition: "all 0.2s ease" }} />
                  {errors.correo && <p style={{ margin: "0.5rem 0 0", fontSize: 13, color: "#ef4444", fontWeight: 500 }}>⚠️ {errors.correo}</p>}
                </div>

                {/* Carrera - ocupa todo el ancho */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Carrera</label>
                  <select
                    name="carrera"
                    value={otraCarrera ? "Otros" : formData.carrera}
                    onChange={(e) => {
                      if (e.target.value === "Otros") {
                        setOtraCarrera(true);
                        setFormData({ ...formData, carrera: "" });
                      } else {
                        setOtraCarrera(false);
                        setFormData({ ...formData, carrera: e.target.value });
                        if (errors.carrera) setErrors({ ...errors, carrera: null });
                      }
                    }}
                    style={{ width: "100%", padding: "0.75rem 1rem", border: `1.5px solid ${errors.carrera ? "#ef4444" : "#e5e7eb"}`, borderRadius: 10, fontSize: 14, boxSizing: "border-box" }}>
                    <option value="">Selecciona una carrera...</option>
                    <optgroup label="Informática y Tecnología">
                      <option>Ingeniería en Sistemas</option>
                      <option>Informática Empresarial</option>
                      <option>Ingeniería en Computación</option>
                    </optgroup>
                    <optgroup label="Ciencias Económicas">
                      <option>Administración de Empresas</option>
                      <option>Contaduría Pública</option>
                      <option>Economía</option>
                    </optgroup>
                    <optgroup label="Salud">
                      <option>Medicina</option>
                      <option>Enfermería</option>
                      <option>Psicología</option>
                      <option>Nutrición</option>
                    </optgroup>
                    <optgroup label="Ingeniería">
                      <option>Ingeniería Civil</option>
                      <option>Ingeniería Eléctrica</option>
                      <option>Arquitectura</option>
                    </optgroup>
                    <optgroup label="Ciencias Sociales y Humanidades">
                      <option>Derecho</option>
                      <option>Educación</option>
                      <option>Comunicación</option>
                      <option>Sociología</option>
                      <option>Turismo</option>
                    </optgroup>
                    <optgroup label="Ciencias Naturales">
                      <option>Biología</option>
                      <option>Química</option>
                    </optgroup>
                    <option value="Otros">Otros (escribir)</option>
                  </select>

                  {/* Campo de texto si eligió Otros */}
                  {otraCarrera && (
                    <input
                      name="carrera"
                      type="text"
                      value={formData.carrera}
                      onChange={handleChange}
                      placeholder="Escribe tu carrera..."
                      style={{ width: "100%", marginTop: 12, padding: "0.75rem 1rem", border: `1.5px solid ${errors.carrera ? "#ef4444" : "#e5e7eb"}`, borderRadius: 10, fontSize: 14, boxSizing: "border-box" }}
                    />
                  )}

                  {errors.carrera && <p style={{ margin: "0.5rem 0 0", fontSize: 13, color: "#ef4444", fontWeight: 500 }}>⚠️ {errors.carrera}</p>}
                </div>

              </div>

              {/* Botones del formulario */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: "1.75rem", paddingTop: "1.5rem", borderTop: "1px solid #f3f4f6" }}>
                <button type="button" onClick={handleCancel} style={{
                  background: "#f3f4f6", color: "#374151", border: "none",
                  padding: "0.75rem 1.5rem", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {e.target.style.background = "#e5e7eb"}}
                onMouseLeave={(e) => {e.target.style.background = "#f3f4f6"}}>
                  Cancelar
                </button>
                <button type="submit" style={{
                  background: "#3b82f6", color: "#fff", border: "none",
                  padding: "0.75rem 1.5rem", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(59, 130, 246, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#2563eb";
                  e.target.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#3b82f6";
                  e.target.style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.2)";
                }}>
                  {editingStudent ? "Guardar cambios" : "Crear estudiante"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Estado de carga */}
        {loading && (
          <div style={{ textAlign: "center", color: "#9ca3af", padding: "4rem 2rem" }}>
            <p style={{ fontSize: 16, margin: 0 }}>⏳ Cargando estudiantes...</p>
          </div>
        )}

        {/* Sin estudiantes */}
        {!loading && students.length === 0 && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "3rem", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: "#374151" }}>Sin estudiantes registrados</p>
            <p style={{ margin: "0.5rem 0 0", fontSize: 14, color: "#9ca3af" }}>Agrega un nuevo estudiante</p>
          </div>
        )}

        {/* Tabla de estudiantes */}
        {!loading && students.length > 0 && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr>
                    {["#", "Cédula", "Nombre", "Apellido", "Correo", "Carrera", "Edad", "Acciones"].map((h) => (
                      <th key={h} style={{
                        padding: "1rem 1.25rem", textAlign: "left",
                        fontSize: 13, fontWeight: 700, color: "#6b7280",
                        textTransform: "uppercase", letterSpacing: "0.05em",
                        background: "#f9fafb", borderBottom: "1.5px solid #e5e7eb",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((st, i) => (
                    <tr key={st.id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.2s ease" }}
                    onMouseEnter={(e) => {e.currentTarget.style.background = "#f9fafb"}}
                    onMouseLeave={(e) => {e.currentTarget.style.background = "transparent"}}>
                      <td style={{ padding: "1rem 1.25rem", color: "#9ca3af", fontWeight: 500 }}>{i + 1}</td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <span style={{ background: "#dbeafe", color: "#1e40af", fontSize: 13, fontWeight: 700, padding: "0.35rem 0.75rem", borderRadius: 8 }}>
                          {st.cedula}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "#1f2937" }}>{st.nombre}</td>
                      <td style={{ padding: "1rem 1.25rem", color: "#374151" }}>{st.apellido}</td>
                      <td style={{ padding: "1rem 1.25rem", color: "#6b7280", fontSize: 13 }}>{st.correo}</td>
                      <td style={{ padding: "1rem 1.25rem", color: "#374151" }}>{st.carrera}</td>
                      <td style={{ padding: "1rem 1.25rem", textAlign: "center", fontWeight: 600, color: "#1f2937" }}>{st.edad}</td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => openEdit(st)} style={{
                            padding: "0.5rem 1rem", borderRadius: 8, fontSize: 13,
                            fontWeight: 600, cursor: "pointer",
                            background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#dbeafe";
                            e.currentTarget.style.color = "#1d4ed8";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#eff6ff";
                            e.currentTarget.style.color = "#2563eb";
                          }}>
                            ✏️
                          </button>
                          <button onClick={() => handleDelete(st.id)} style={{
                            padding: "0.5rem 1rem", borderRadius: 8, fontSize: 13,
                            fontWeight: 600, cursor: "pointer",
                            background: "#fef2f2", color: "#dc2626", border: "1px solid #fecdd3",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#fee2e2";
                            e.currentTarget.style.color = "#b91c1c";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#fef2f2";
                            e.currentTarget.style.color = "#dc2626";
                          }}>
                            Eliminar Estudiante
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Botón flotante en esquina inferior derecha */}
      <button onClick={openCreate} style={{
        position: "fixed", bottom: 30, right: 30,
        background: "#3b82f6", color: "#fff", border: "none",
        padding: "1rem 1.5rem", borderRadius: 12,
        fontSize: 15, fontWeight: 600, cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 16px rgba(59, 130, 246, 0.35)",
        display: "flex", alignItems: "center", gap: "0.5rem",
        zIndex: 999,
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "#2563eb";
        e.target.style.boxShadow = "0 6px 20px rgba(37, 99, 235, 0.4)";
        e.target.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "#3b82f6";
        e.target.style.boxShadow = "0 4px 16px rgba(59, 130, 246, 0.35)";
        e.target.style.transform = "scale(1)";
      }}>
        + Agregar estudiante
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        input:focus, select:focus, textarea:focus {
          outline: none !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
}