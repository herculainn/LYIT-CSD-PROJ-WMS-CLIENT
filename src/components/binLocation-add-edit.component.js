import React, { Component } from "react";
import BinLocationDataService from "../services/binLocation.service";
import WarehouseDataService from "../services/warehouse.service";
import {binLocationModel} from "../models/binLocation.model";
import {warehouseModel} from "../models/warehouse.model";
import _ from "lodash";

export default class AddBinLocation extends Component {
    constructor(props) {
        super(props);

        // Functions for reaching the binLocation data service
        this.updateBinLocation = this.updateBinLocation.bind(this);
        this.createBinLocation = this.createBinLocation.bind(this);

        // Functions for preparing initial state
        this.getBinLocation = this.getBinLocation.bind(this);
        this.newBinLocation = this.newBinLocation.bind(this);

        // Functions for form control
        this.handleSubmit = this.handleSubmit.bind(this);
        // a list of controls on the form
        this.formRefs = [];

        // Default properties
        this.state = binLocationModel;
        this.originalId = -1;
        this.warehouse = warehouseModel;
        this.isAdding = false;
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            // We have come via the "/binlocations/edit/:id" endpoint
            this.getBinLocation(this.props.match.params.id);

        } else if (this.props.match.params.warehouseId) {
            // We have come via the "/binlocations/add/:warehouseId" endpoint
            this.newBinLocation(this.props.match.params.warehouseId);
        }
    }

    getBinLocation(id) {
        console.log("getBinLocation: " + id);
        // This function must only be called from componentDidMount()
        // if we have come via the "/binlocations/edit/:id" endpoint

        // This is the first of several nested asynchronous calls
        // It will get existing details about the Bin Location we are editing
        BinLocationDataService.get(id)
            .then(responseBinLocation => {
                // The ID of the BinLocation we are editing
                // Store here as we will remove from the response
                // to ensure it is not edited on the form
                // we can then add it back to the object when
                // saving or updating the Bin Location record
                let tmpBinLocationId = responseBinLocation.data.id;
                let tmpWarehouseId = responseBinLocation.data.warehouseId;

                // Response is used to generate editable fields
                // remove the fields we do not want to edit
                delete responseBinLocation.data['id'];
                delete responseBinLocation.data['createdAt'];
                delete responseBinLocation.data['updatedAt'];

                // We will implement a better means to select
                // and attach existing Bin Locations and Users
                delete responseBinLocation.data['stockItemCounts'];
                // Keep in mind when editing a binlocation that the
                // original record in data will not be replaced
                // however, the attempt to create a new record
                // must provide a warehouseId to connect to
                // see createBinLocation for the magic
                delete responseBinLocation.data['warehouseId'];

                // Next we can get details about the warehouse
                // which is already connected to this Bin Location
                // this will be for display purposes
                WarehouseDataService.get(tmpWarehouseId)
                    .then(responseWarehouse => {

                        // Store the full response in case we need more data
                        // we will use the Description so that the user knows
                        // which warehouse the BinLocation is to be assigned
                        this.warehouse = responseWarehouse.data;

                        // These calls are all asynchronous, now we have all the
                        // information we need, we can store it as the state
                        this.setState(responseBinLocation.data, function () {

                            // Setstate will update the originalId when complete
                            // the form will repaint and all loops and branch statements
                            // will generate an appropriate form
                            this.originalId = tmpBinLocationId;
                        });

                    })
                    .catch(e => {
                        console.log(e);
                    });
            })
            .catch(e => {
                console.log(e);
            });
    }

    newBinLocation(id) {
        console.log("newBinLocation: " + id);
        // This function must only be called from componentDidMount()
        // if we have come via the "/binlocations/add/:warehouseId" endpoint
        WarehouseDataService.get(id)
            .then(response => {
                this.warehouse = response.data;
                this.isAdding = true;

                this.setState(binLocationModel, function () {
                    console.log("newBinLocation: Force form update!");
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    handleSubmit(event) {
        // We will handle the form submit here so no need to
        // follow any default browser implementation
        event.preventDefault();

        // Prepare an Object to use for submitting the create/update
        // We will iterate fields by formRefs and merge their values
        let newBinLocation = {};

        // this.formRefs contains a list of references to DOM objects which were created
        // to match the properties of this.state. Now we can update this.stat in the same order
        // https://reactjs.org/docs/uncontrolled-components.html

        // eslint-disable-next-line array-callback-return
        this.formRefs.map((item, idx) => {
            if (item.current) {
                const name = item.current.id;
                const value = item.current.value;

                // If we are editing a Bin Location we want any change
                // to reach the existing record including blanks
                // If we are adding a new Bin Location we can exclude them
                // just in case they cause validation issues
                if ((!this.isAdding) || value) {
                    _.merge(newBinLocation, {
                        [name]: value
                    }); // Lodash merge
                }
            }
        })

        // Update the state with the new object. This will merge with current.
        // The setState() function is asynchronous and so we update only once
        // and use the callback to complete the save.
        this.setState(newBinLocation, function () {
            if (this.isAdding) {
                this.createBinLocation();
            } else {
                this.updateBinLocation();
            }
        });
    }

    createBinLocation() {
        // Save a new Bin Location

        // We must first provide the new Bin Location with a warehouseId
        // this is stripped from the state so that it cannot be edited
        // and for the same reason is not required when updating existing
        let newBinLocation = this.state; // get current binLoc
        newBinLocation.warehouseId = this.warehouse.id;
        this.setState(newBinLocation, function () {

            // Now the state has been updated with warehouseId we can
            // proceed to send the create via the binLocation data service
            const data = JSON.stringify(this.state);
            BinLocationDataService.create(data)
                .then(response => {
                    window.location.href = "/binLocations/warehouseid/" + this.warehouse.id;
                    //console.log(response.data);
                })
                .catch(e => {
                    console.log(e);
                });
        });
    }

    updateBinLocation() {
        // Save updated Bin Location

        BinLocationDataService.update(
            this.originalId,
            this.state
        )
            .then(response => {
                window.location.href = "/binLocations/warehouseid/" + this.warehouse.id;
                //console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {

        // Prepare an array of fields to list
        let newBinLocation = this.state; // based on the current state
        let binLocationElements = []; // we will store each property here
        if (newBinLocation) {
            Object.keys(newBinLocation).forEach(function (key) {
                let value = newBinLocation[key];
                if (!Array.isArray(newBinLocation[key])) {
                    binLocationElements.push({
                        label: key,
                        value: value
                    });
                }
            });
        }

        return (
            <form className="submit-form row-cols-1" onSubmit={this.handleSubmit}>
                <h4>{this.isAdding ? "Create New" : "Edit Existing" } Bin Location</h4>
                <h5>{this.warehouse.description ? "Part of: " + this.warehouse.description : " "}</h5>

                <div>
                    <div className="form-group">

                        {binLocationElements.map((item, idx) => {
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
                                window.location.href = "/binLocations/warehouseid/" + this.warehouse.id;
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