import { DataTable, Loading } from "@/components";
import http from "@/http";
import { dt } from "@/lib";
import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);

    try {
      const { data } = await http.get("profile/orders");
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row>
      <Col className="my-3">
      
          { loading ? <Loading/> :
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
                    {order.orderDetails && order.orderDetails.length > 0 ? (
                      order.orderDetails.map((detail) => (
                        <tr key={detail._id}>
                          <td>{detail.product.name}</td>
                          <td>{detail.qty}</td>
                          <td>Rs. {detail.price.toLocaleString("en-NP")}</td>
                          <td>Rs. {detail.total.toLocaleString("en-NP")}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No details available</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              ),
              Status: order.status,
              "Created At": dt(order.createdAt),
              "Updated At": dt(order.updatedAt),
            }))}
          />
          }
        
      </Col>
    </Row>
  );
};
