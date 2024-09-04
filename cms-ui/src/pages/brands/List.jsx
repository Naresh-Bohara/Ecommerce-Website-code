import http from "@/http";
import { useEffect, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { DataTable, Loading } from "@/components";
import { dt } from "@/lib";

export const List = () => {
const [brands, setBrands] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
loadBrands();
}, []);

const loadBrands = () => {
setLoading(true);
http.get("cms/brands")
.then(({ data }) => setBrands(data))
.catch(err => console.error(err))
.finally(() => setLoading(false));
};

const handleDelete = id => {
confirmAlert({
title: "Confirm Delete",
message: "Are you sure to delete this Brand?",
buttons: [
{
label: "Yes",
className: "btn-sm text-bg-danger",
onClick: () => {
setLoading(true);
http.delete(`/cms/brands/${id}`)
.then(() => loadBrands())
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
    <h1>Brands</h1>
    </Col>
    <Col xs="auto">
    <Link to="/brands/create" className="btn btn-dark">
    <i className="fa-solid fa-plus me-2"></i> Add Brand
    </Link>
    </Col>
</Row>
{loading ?
<Loading /> :
<Row>
    <Col>
    <DataTable sortable={['Name', 'Status' , 'Created At' , 'Updated At' ]} searchable={['Name', 'Status' , 'Created At'
        , 'Updated At' ]} data={brands.map(brand=> {
        return {
        Name: brand.name,
        Status: brand.status ? 'Active' : 'Inactive',
        'Created At': dt(brand.createdAt),
        'Updated At': dt(brand.updatedAt),
        'Action': <>
            <Link to={`/brands/edit/${brand._id}`} className="btn btn-dark btn-sm me-2">
            <i className="fa-solid fa-edit me-2"></i>Edit
            </Link>
            <Button type="button" className="btn btn-danger btn-sm" onClick={()=> handleDelete(brand._id)}>
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