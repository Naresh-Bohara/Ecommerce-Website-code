import { Layout } from "@/components"
import * as Pages from "@/pages"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { PrivateRoute } from "./PrivateRoute"

export const FrontRoutes = ()=>{
    return <BrowserRouter>
    <Routes>
        <Route path="/" element={<Layout/>}>
         <Route index element={<Pages.Front.Home/> } />
         <Route path="categories/:id" element={<Pages.Front.Category/> } />
         <Route path="brands/:id" element={<Pages.Front.Brand/> } />
         <Route path="products/:id" element={<Pages.Front.Product/> } />
         <Route path="search" element={<Pages.Front.Search/> } />
         <Route path="cart" element={<PrivateRoute element={<Pages.Front.Cart />} />}/>
         <Route path="profile" element={<PrivateRoute element={<Pages.Profile.Dashboard />} />}/>

         <Route path="register" element={<Pages.Auth.Register/> } />
         <Route path="login" element={<Pages.Auth.Login/> } />
       

         

          
         </Route>
    </Routes>
    </BrowserRouter>
}