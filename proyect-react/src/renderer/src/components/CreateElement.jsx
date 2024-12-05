import TaskItem from "./TaskItem";

import React from 'react';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../assets/style.css"
import { useNavigate } from "react-router-dom";


// Aqui hay que añadir los outlined para motrarlos en el "aside"
import {
    PlusOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    StopOutlined,
    EyeOutlined,
} from '@ant-design/icons';

import { Layout, Menu, theme } from 'antd';
const { Content, Sider } = Layout;

export default function CreateElement({ tasks, setTasks, originalTasks, setOriginalTasks, filteredTasks, setFilteredTasks, isHidden, setIsHidden, handleDelete }) {

    const navigate = useNavigate()
    console.log(tasks);

    const items = [
        {
            key: '1',
            icon: <PlusOutlined />,
            label: 'Add Task',
            onClick: () => navigate(`/createTask`)
        },
        {
            key: '3',
            icon: <CheckCircleOutlined />,
            label: 'Completed',
            onClick: () => moveSelectedTasks("Completed")

        },
        {
            key: '4',
            icon: <ClockCircleOutlined />,
            label: 'In Progress',
            onClick: () => moveSelectedTasks("In Progress")
        },
        {
            key: '5',
            icon: <StopOutlined />,
            label: 'Canceled',
            onClick: () => moveSelectedTasks("Canceled")
        },
        {
            key: '6',
            icon: <EyeOutlined />, // En un futuro hacerle tooltip
            label: 'Hide/Show',
            onClick: () => hideShowCompletedAndCanceled()
        },
    ];



    function handleCheckboxChange(index) {
        --index
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, isChecked: !task.isChecked } : task
        );
        setTasks(updatedTasks);
        setOriginalTasks(updatedTasks); // Actualizar lista original
        setFilteredTasks(updatedTasks)


    }

    function moveSelectedTasks(newStatus) {
        const updatedTasks = tasks.map((task) =>
            task.isChecked ? { ...task, status: newStatus, isChecked: false } : task
        );
        setTasks(updatedTasks);
        setOriginalTasks(updatedTasks); // Asegurar consistencia
        setFilteredTasks(updatedTasks); // Asegurar consistencia con el filtro activo

        updatedTasks.forEach(task => {

            window.api.updateTask(task)

        });

    }

    function handleFilterByTitle() {
        const titleFilter = document.getElementById("iptTitle").value.trim();
        if (titleFilter === "") {
            setFilteredTasks(originalTasks); // Restaurar todas las tareas
            return;
        }

        const updatedTasks = originalTasks.filter((task) =>
            task.name.toLowerCase().includes(titleFilter.toLowerCase())
        );

        setFilteredTasks(updatedTasks);
    }

    function handleFilterByStatus() {
        const statusFilter = document.getElementById("iptStatus").value.trim();
        if (statusFilter === "") {
            setFilteredTasks(originalTasks); // Restaurar todas las tareas
            return;
        }

        const updatedTasks = originalTasks.filter(
            (task) => task.status.toLowerCase() === statusFilter.toLowerCase()
        );

        setFilteredTasks(updatedTasks);
    }

    function handleSortByDate() {
        const dateInput = document.getElementById("iptDate").value;
        if (dateInput === "") return;

        const sortedTasks = [...filteredTasks].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );

        setFilteredTasks(sortedTasks);
    }

    function hideShowCompletedAndCanceled() {
        setIsHidden(!isHidden);
    }


    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <>

            <div className="background">
                <p className="text">Task List</p>

                <Layout>

                    <Sider
                        collapsible
                        collapsedWidth={80}
                        onCollapse={(collapsed) => setCollapsed(collapsed)}
                    >


                        <div className="demo-logo-vertical" />

                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} />

                    </Sider>
                    <Layout>


                        <Content
                            style={{
                                margin: '24px 16px 0',
                            }}
                        >
                            <div
                                style={{
                                    padding: 24,
                                    minHeight: 860,
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                            >


                               

                                    <button
                                        className="btn btn-secondary dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Sort list by:
                                    </button>
                                    <small style={{ color: "grey", fontFamily: "monospace", marginLeft: "4px" }}>
                                        Remove the text from the filter to recover the cards info
                                    </small>
                                    <ul className="dropdown-menu dropdown-menu-dark">
                                        <li>
                                            <div className="input-group mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Example: 'Make Exercise'"
                                                    id="iptTitle"
                                                />
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    onClick={handleFilterByTitle}
                                                >
                                                    Search
                                                </button>
                                                <small style={{ color: "grey", fontFamily: "monospace", margin: "7px" }}>
                                                    Sort by Title
                                                </small>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="input-group mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="iptStatus"
                                                    placeholder="Example: 'In Progress'"
                                                />
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    onClick={handleFilterByStatus}
                                                >
                                                    Search
                                                </button>
                                                <small style={{ color: "grey", fontFamily: "monospace", margin: "7px" }}>
                                                    Sort by Status
                                                </small>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="input-group mb-3">
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="iptDate"
                                                />
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    onClick={handleSortByDate}
                                                >
                                                    Search
                                                </button>
                                                <small style={{ color: "grey", fontFamily: "monospace", margin: "7px" }}>
                                                    Sort by Date
                                                </small>
                                            </div>
                                        </li>
                                    </ul>

                                    <form className="input-group mb-3" >
                                    </form>

                                    <div className="container text-center">
                                        <div className="row align-items-start">
                                            <div className="col" >
                                                Pending
                                                <ul className="list-group">
                                                    {filteredTasks // Cmabiado esto
                                                        .filter((task) => task.status === "Pending")
                                                        .map((task, index) => (
                                                            <div className="d-flex justify-content-center align-content-center">
                                                                <TaskItem
                                                                    key={task.id}
                                                                    task={task}
                                                                    index={index + 1}
                                                                    handleDelete={handleDelete}
                                                                    handleCheckboxChange={handleCheckboxChange}
                                                                />

                                                            </div>

                                                        ))}
                                                </ul>
                                            </div>
                                            <div className="col" >
                                                In Progress
                                                <ul className="list-group">
                                                    {filteredTasks
                                                        .filter((task) => task.status === "In Progress")
                                                        .map((task, index) => (

                                                            <div className="d-flex justify-content-center align-content-center">

                                                                <TaskItem
                                                                    key={task.id}
                                                                    task={task}
                                                                    index={index + 1}
                                                                    handleDelete={handleDelete}
                                                                    handleCheckboxChange={handleCheckboxChange}
                                                                />
                                                            </div>

                                                        ))}
                                                </ul>
                                            </div>
                                            <div className="col" >

                                                Completed
                                                {!isHidden && (
                                                    <ul className="list-group">
                                                        {filteredTasks
                                                            .filter((task) => task.status === "Completed")
                                                            .map((task, index) => (
                                                                <div className="d-flex justify-content-center align-content-center">

                                                                    <TaskItem
                                                                        key={task.id}
                                                                        task={task}
                                                                        index={index + 1} // En vez de hacerlo desde 0 lo hago desde 1
                                                                        handleDelete={handleDelete}
                                                                        handleCheckboxChange={handleCheckboxChange}
                                                                    />

                                                                </div>

                                                            ))}
                                                    </ul>
                                                )}
                                            </div>
                                            <div className="col" >
                                                Canceled
                                                {!isHidden && (
                                                    <ul className="list-group">
                                                        {filteredTasks
                                                            .filter((task) => task.status === "Canceled")
                                                            .map((task, index) => (
                                                                <div className="d-flex justify-content-center align-content-center">

                                                                    <TaskItem
                                                                        key={task.id}
                                                                        task={task}
                                                                        index={index + 1}
                                                                        handleDelete={handleDelete}
                                                                        handleCheckboxChange={handleCheckboxChange}
                                                                    />
                                                                </div>

                                                            ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            

                        </Content>

                    </Layout>
                </Layout>

            </div>

        </>
    );
}
