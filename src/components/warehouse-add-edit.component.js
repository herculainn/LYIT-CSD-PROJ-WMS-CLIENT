import React, { Component } from "react";
import WarehouseDataService from "../services/warehouse.service";
import {warehouseModel} from "../models/warehouse.model";
import _ from "lodash";

export default class AddWarehouse extends Component {
    constructor(props) {
        super(props);

        this.createWarehouse = this.createWarehouse.bind(this);
        this.updateWarehouse = this.updateWarehouse.bind(this);

        this.newWarehouse = this.newWarehouse.bind(this);
        this.getWarehouse = this.getWarehouse.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.formRefs = [];

        this.state = warehouseModel;
        this.originalId = -1;
        this.isAdding = false;

        delete this.state['id'];
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.getWarehouse(this.props.match.params.id);
        } else {
            this.newWarehouse();
        }
    }

    newWarehouse() {
        this.isAdding = true;
        let newWarehouse = this.state;
        this.setState(newWarehouse, function () {
            console.log("newWarehouse: Force form update!");
        });
    }

    getWarehouse(id) {
        WarehouseDataService.get(id)
            .then(response => {
                this.originalId = response.data.id;

                // State will be used to create form fields
                // we do not want these to be edited
                delete response.data['id'];
                delete response.data['createdAt'];
                delete response.data['updatedAt'];
                delete response.data['binLocations'];
                delete response.data['users'];
                delete response.data['stockItemCounts'];

                this.setState(response.data, function () {
                    //this.originalId = response.data.id;
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    handleSubmit(event) {
        event.preventDefault();
        // this.formRefs contains a list of references to DOM objects which were created
        // to match the properties of this.state. Now we can update this.stat in the same order
        // https://reactjs.org/docs/uncontrolled-components.html

        let newWarehouse = {};
        // eslint-disable-next-line array-callback-return
        this.formRefs.map((item, idx) => {
            if (item.current) {
                const name = item.current.id;
                const value = item.current.value;
                if ((!this.isAdding) || value) {
                    // Compile a new warehouse object with values where they have been entered
                    _.merge(newWarehouse, {
                        [name]: value
                    }); // Lodash merge
                }
            }
        })

        // Update the state with the new object. This will merge with current.
        // The setState() function is asynchronous and so we update only once
        // and use the callback to complete the save.
        this.setState(newWarehouse, function () {
            if (this.isAdding) {
                this.createWarehouse();
            } else {
                this.updateWarehouse();
            }
        });
    }

    createWarehouse() {
        const data = JSON.stringify(this.state);
        console.log("createWarehouse " + data);

        WarehouseDataService.create(data)
            .then(response => {
                window.location.href = "/warehouses";
                //console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    updateWarehouse() {
        console.log("updateWarehouse " + this.originalId);
        console.log("updateWarehouse " + JSON.stringify(this.state));

        WarehouseDataService.update(
            this.originalId,
            this.state
        )
            .then(response => {
                window.location.href = "/warehouses";
                //console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        let newWarehouse = this.state;

        // Prepare an array of currentWarehouse JSON properties to display
        let warehouseElements = [];
        if (newWarehouse) {
            Object.keys(newWarehouse).forEach(function (key) {
                let value = newWarehouse[key];

                // TODO: Provide a means to select items for an array!
                if (!Array.isArray(newWarehouse[key])) {
                    warehouseElements.push({
                        label: key,
                        value: value
                    });
                }
            });
        }

        return (
            <form className="submit-form row-cols-1" onSubmit={this.handleSubmit}>
                <h4>{this.isAdding ? "Create New" : "Edit Existing"} Warehouse</h4>

                <div>
                    <div className="form-group">

                        {warehouseElements.map((item, idx) => {
                            this.formRefs.push(React.createRef());
                            return (
                                <input
                                    key={idx}
                                    type="text"
                                    className="form-control"
                                    id={item.label}
                                    name={item.label}
                                    placeholder={item.label}
                                    ref={this.formRefs[idx]}
                                    defaultValue={item.value}
                                />
                            )
                        })}

                    </div>


                    <div className="row-cols-4">

                        <input
                            type="submit"
                            value="Submit"
                            className="btn btn-primary"
                        />

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                window.location.href = "/warehouses";
                            }}
                            className="btn btn-warning"
                            >Cancel
                        </button>

                    </div>

                </div>
            </form>
        );
    }
}