import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Warehouse from "./components/warehouse-add-edit.component";
import WarehousesList from "./components/warehouse-list.component";

import BinLocation from "./components/binLocation-add-edit.component";
import BinLocationsList from "./components/binLocation-list.component";

import StockItem from "./components/stockItem-add-edit.component";
import StockItemsList from "./components/stockItem-list.component";

import AddAdjustment from "./components/adjustment.component";
import AddCount from "./components/count.component";

class App extends Component {
  render() {
    return (
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <a href="/warehouses" className="navbar-brand">
              &nbsp;&nbsp;&nbsp;&nbsp;MYWMS
            </a>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/warehouses"} className="nav-link">
                  Warehouses
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/stockItems"} className="nav-link">
                  Stock Items
                </Link>
              </li>
            </div>
          </nav>

          <div className="container mt-3">
            <Switch>

              {/* WAREHOUSES Listing */}
              <Route exact path={["/", "/warehouses"]} component={WarehousesList} />
              {/* WAREHOUSES AddEdit */}
              <Route exact path="/warehouses/add" component={Warehouse} />
              <Route path="/warehouses/edit/:id" component={Warehouse} />

              {/* BINLOCATIONS Listings */}
              <Route exact path="/binLocations" component={BinLocationsList} />
              <Route path="/binLocations/warehouseId/:warehouseId" component={BinLocationsList} />
              <Route path="/binLocations/stockItemId/:stockItemId" component={BinLocationsList} />
              {/* BINLOCATIONS AddEdit */}
              <Route exact path="/binLocations/add/:warehouseId" component={BinLocation} />
              <Route path="/binLocations/edit/:id" component={BinLocation} />

              {/* STOCKITEMS Listings */}
              <Route exact path="/stockItems" component={StockItemsList} />
              <Route exact path="/stockItems/binLocationId/:binLocationId" component={StockItemsList} />
              {/* STOCKITEMS AddEdit */}
              <Route exact path="/stockItems/add" component={StockItem} />
              <Route path="/stockItems/edit/:id" component={StockItem} />

              {/* ADJUSTMENT and COUNT */}
              <Route path="/adjust/:id" component={AddAdjustment} />
              <Route path="/count/:id" component={AddCount} />

            </Switch>
          </div>
        </div>
    );
  }
}

export default App;