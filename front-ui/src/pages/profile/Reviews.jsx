import { DataTable, Loading } from "@/components";
import http from "@/http";
import { dt } from "@/lib";
import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";

export const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReview();
  }, []);

    const loadReview = async () => {
      setLoading(true);
  
      try {
        const { data } = await http.get("profile/reviews");
        setReviews(data);
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
          sortable={['User', 'Product', 'Comment', 'Rating', 'Created At']}
          searchable={['User', 'Product', 'Comment', 'Rating', 'Created At']}
          data={reviews.map((review) => ({
            Product: review.product?.name || "Unknown Product",
            Comment: review.comment,
            Rating: review.rating,
            "Created At": dt(review.createdAt),
          }))}
        />
          }
        
      </Col>
    </Row>
  );
};
