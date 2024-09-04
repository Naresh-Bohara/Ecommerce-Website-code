import { DataTable, Loading } from "@/components";
import http from "@/http";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { confirmAlert } from "react-confirm-alert";
import { dt } from "@/lib";
dayjs.extend(localizedFormat);

export const List = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await http.get("cms/orders");
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("An error occurred while loading orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this order?",
      buttons: [
        {
          label: "Yes",
          className: "btn-sm text-bg-danger",
          onClick: async () => {
            setLoading(true);
            setError(null);

            try {
              await http.delete(`/cms/orders/${id}`);
              loadOrders();
            } catch (err) {
              console.error("Error deleting order:", err);
              setError("An error occurred while deleting the order.");
            } finally {
              setLoading(false);
            }
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

  const handleUpdate = async (id, status) => {
    setLoading(true);
    setError(null);

    try {
      await http.patch(`/cms/orders/${id}`, { status });
      loadOrders();
    } catch (err) {
      console.error("Error updating order:", err);
      setError("An error occurred while updating the order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Col className="bg-white my-3 py-3 rounded-2 shadow-sm">
      <Row>
        <Col>
          <h1>Orders</h1>
        </Col>
      </Row>
      {error && (
        <Row>
          <Col>
            <p className="text-danger">{error}</p>
          </Col>
        </Row>
      )}
      {loading ? (
        <Loading />
      ) : (
        <Row>
          <Col>
            <DataTable
              sortable={[]}
              searchable={[]}
              data={orders.map((order) => ({
                Details: (
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.details.map((detail) => (
                        <tr key={detail._id}>
                          <td>{detail.product.name}</td>
                          <td>{detail.qty}</td>
                          <td>Rs. {detail.price.toLocaleString("en-NP")}</td>
                          <td>Rs. {detail.total.toLocaleString("en-NP")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ),
                User: order.user?.name || "Unknown User",
                Status: (
                  <Form.Select
                    value={order.status}
                    onChange={({ target }) => handleUpdate(order._id, target.value)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                ),
                "Created At": dt(order.createdAt),
                "Updated At": dt(order.updatedAt),
                Action: (
                  <Button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(order._id)}
                  >
                    <i className="fa-solid fa-trash me-2"></i>Delete
                  </Button>
                ),
              }))}
            />
          </Col>
        </Row>
      )}
    </Col>
  );
};
