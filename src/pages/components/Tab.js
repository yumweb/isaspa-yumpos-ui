import { Tabs } from "react-bootstrap";
import { useState } from "react";
import Categories from "./Categories";
import { Tab } from "react-bootstrap";

const LabTabs = (props) => {
  const [key, setKey] = useState("categories");
  const { showGrid, addItemToCart } = props;
  return (
    <div className={showGrid ? "" : "hidden"}>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="categories" title="Categories">
          <Categories addItemToCart={addItemToCart}/>
        </Tab>
      </Tabs>
    </div>
  );
};

export default LabTabs;
