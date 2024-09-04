import { useState, useEffect } from "react";
import { Col, Row, Button } from "react-bootstrap";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { DataTable, Loading } from "@/components";
import http from "@/http";
import { dt } from "@/lib";

dayjs.extend(localizedFormat);

export const List = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = () => {
        setLoading(true);
        http.get("cms/customers")
            .then(({ data }) => setCustomers(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    const handleDelete = (id) => {
        confirmAlert({
            title: "Confirm Delete",
            message: "Are you sure to delete this Customer?",
            buttons: [
                {
                    label: "Yes",
                    className: "btn-sm text-bg-danger",
                    onClick: () => {
                        setLoading(true);
                        http.delete(`/cms/customers/${id}`)
                            .then(() => loadCustomers())
                            .catch((err) => console.error(err))
                            .finally(() => setLoading(false));
                    },
                },
                {
                    label: "No",
                    className: "text-bg-secondary",
                    onClick: () => {},
                },
            ],
        });
    };

    return (
        <Col className="bg-white my-3 py-3 rounded-2 shadow-sm">
            <Row>
                <Col>
                    <h1>Customers</h1>
                </Col>
                <Col xs="auto">
                    <Link to="/customers/create" className="btn btn-dark">
                        <i className="fa-solid fa-plus me-2"></i> Add Customer
                    </Link>
                </Col>
            </Row>
            {loading ? (
                <Loading />
            ) : (
                <Row>
                    <Col>
                        <DataTable
                            sortable={["Name", "Email", "Phone", "Address", "Status", "Created At", "Updated At"]}
                            searchable={["Name", "Email", "Phone", "Address", "Status", "Created At", "Updated At"]}
                            data={customers.map((customer) => ({
                                Name: customer.name,
                                Email: customer.email,
                                Phone: customer.phone,
                                Address: customer.address,
                                Status: customer.status ? "Active" : "Inactive",
                                "Created At": dt(customer.createdAt),
                                "Updated At": dt(customer.updatedAt),
                                Action: (
                                    <>
                                        <Link to={`/customers/edit/${customer._id}`} className="btn btn-dark btn-sm me-2">
                                            <i className="fa-solid fa-edit me-2"></i>Edit
                                        </Link>
                                        <Button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(customer._id)}>
                                            <i className="fa-solid fa-trash me-2"></i>Delete
                                        </Button>
                                    </>
                                ),
                            }))}
                        />
                    </Col>
                </Row>
            )}
        </Col>
    );
};
