import { Col, Row, Tab, Tabs } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Orders } from "./Orders";
import { Reviews } from "./Reviews";
import { Profile } from "./Profile";
import { Password } from "./Password";

export const Dashboard = () => {
    const user = useSelector(state => state.user.value);

    return <div className="col-12">
    <div className="row">
        <div className="col-12 mt-3 text-center text-uppercase">
            <h2> {user.name}'s Profile </h2>
        </div>
    </div>

    <main className="row">
        <div className="col-12 bg-white py-3 mb-3">
           <Row>
            <Col lg={8} md={10} className="mx-auto">
            <Tabs
      defaultActiveKey="orders"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="orders" title="Orders">
        <Orders />
      </Tab>
      <Tab eventKey="reviews" title="Reviews">
        <Reviews/>
      </Tab>
      <Tab eventKey="profile" title="Edit Profile">
         <Profile/>
      </Tab>
      <Tab eventKey="password" title="Change Password">
        <Password />
      </Tab>
    </Tabs>
            </Col>
           </Row>
        </div>

    </main>
</div>
}