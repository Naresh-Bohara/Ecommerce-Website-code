import { DataTable, Loading } from "@/components";
import http from "@/http";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { dt } from "@/lib";
dayjs.extend(localizedFormat);

export const List = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReview();
  }, []);

  const loadReview = () => {
    setLoading(true);
    setError(null);

    http.get("cms/reviews")
      .then(({ data }) => setReviews(data))
      .catch((err) => {
        console.error("Error loading reviews:", err);
        setError("An error occurred while loading reviews.");
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure to delete this Review?",
      buttons: [
        {
          label: "Yes",
          className: "btn-sm text-bg-danger",
          onClick: () => {
            setLoading(true);
            http.delete(`/cms/reviews/${id}`)
              .then(() => loadReview())
              .catch((err) => {
                console.error("Error deleting review:", err);
                setError("An error occurred while deleting the review.");
              })
              .finally(() => setLoading(false));
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

  return (
    <Col className="bg-white my-3 py-3 rounded-2 shadow-sm">
      <Row>
        <Col>
          <h1>Reviews</h1>
        </Col>
      </Row>
      {error ? (
        <Row>
          <Col>
            <p className="text-danger">{error}</p>
          </Col>
        </Row>
      ) : loading ? (
        <Loading />
      ) : (
        <Row>
          <Col>
            <DataTable
              sortable={['User', 'Product', 'Comment', 'Rating', 'Created At']}
              searchable={['User', 'Product', 'Comment', 'Rating', 'Created At']}
              data={reviews.map((review) => ({
                User: review.user?.name || "Unknown User",
                Product: review.product?.name || "Unknown Product",
                Comment: review.comment,
                Rating: review.rating,
                "Created At": dt(review.createdAt),
                "Action": (
                  <Button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(review._id)}
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
