import { Layout } from "@/components"
import * as Pages from "@/pages"
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom"
import { PrivateRoute } from "./PrivateRoute"
import { AdminRoute } from "./AdminRoute"
import { AdmStaffRoute } from "./AdmStaffRoute"

export const CmsRoutes = ()=>{
    return <BrowserRouter>
    <Routes>
        <Route path="/" element={<Layout/>}>
         <Route index element={<PrivateRoute element = {<Pages.Dashboard.List/>} />}/>
         <Route path="data-populate" element={<PrivateRoute element = 
         {<Pages.Dashboard.DataPopulate/>} />}/>
         <Route path="profile/edit" element={<PrivateRoute element = {<Pages.Profile.Edit/>} />}/>
         <Route path="password/edit" element={<PrivateRoute element = {<Pages.Profile.Password/>} />}/>
         
         <Route path="staffs" element={<PrivateRoute element={<AdminRoute element={<Outlet/>}/>}/>}>
           <Route index element={<Pages.Staffs.List/>} />
           <Route path="create" element={<Pages.Staffs.Create/>} />
           <Route path="edit/:id" element={<Pages.Staffs.Edit/>} />
         </Route>

         <Route path="customers" element={<PrivateRoute element={<AdmStaffRoute element={<Outlet/>}/>}/>}>
           <Route index element={<Pages.Customers.List/>} />
           <Route path="create" element={<Pages.Customers.Create/>} />
           <Route path="edit/:id" element={<Pages.Customers.Edit/>} />
         </Route>

         
         <Route path="brands" element={<PrivateRoute element={<AdmStaffRoute element={<Outlet/>}/>}/>}>
           <Route index element={<Pages.Brands.List/>} />
           <Route path="create" element={<Pages.Brands.Create/>} />
           <Route path="edit/:id" element={<Pages.Brands.Edit/>} />
         </Route>

         <Route path="categories" element={<PrivateRoute element={<AdmStaffRoute element={<Outlet/>}/>}/>}>
           <Route index element={<Pages.Categories.List/>} />
           <Route path="create" element={<Pages.Categories.Create/>} />
           <Route path="edit/:id" element={<Pages.Categories.Edit/>} />
         </Route>

         <Route path="products" element={<PrivateRoute element={<AdmStaffRoute element={<Outlet/>}/>}/>}>
           <Route index element={<Pages.Products.List/>} />
           <Route path="create" element={<Pages.Products.Create/>} />
           <Route path="edit/:id" element={<Pages.Products.Edit/>} />
         </Route>

         <Route path="reviews" element={<PrivateRoute element={<AdmStaffRoute element = {<Pages.Reviews.List/>} />} />}/>

         <Route path="orders" element={<PrivateRoute element={<AdmStaffRoute element = {<Pages.Orders.List/>} />} />}/>

         <Route path="login" element={<Pages.Auth.Login/>}/> 
         </Route>
    </Routes>
    </BrowserRouter>
}