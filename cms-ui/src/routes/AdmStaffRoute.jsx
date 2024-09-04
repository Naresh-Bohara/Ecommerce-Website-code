import { Loading } from "@/components";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const AdmStaffRoute = ({ element }) => {
  const user = useSelector((state) => state.user.value);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !['Admin', 'Staff'].includes(user.role)) {
      navigate("/");
    }
  }, [user, navigate]);

  return user ? element : <Loading />;
};
