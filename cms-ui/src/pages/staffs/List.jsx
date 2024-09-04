import { DataTable, Loading } from "@/components"
import http from "@/http"
import { useEffect, useState } from "react"
import { Button, Col, Row } from "react-bootstrap"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Link } from "react-router-dom"
import { confirmAlert } from "react-confirm-alert"
import { dt } from "@/lib"
dayjs.extend(localizedFormat);

export const List = ()=>{
   const [staffs, setStaffs] = useState([])
   const [loading, setLoading] = useState(false)

   useEffect (()=>{
      loadStaff()
   }, []);

   const loadStaff = ()=>{
     setLoading(true)

      http.get("cms/staffs")
        .then(({data})=>setStaffs(data))
        .catch((err)=>console.log(err))
        .finally(()=>setLoading(false))
   }

   const handleDelete = id =>{
     confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure to delete this Staff?",
      buttons: [
         {
            label: "Yes",
            className:"btn-sm text-bg-danger",
            onClick:() => {
               setLoading(true)
               http.delete(`/cms/staffs/${id}`)
                  .then(() => loadStaff())
                  .catch((err) => console.log(err))
                  .finally(() => setLoading(false))
            },
         },

         {
            label: "No",
            className:"text-bg-secondary",
            onClick:() => {},
         }
      ]
     })
   }

   return <Col className="bg-white my-3 py-3 rounded-2 shadow-sm">
   <Row>
      <Col>
      <h1>Staffs</h1>
      </Col>

      <Col xs="auto">
      <Link to="/staffs/create" className="btn btn-dark">
         <i className="fa-solid fa-plus me-2"></i> Add Staff
      </Link>
      </Col>
   </Row>
   {loading ? <Loading/> : <Row>
      <Col>
      <DataTable sortable={['Name', 'Email', 'Phone', 'Address', 'Status', 'Created At',
       'Updated At']} searchable={['Name', 'Email', 'Phone', 'Address', 'Status', 'Created At',
       'Updated At']} data={staffs.map(staff=>{
         return{
            Name:staff.name,
            Email:staff.email,
            Phone:staff.phone,
            Address:staff.address,
            Status:staff.status ? 'Active' : 'Inactive',
            'Created At':dt(staff.createdAt),
            'Updated At':dt(staff.updatedAt),
            'Action': <>
              <Link to={`/staffs/edit/${staff._id}`} className="btn btn-dark btn-sm me-2">
               <i className="fa-solid fa-edit me-2"></i>Edit
              </Link>
              <Button type="button" className="btn btn-danger btn-sm" onClick={()=>handleDelete(staff._id)}>
               <i className="fa-solid fa-trash me-2"></i>Delete
              </Button>
            </>
         }
        })}/>
      </Col>
      </Row>}
   </Col>
}