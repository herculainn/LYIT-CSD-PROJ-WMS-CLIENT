import React, { Component } from "react";
import BinLocationDataService from "../services/binLocation.service";
// import { Link } from "react-router-dom";

class BinLocationSummary extends Component {
    render() {
        return <li className={"list-group-item-action"}>{
            this.props.label + ": " + this.props.value
        }</li>;
    }
}

export default class BinLocationsList extends Component {
    constructor(props) {
        super(props);

        this.retrieveBinLocations = this.retrieveBinLocations.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveBinLocation = this.setActiveBinLocation.bind(this);

        this.removeBinLocation = this.removeBinLocation.bind(this);

        this.state = {
            binLocations: [],
            currentBinLocation: null,
            currentIndex: -1
        };
        this.warehouseId = ''; // init
    }

    componentDidMount() {
        console.log("componentDidMount: " + this.props.match.params);
        if (this.props.match.params.warehouseId) {
            this.warehouseId = this.props.match.params.warehouseId;
            this.retrieveBinLocations(this.warehouseId);
        } else {
            this.retrieveBinLocations();
        }
    }

    retrieveBinLocations(data) {
        console.log("retrieveBinLocations: " + data);
        BinLocationDataService.getAll(data)
            .then(response => {
                console.log("retrieveBinLocations.then: " + data);
                this.setState({
                    binLocations: response.data
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    refreshList() {
        this.retrieveBinLocations(this.warehouseId);
        this.setState({
            currentBinLocation: null,
            currentIndex: -1
        });
    }

    setActiveBinLocation(binLocation, index) {
        this.setState({
            currentBinLocation: binLocation,
            currentIndex: index
        });
    }

    removeBinLocation(id) {
        if (this.state.currentBinLocation) {
            BinLocationDataService.delete(id)
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
        const { binLocations, currentBinLocation, currentIndex } = this.state;

        // Prepare an array of currentBinLocation JSON properties to display
        let binLocationElements = [];
        if (currentBinLocation) {
            Object.keys(currentBinLocation).forEach(function (key) {
                // Prepare the value of this property
                // If it is an array, just show a count
                let value = currentBinLocation[key];
                if (Array.isArray(currentBinLocation[key])) {
                    value = currentBinLocation[key].length;
                }
                // If we have a value then add to the display listing
                if (value) {
                    binLocationElements.push({
                        label: key,
                        value: value
                    });
                }
            });
        }

        return (
            <div className="row-cols-1">

                <div>
                    <h4>Bin Locations</h4>

                    <ul className="list-group">
                        {binLocations &&
                        binLocations.map((binLocation, index) => (
                            <li
                                className={
                                    "list-group-item " +
                                    (index === currentIndex ? "active" : "")
                                }
                                onClick={() => this.setActiveBinLocation(binLocation, index)}
                                key={index}
                            >
                                { binLocation.description ? (binLocation.description) : (
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
                            if (currentBinLocation) {
                                window.location.href = "/stockItems/binLocationId/" + currentBinLocation.id;
                            }
                        }}
                    >
                        View&nbsp;Stock&nbsp;Items
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            if (this.warehouseId) {
                                window.location.href = "/binLocations/add/" + this.warehouseId;
                            } else {

                                // TODO: Implement a form which will present a list
                                //  of warehouses when adding a new Bin Location
                                alert("Warning: Not Implemented.\n" +
                                    "You must be viewing a Warehouse's Bin Location Listing.");

                            }
                        }}
                    >New
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentBinLocation) {
                                window.location.href = "/binLocations/edit/" + currentBinLocation.id;
                            }
                        }}
                    >Edit
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentBinLocation) {
                                this.removeBinLocation(currentBinLocation.id);
                            }
                        }}
                    >Delete
                    </button>
                </div>

                <div>
                    {currentBinLocation ? (
                        <div>
                            <br />
                            <h5>Selected Bin Location</h5>
                            <ul>
                                {binLocationElements.map((item, idx) =>
                                    <BinLocationSummary key={idx} label={item.label} value={item.value} />
                                )}
                            </ul>
                        </div>
                    ) : (
                        <div>
                            <br />
                            <p>Select a Bin Location to see details.</p>
                        </div>
                    )}
                </div>

            </div>
        );
    }
}