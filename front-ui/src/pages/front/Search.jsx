import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import http from "@/http";
import { Loading, ProductCard } from "@/components";
import { Pagination, Form } from "react-bootstrap";

const DEFAULT_PAGE_SIZES = [5, 10, 20, 50, 100];

export const Search = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZES[0]);
  const [current, setCurrent] = useState(1);
  const [pages, setPages] = useState(1);
  const [paginated, setPaginated] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const term = searchParams.get("term") || "";
    setSearchTerm(term);
    if (term) {
      setLoading(true);
      http.get(`/products/search`, { params: { term } })
        .then(({ data }) => {
          setProducts(data);
          setPages(Math.ceil(data.length / perPage));
          setCurrent(1);
        })
        .catch(error => console.error("Error fetching search results:", error))
        .finally(() => setLoading(false));
    }
  }, [searchParams, perPage]);

  useEffect(() => {
    const startIndex = (current - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, products.length);
    setPaginated(products.slice(startIndex, endIndex));
  }, [current, perPage, products]);

  const handlePageChange = (pageNumber) => {
    setCurrent(pageNumber);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchParams({ term });
  };

  return (
    <div className="col-12">
      <main className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12 py-3">
              <div className="row">
                <div className="col-12 text-center text-uppercase">
                  <h2>Search: '{searchTerm}'</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                 
                </div>
              </div>
              <div className="row row-cols-xl-6 row-cols-lg-4 row-cols-sm-2 justify-content-center">
                {loading ? <Loading /> : (
                  paginated.map((product) => (
                    <ProductCard product={product} key={product._id} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 d-flex justify-content-between align-items-center">
          <Form.Select
            className="w-auto"
            value={perPage}
            onChange={(e) => setPerPage(parseInt(e.target.value))}
          >
            {DEFAULT_PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Form.Select>
          <Pagination>
            <Pagination.Prev
              disabled={current === 1}
              onClick={() => handlePageChange(current - 1)}
            />
            {Array.from({ length: pages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === current}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={current === pages}
              onClick={() => handlePageChange(current + 1)}
            />
          </Pagination>
        </div>
      </main>
    </div>
  );
};
