import React, { Component } from "react";
import StockItemDataService from "../services/stockItem.service";
// import { Link } from "react-router-dom";

class StockItemSummary extends Component {
    render() {
        return <li className={"list-group-item-action"}>{
            this.props.label + ": " + this.props.value
        }</li>;
    }
}

export default class StockItemsList extends Component {
    constructor(props) {
        super(props);

        this.retrieveStockItems = this.retrieveStockItems.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveStockItem = this.setActiveStockItem.bind(this);

        this.removeStockItem = this.removeStockItem.bind(this);

        this.state = {
            stockItems: [],
            currentStockItem: null,
            currentIndex: -1
        };
        this.binLocationId = ''; // init
    }

    componentDidMount() {
        console.log("componentDidMount: " + this.props.match.params);
        if (this.props.match.params.binLocationId) {
            this.binLocationId = this.props.match.params.binLocationId;
            this.retrieveStockItems(this.binLocationId);
        } else {
            this.retrieveStockItems();
        }
    }

    retrieveStockItems(binLocationId) {
        console.log("retrieveStockItems: " + binLocationId);
        StockItemDataService.getAll(binLocationId)
            .then(response => {
                console.log("retrieveStockItems.then: " + JSON.stringify(response.data));
                this.setState({
                    stockItems: response.data
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    refreshList() {
        this.retrieveStockItems(this.binLocationId);
        this.setState({
            currentStockItem: null,
            currentIndex: -1
        });
    }

    setActiveStockItem(stockItem, index) {
        this.setState({
            currentStockItem: stockItem,
            currentIndex: index
        });
    }

    removeStockItem(id) {
        if (this.state.currentStockItem) {
            StockItemDataService.delete(id)
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
        const { stockItems, currentStockItem, currentIndex } = this.state;

        // Prepare an array of currentStockItem JSON properties to display
        let stockItemElements = [];
        if (currentStockItem) {
            Object.keys(currentStockItem).forEach(function (key) {
                // Prepare the value of this property
                // If it is an array, just show a count
                let value = currentStockItem[key];
                if (Array.isArray(currentStockItem[key])) {
                    value = currentStockItem[key].length;
                }
                // If we have a value then add to the display listing
                if (value) {
                    stockItemElements.push({
                        label: key,
                        value: value
                    });
                }
            });
        }

        return (
            <div className="row-cols-1">

                <div>
                    <h4>Stock Items</h4>
                    <ul className="list-group">
                        {stockItems &&
                        stockItems.map((stockItem, index) => (
                            <li
                                className={
                                    "list-group-item " +
                                    (index === currentIndex ? "active" : "")
                                }
                                onClick={() => this.setActiveStockItem(stockItem, index)}
                                key={index}
                            >
                                { stockItem.description ? (stockItem.description) : (
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
                            if (currentStockItem) {
                                window.location.href = "/binLocations/stockItemId/" + currentStockItem.id;
                            }
                        }}
                    >
                        View&nbsp;Bin&nbsp;Locations
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            if (this.binLocationId) {
                                window.location.href = "/stockItems/add/" + this.binLocationId;
                            } else {

                                // TODO: Implement a form which will present a list
                                //  of binLocations when adding a new Bin Location
                                alert("Warning: Not Implemented.\n" +
                                    "You must be viewing a BinLocation's Stock Item Listing.");

                            }
                        }}
                    >New
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentStockItem) {
                                window.location.href = "/stockItems/edit/" + currentStockItem.id;
                            }
                        }}
                    >Edit
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentStockItem) {
                                this.removeStockItem(currentStockItem.id);
                            }
                        }}
                    >Delete
                    </button>
                </div>

                <div>
                    {currentStockItem ? (
                        <div>
                            <br />
                            <h5>Selected Bin Location</h5>
                            <ul>
                                {stockItemElements.map((item, idx) =>
                                    <StockItemSummary key={idx} label={item.label} value={item.value} />
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