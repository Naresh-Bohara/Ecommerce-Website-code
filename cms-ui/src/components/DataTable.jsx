import React, { useEffect, useState } from "react";
import { Col, Form, Pagination, Row, Table } from "react-bootstrap";
import dayjs from "dayjs";

const DEFAULT_PAGE_SIZES = [5, 10, 20, 50, 100];

export const DataTable = ({ data = [], searchable = [], sortable = [] }) => {
  const [term, setTerm] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [direction, setDirection] = useState('asc');
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZES[1]);
  const [current, setCurrent] = useState(1);
  const [pages, setPages] = useState(1);
  const [offset, setOffset] = useState(0);
  const [paginated, setPaginated] = useState([]);
  const [pageLinks, setPageLinks] = useState([]);

  useEffect(() => {
    filterData();
  }, [term, data, searchable]);

  useEffect(() => {
    sortData();
  }, [sortBy, direction]);

  useEffect(() => {
    calculatePages();
  }, [perPage, filtered]);

  useEffect(() => {
    paginateData();
  }, [offset, filtered, perPage, current]);

  useEffect(() => {
    generatePageLinks();
  }, [pages, current]);

  const filterData = () => {
    if (term.length > 0) {
      const filteredData = data.filter(item =>
        searchable.some(k => `${item[k]}`.toLowerCase().includes(term.toLowerCase()))
      );
      setFiltered(filteredData);
    } else {
      setFiltered(data);
    }
    setCurrent(1);
    setSortBy('');
    setDirection('asc');
  };

  const sortData = () => {
    if (sortBy.length > 0) {
      const sortedData = [...filtered].sort((a, b) => {
        const valueA = getValueForSorting(a[sortBy]);
        const valueB = getValueForSorting(b[sortBy]);

        if (direction === 'asc') {
          if (valueA < valueB) return -1;
          if (valueA > valueB) return 1;
        } else {
          if (valueA > valueB) return -1;
          if (valueA < valueB) return 1;
        }
        return 0;
      });

      setFiltered(sortedData);
    }
  };

  const getValueForSorting = (value) => {
    if (typeof value === 'string') {
      return value.toLowerCase();
    } else if (typeof value === 'number') {
      return value;
    } else if (dayjs(value).isValid()) {
      return dayjs(value).valueOf();
    } else {
      return value.toString().toLowerCase();
    }
  };

  const calculatePages = () => {
    const totalPages = Math.ceil(filtered.length / perPage);
    setPages(totalPages);
    if (current > totalPages) {
      setCurrent(1);
    }
  };

  const paginateData = () => {
    const startIndex = (current - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, filtered.length);
    const paginatedData = filtered.slice(startIndex, endIndex);
    setPaginated(paginatedData);
    setOffset(startIndex);
  };

  const generatePageLinks = () => {
    const links = [];
    for (let i = 1; i <= pages; i++) {
      links.push(
        <Pagination.Item key={i} active={i === current} onClick={() => setCurrent(i)}>
          {i}
        </Pagination.Item>
      );
    }
    setPageLinks(links);
  };

  const handleSort = (column) => {
    if (sortable.includes(column)) {
      let newDirection = 'asc';
      if (column === sortBy) {
        newDirection = direction === 'asc' ? 'desc' : 'asc';
      }
      setSortBy(column);
      setDirection(newDirection);
      setCurrent(1); // Reset pagination to the first page after sorting
    }
  };

  return (
    <Row>
      <Col xs={12}>
        <Row>
          <Col md={2} className="mb-3">
            <Form.Label htmlFor="perPage">Per Page</Form.Label>
            <Form.Select
              name="perPage"
              id="perPage"
              value={perPage}
              onChange={({ target }) => setPerPage(parseInt(target.value))}
            >
              {DEFAULT_PAGE_SIZES.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </Form.Select>
          </Col>
          {searchable.length > 0 &&
            <Col md={4} xl={3} className="mb-3 ms-auto">
              <Form.Control
                type="search"
                name="term"
                id="term"
                placeholder="Search..."
                onChange={({ target }) => setTerm(target.value)}
                value={term}
              />
            </Col>
          }
        </Row>
      </Col>
      <Col xs={12}>
        {filtered.length > 0 ?
          <Table size="sm" striped hover bordered>
            <thead className="table-dark">
              <tr>
                {Object.keys(data[0]).map((column, index) => (
                  <th
                    key={index}
                    className={sortable.includes(column) ? 'sortable' : ''}
                    onClick={() => handleSort(column)}
                  >
                    {column} {sortBy === column && (
                      <i className={`fa-solid fa-chevron-${direction === 'asc' ? 'up' : 'down'} ms-3`}></i>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, j) => (
                    <td key={j}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table> :
          <h4 className="text-muted">No data found.</h4>
        }
        {pages > 1 &&
          <Row>
            <Col className="text-muted fst-italic">
              Showing {offset + 1} to {Math.min(offset + perPage, filtered.length)} on page {current} of {pages}
            </Col>
            <Col xs="auto" className="ms-auto">
              <Pagination>
                <Pagination.Prev disabled={current === 1} onClick={() => setCurrent(current - 1)} />
                {pageLinks}
                <Pagination.Next disabled={current === pages} onClick={() => setCurrent(current + 1)} />
              </Pagination>
            </Col>
          </Row>
        }
      </Col>
    </Row>
  );
};
