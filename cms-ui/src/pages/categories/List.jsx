import http from "@/http";
import { useEffect, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { DataTable, Loading } from "@/components";
import { dt } from "@/lib";

export const List = () => {
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
loadCategories();
}, []);

const loadCategories = () => {
setLoading(true);
http.get("cms/categories")
.then(({ data }) => setCategories(data))
.catch(err => console.error(err))
.finally(() => setLoading(false));
};

const handleDelete = id => {
confirmAlert({
title: "Confirm Delete",
message: "Are you sure to delete this Category?",
buttons: [
{
label: "Yes",
className: "btn-sm text-bg-danger",
onClick: () => {
setLoading(true);
http.delete(`/cms/categories/${id}`)
.then(() => loadCategories())
.catch((err) => console.error(err))
.finally(() => setLoading(false));
},
},
{
label: "No",
className: "text-bg-secondary",
onClick: () => { },
}
]
});
};

return (
<Col className="bg-white my-3 py-3 rounded-2 shadow-sm">
<Row>
    <Col>
    <h1>Categories</h1>
    </Col>
    <Col xs="auto">
    <Link to="/categories/create" className="btn btn-dark">
    <i className="fa-solid fa-plus me-2"></i> Add Category
    </Link>
    </Col>
</Row>
{loading ?
<Loading /> :
<Row>
    <Col>
    <DataTable sortable={['Name', 'Status' , 'Created At' , 'Updated At' ]} searchable={['Name', 'Status' , 'Created At'
        , 'Updated At' ]} data={categories.map(category=> {
        return {
        Name: category.name,
        Status: category.status ? 'Active' : 'Inactive',
        'Created At': dt(category.createdAt),
        'Updated At': dt(category.updatedAt),
        'Action': <>
            <Link to={`/categories/edit/${category._id}`} className="btn btn-dark btn-sm me-2">
            <i className="fa-solid fa-edit me-2"></i>Edit
            </Link>
            <Button type="button" className="btn btn-danger btn-sm" onClick={()=> handleDelete(category._id)}>
                <i className="fa-solid fa-trash me-2"></i>Delete
            </Button>
        </>
        }
        })}
        />
        </Col>
</Row>
}
</Col>
);
};