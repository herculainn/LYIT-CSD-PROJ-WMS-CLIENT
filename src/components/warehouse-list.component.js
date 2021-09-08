import React, { Component } from "react";
import WarehouseDataService from "../services/warehouse.service";
// import { Link } from "react-router-dom";

class WarehouseSummary extends Component {
    render() {
        return <li className={"list-group-item-action"}>{
            this.props.label + ": " + this.props.value
        }</li>;
    }
}

export default class WarehousesList extends Component {
    constructor(props) {
        super(props);

        this.retrieveWarehouses = this.retrieveWarehouses.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveWarehouse = this.setActiveWarehouse.bind(this);

        this.removeWarehouse = this.removeWarehouse.bind(this);

        this.state = {
            warehouses: [],
            currentWarehouse: null,
            currentIndex: -1
        };
    }

    componentDidMount() {
        this.retrieveWarehouses();
    }

    retrieveWarehouses() {
        WarehouseDataService.getAll()
            .then(response => {
                this.setState({
                    warehouses: response.data
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    refreshList() {
        this.retrieveWarehouses();
        this.setState({
            currentWarehouse: null,
            currentIndex: -1
        });
    }

    setActiveWarehouse(warehouse, index) {
        this.setState({
            currentWarehouse: warehouse,
            currentIndex: index
        });
    }

    removeWarehouse(id) {
        if (this.state.currentWarehouse) {
            WarehouseDataService.delete(id)
                .then(response => {
                    console.log(response.data);
                    this.refreshList();
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }

    render() {
        const { warehouses, currentWarehouse, currentIndex } = this.state;

        // Prepare an array of currentWarehouse JSON properties to display
        let warehouseElements = [];
        if (currentWarehouse) {
            Object.keys(currentWarehouse).forEach(function (key) {
                // Prepare the value of this property
                // If it is an array, just show a count
                let value = currentWarehouse[key];
                if (Array.isArray(currentWarehouse[key])) {
                    value = currentWarehouse[key].length;
                }
                // If we have a value then add to the display listing
                if (value) {
                    warehouseElements.push({
                        label: key,
                        value: value
                    });
                }
            });
        }

        return (
            <div className="row-cols-1">

                <div>
                    <h4>Warehouses</h4>
                    <ul className="list-group">
                        {warehouses &&
                        warehouses.map((warehouse, index) => (
                            <li
                                className={
                                    "list-group-item " +
                                    (index === currentIndex ? "active" : "")
                                }
                                onClick={() => this.setActiveWarehouse(warehouse, index)}
                                key={index}
                            >
                                { warehouse.description ? (warehouse.description) : (
                                    <i>No Description</i>
                                        ) }
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="row-cols-4">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentWarehouse) {
                                window.location.href = "/binLocations/warehouseId/" + currentWarehouse.id;
                            }
                        }}
                    >
                        View&nbsp;Locations
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = "/warehouses/add";
                        }}
                        >New
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentWarehouse) {
                                window.location.href = "/warehouses/edit/" + currentWarehouse.id;
                            }
                        }}
                        >Edit
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentWarehouse) {
                                this.removeWarehouse(currentWarehouse.id);
                            }
                        }}
                        >Delete
                    </button>
                </div>

                <div>
                    {currentWarehouse ? (
                        <div>
                            <br />
                            <h5>Selected Warehouse</h5>
                            <ul>
                                {warehouseElements.map((item, idx) =>
                                    <WarehouseSummary key={idx} label={item.label} value={item.value} />
                                )}
                            </ul>
                        </div>
                    ) : (
                        <div>
                            <br />
                            <p>Select a Warehouse to see details.</p>
                        </div>
                    )}
                </div>

            </div>
        );
    }
}