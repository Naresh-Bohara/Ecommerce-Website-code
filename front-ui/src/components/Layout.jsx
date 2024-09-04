import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import { setUser } from "@/store";
import { fromStorage, removeStorage } from "@/lib";
import http from "@/http";
import { Loading } from "./Loading";
import { clearUser } from "@/store";
import { useDispatch, useSelector } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Layout.css";

export const Layout = () => {
  const user = useSelector(state => state.user.value);
  const cart = useSelector(state => state.cart.value);

  
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState("");
  const [totalQty, setTotalQty] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([http.get(`/categories`), http.get(`/brands`)])
      .then(([{ data: catList }, { data: brnList }]) => {
        setCategories(catList);
        setBrands(brnList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(()=>{
     if(Object.keys(cart).length > 0){
        let qt = 0, tp = 0

        for(let id in cart){
          const product = cart[id].product
          const price = product.discountedPrice > 0 ? product.discountedPrice : product.price

          qt += cart[id].qty
          tp += cart[id].qty * price
        }

        setTotalQty(qt)
        setTotalPrice(tp)
     }else{
      setTotalQty(0)
      setTotalPrice(0)
     }
  }, [cart])

  useEffect(() => {
    const token = fromStorage("FrontAccessToken");
    if (token) {
      setLoading(true);
      http.get("/profile")
        .then(({ data }) => {
          dispatch(setUser(data));
        })
        .catch(() => removeStorage("FrontAccessToken"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search/?term=${term}`);
  };

  const handleLogout = (e) => {
    e.preventDefault();

    removeStorage('FrontAccessToken');
    dispatch(clearUser());
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row min-vh-100">
          <div className="col-12">
            <header className="row">
              <div className="col-12 bg-dark py-2 d-md-block d-none">
                <div className="row">
                  <div className="col-auto me-auto">
                    <ul className="top-nav">
                      <li>
                        <a href="tel:+977-9864755254">
                          <i className="fa fa-phone-square me-2"></i>+977-9864755254
                        </a>
                      </li>
                      <li>
                        <a href="mailto:nareshbohara0533@gmail.com">
                          <i className="fa fa-envelope me-2"></i>nareshbohara0533@gmail.com
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-auto">
                    {user ? (
                      <ul className="top-nav">
                        <li>
                          <Link to={`/profile`}>
                            <i className="fas fa-user-edit me-2"></i>{user.name}
                          </Link>
                        </li>
                        <li>
                          <Link to={`/logout`} onClick={handleLogout}>
                            <i className="fas fa-sign-in-alt me-2"></i>Logout
                          </Link>
                        </li>
                      </ul>
                    ) : (
                      <ul className="top-nav">
                        <li>
                          <Link to={`/register`}>
                            <i className="fas fa-user-edit me-2"></i>Register
                          </Link>
                        </li>
                        <li>
                          <Link to={`/login`}>
                            <i className="fas fa-sign-in-alt me-2"></i>Login
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-12 bg-white pt-4">
                <div className="row">
                  <div className="col-lg-auto">
                    <div className="site-logo text-center text-lg-left">
                      <Link to="/">NepBazar</Link>
                    </div>
                  </div>
                  <div className="col-lg-5 mx-auto mt-4 mt-lg-0">
                    <form action="#" onSubmit={handleSearch}>
                      <div className="form-group">
                        <div className="input-group">
                          <input
                            type="search"
                            className="form-control border-dark"
                            placeholder="Search..."
                            required
                            value={term}
                            onChange={({ target }) => setTerm(target.value)}
                          />
                          <button type="submit" className="btn btn-outline-dark">
                            <i className="fas fa-search"></i>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="col-lg-auto text-center text-lg-left header-item-holder">
                    <a href="#" className="header-item">
                      <i className="fas fa-heart me-2"></i>
                      <span id="header-favorite">0</span>
                    </a>
                    <Link to={`/cart`} className="header-item">
                      <i className="fas fa-shopping-bag me-2"></i>
                      <span id="header-qty" className="me-3"> {totalQty} </span>
                      <i className="fas fa-money-bill-wave me-2"></i>
                      <span id="header-price"> Rs. {totalPrice.toLocaleString('en-NP')} </span>
                    </Link>
                  </div>
                </div>

                <div className="row">
                  <nav className="navbar navbar-expand-lg navbar-light bg-white col-12">
                    <button
                      className="navbar-toggler d-lg-none border-0"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#mainNav"
                    >
                      <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="mainNav">
                      <ul className="navbar-nav mx-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                          <Link to={`/`} className="nav-link">
                            Home
                          </Link>
                        </li>

                        <NavDropdown title="Categories">
                          {categories.map(category => (
                            <Link className="dropdown-item"
                              to={`/categories/${category._id}`}
                              key={category._id}
                            > 
                              {category.name} 
                            </Link>
                          ))}
                        </NavDropdown>

                        <NavDropdown title="Brands">
                          {brands.map(brand => (
                            <Link className="dropdown-item"
                              to={`/brands/${brand._id}`}
                              key={brand._id}
                            > 
                              {brand.name} 
                            </Link>
                          ))}
                        </NavDropdown>

                      </ul>
                    </div>
                  </nav>
                </div>
              </div>
            </header>
          </div>

          {loading ? <Loading /> : <Outlet />}

          <div className="col-12 align-self-end">
            <footer className="row">
              <div className="col-12 bg-dark text-white pb-3 pt-5">
                <div className="row">
                  <div className="col-lg-2 col-sm-4 text-center text-sm-left mb-sm-0 mb-3">
                    <div className="row">
                      <div className="col-12">
                        <div className="footer-logo">
                          <a href="index.html">E-Commerce</a>
                        </div>
                      </div>
                      <div className="col-12">
                        <address>
                          221B Baker Street
                          <br />
                          London, England
                        </address>
                      </div>
                      <div className="col-12">
                        <a href="#" className="social-icon">
                          <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="social-icon">
                          <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="social-icon">
                          <i className="fab fa-pinterest-p"></i>
                        </a>
                        <a href="#" className="social-icon">
                          <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="social-icon">
                          <i className="fab fa-youtube"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-8 text-center text-sm-left mb-sm-0 mb-3">
                    <div className="row">
                      <div className="col-12 text-uppercase">
                        <h4>Who are we?</h4>
                      </div>
                      <div className="col-12 text-justify">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Integer dignissim neque condimentum lacus
                          dapibus.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-4 text-center text-sm-left mb-sm-0 mb-3">
                    <div className="row">
                      <div className="col-12 text-uppercase">
                        <h4>Our Products</h4>
                      </div>
                      <div className="col-12">
                        <ul className="footer-nav">
                          <li>
                            <a href="#">Our Products</a>
                          </li>
                          <li>
                            <a href="#">Our Products</a>
                          </li>
                          <li>
                            <a href="#">Our Products</a>
                          </li>
                          <li>
                            <a href="#">Our Products</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-4 text-center text-sm-left mb-sm-0 mb-3">
                    <div className="row">
                      <div className="col-12 text-uppercase">
                        <h4>Our Products</h4>
                      </div>
                      <div className="col-12">
                        <ul className="footer-nav">
                          <li>
                            <a href="#">Our Products</a>
                          </li>
                          <li>
                            <a href="#">Our Products</a>
                          </li>
                          <li>
                            <a href="#">Our Products</a>
                          </li>
                          <li>
                            <a href="#">Our Products</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-8 text-center text-sm-left mb-sm-0 mb-3">
                    <div className="row">
                      <div className="col-12 text-uppercase">
                        <h4>Our Newsletter</h4>
                      </div>
                      <div className="col-12">
                        <form action="#">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter your email"
                            />
                          </div>
                          <div className="form-group">
                            <button type="submit" className="btn btn-outline-light text-uppercase">
                              Subscribe
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};
