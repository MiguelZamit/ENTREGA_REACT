import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EditView({ tasks, setTasks, handleDeleteEdit, setFilteredTasks }) {
    const navigate = useNavigate();
    const { itemId } = useParams();
    const itemIdToNumeric = Number(itemId); // Asegúrate de que el ID se corresponda con el objeto de la tarea

    const [taskDetails, setTaskDetails] = useState({
        name: "",
        description: "",
        status: "Pending",
        deadline: "",
    });

    const [unsavedChanges, setUnsavedChanges] = useState(false); // Cambiar la variable 'change' a un estado


    // Precargar los datos de la tarea cuando se monta el componente
    useEffect(() => {
        const task = tasks.find((task) => task.id === itemIdToNumeric);
        if (task) {
            setTaskDetails({
                name: task.name || "",
                description: task.description || "",
                status: task.status || "Pending",
                deadline: task.deadline || "",
            });
        }
    }, [itemIdToNumeric, tasks]);

    function handleSave() {
        const newTitle = document.getElementById("iptTitle").value;
        const newDescription = document.getElementById("iptDescription").value;
        const newStatus = document.getElementById("iptStatus").value;
        const newDeadline = document.getElementById("iptDeadline").value;

        // Crear el objeto actualizado
        const updatedTask = {
            name: newTitle,
            description: newDescription,
            status: newStatus,
            deadline: newDeadline,
            isChecked: false,
            id: itemIdToNumeric,
            date: new Date().toISOString(),
        };

        // Actualizar la lista de tareas
        const taskListUpdated = tasks.map((task) =>
            task.id === itemIdToNumeric ? updatedTask : task
        );

        setTasks(taskListUpdated);
        setFilteredTasks(taskListUpdated); // Actualiza las tareas filtradas

        // Actualizar en la base de datos
        window.api.updateTask(updatedTask);

        console.log("Tarea actualizada:", updatedTask);

        // Navegar de vuelta al inicio
        navigate("/");
    }

    async function handleDeleteAndExit() {
        const taskToDelete = tasks.find((task) => task.id === itemIdToNumeric);

        console.log(itemIdToNumeric);
        await handleDeleteEdit(itemIdToNumeric); // Llamada para eliminar la tarea

        window.api.deleteTask(taskToDelete);
        console.log("En teoría borrado de la base de datos");

        navigate("/"); // Redirigir al inicio
    }


    // No se como optimizar esto
    function handleChangeName(e) {

        setTaskDetails({ ...taskDetails, name: e.target.value })
        unsavedChange()

    }

    function handleChangeDescription(e) {

        setTaskDetails({ ...taskDetails, description: e.target.value })
        unsavedChange()

    }

    function handleChangeStatus(e) {

        setTaskDetails({ ...taskDetails, status: e.target.value })
        unsavedChange()

    }

    function handleChangeDeadline(e) {

        setTaskDetails({ ...taskDetails, deadline: e.target.value })
        unsavedChange()

    }

    function unsavedChange() {
        setUnsavedChanges(true)
    }



    function handleBack() {

        console.log(unsavedChanges);


        if (!unsavedChanges) {

            navigate("/") // Volvemos si no ha cambiado nada

        } else {
            window.api
                .openEditConfirmationDialog(
                    `Task ${itemId} has unsaved changes. Do you want to go back to the home page?`
                )
                .then((value) => {
                    if (value.response === 0) {
                        handleSave(); // Guardar antes de volver
                    } else if (value.response === 1) {
                        navigate("/"); // Volver sin guardar
                    }
                });

            setUnsavedChanges(false)
        }


    }

    return (
        <>
            <div id="container" class="d-flex flex-column align-items-center justify-content-center">
                <h1>This is the edit view with the element number {itemId}</h1>
                
                    <form>


                        <div className="d-flex flex-column container-fluid align-items-center justify-content-center " id="contents" >

                            <label>Title</label>
                            <div>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="iptTitle"
                                    name="title"
                                    placeholder="Example: Clean the car..."
                                    value={taskDetails.name}
                                    onChange={(e) => handleChangeName(e)}
                                    required
                                />

                            </div>


                            <label>Description</label>
                            <div class="form-floating">
                                <textarea
                                    id="iptDescription"
                                    name="description"
                                    placeholder="Write anything you want..."
                                    value={taskDetails.description}
                                    onChange={(e) => handleChangeDescription(e)}
                                ></textarea>
                            </div>

                            <label>Status</label>
                            <div className="mb-3">
                                <select
                                    name="status"
                                    id="iptStatus"
                                    required
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Canceled">Canceled</option>
                                </select>

                            </div>


                            <label>Deadline</label>
                            <input
                                type="date"
                                id="iptDeadline"
                                name="deadline"
                                value={taskDetails.deadline}
                                onChange={(e) => handleChangeDeadline(e)}
                            />

                            <div class="d-flex align-items-center m-2">

                                <button type="button" onClick={handleDeleteAndExit} className="btn btn-danger me-2">Delete</button>
                                <button type="button" onClick={handleSave} className="btn btn-success me-2">Save</button>
                                <button type="button" onClick={handleBack} className="btn btn-secondary">Back</button>

                            </div>

                        </div>

                    </form>
            </div>

        </>
    );
}