import { removeStorage } from "@/lib"
import { clearUser } from "@/store"
import { Container, DropdownDivider, Nav, NavDropdown, Navbar } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Link, NavLink } from "react-router-dom"

export const CmsMenu = ()=>{
    const user = useSelector(state=>state.user.value)

    const dispatch  = useDispatch()

    const handleLogout = e =>{
     e.preventDefault()

     removeStorage("accessToken")
     dispatch(clearUser())
    }

    return user && <Navbar bg="dark" data-bs-theme="dark" expand="lg">
        <Container>
          <Link to="/" className="navbar-brand">NepBazar</Link>
          <Navbar.Toggle/>
          <Navbar.Collapse>
            <Nav className="me-auto">

              {user.role=="Admin" &&
                  <Nav.Item>
                  <NavLink className="nav-link me-3" to="/staffs">
                      <i className="fa-solid fa-people-roof me-2"></i>Staffs
                  </NavLink>
              </Nav.Item>
              }

            {(user.role === "Admin" || user.role === "Staff") &&
                <Nav.Item>
                <NavLink className="nav-link me-2" to="/customers">
                <i className="fa-solid fa-users me-2"></i>Customers
                 </NavLink>
                </Nav.Item>
            }

              { (user.role === "Admin" || user.role === "Staff") &&
                  <Nav.Item>
                  <NavLink className="nav-link me-2" to="/brands">
                  <i className="fa-solid fa-globe me-2"></i> Brands
                   </NavLink>
                  </Nav.Item>
              }

             { (user.role === "Admin" || user.role === "Staff") &&
                  <Nav.Item>
                  <NavLink className="nav-link me-2" to="/categories">
                  <i className="fa-solid fa-th-large  me-2"></i> Categories
                   </NavLink>
                  </Nav.Item>
              }


             { (user.role === "Admin" || user.role === "Staff") &&
                  <Nav.Item>
                  <NavLink className="nav-link me-2" to="/products">
                  <i className="fa-solid fa-gifts  me-2"></i> Products
                   </NavLink>
                  </Nav.Item>
              }

             { (user.role === "Admin" || user.role === "Staff") &&
                  <Nav.Item>
                  <NavLink className="nav-link me-2" to="/reviews">
                  <i className="fa-solid fa-comments  me-2"></i> Reviews
                   </NavLink>
                  </Nav.Item>
              }


              { (user.role === "Admin" || user.role === "Staff") &&
                  <Nav.Item>
                  <NavLink className="nav-link me-2" to="/orders">
                  <i className="fa-solid fa-shopping-bag  me-2"></i> Orders
                   </NavLink>
                  </Nav.Item>
              }

                
            </Nav>
            <Nav>
                <NavDropdown title={<>
                <i className="fa-solid fa-user-circle me-2"></i>{user.name}</>} align="end">
                    <Link to="/profile/edit" className="dropdown-item">
                        <i className="fa-solid fa-user-edit me-2"></i>Edit Profile
                    </Link> <DropdownDivider/>

                    <Link to="/password/edit" className="dropdown-item">
                        <i className="fa-solid fa-gear me-2"></i>Change Password
                    </Link><DropdownDivider/>
                   <Link onClick={handleLogout} className="dropdown-item"><i className="fa-solid fa-right-from-bracket me-2"></i>Logout</Link>
                </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
    </Navbar>
}