import React, { Component } from "react";
import StockItemDataService from "../services/stockItem.service";
import {stockItemModel} from "../models/stockItem.model";
import _ from "lodash";

export default class AddStockItem extends Component {
    constructor(props) {
        super(props);

        this.saveStockItem = this.saveStockItem.bind(this);
        this.updateStockItem = this.updateStockItem.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.getStockItem = this.getStockItem.bind(this);

        this.formRefs = [];
        this.state = stockItemModel;

        this.originaID = this.state.id;
        delete this.state['id'];
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.getStockItem(this.props.match.params.id);
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        // this.formRefs contains a list of references to DOM objects which were created
        // to match the properties of this.state. Now we can update this.stat in the same order
        // https://reactjs.org/docs/uncontrolled-components.html

        let newStockItem = {};
        // eslint-disable-next-line array-callback-return
        this.formRefs.map((item, idx) => {
            if (item.current) {
                const name = item.current.id;
                const value = item.current.value;
                if (this.originaID || value) {
                    // Compile a new stockItem object with values where they have been entered
                    _.merge(newStockItem, {
                        [name]: value
                    }); // Lodash merge
                }
            }
        })

        // Update the state with the new object. This will merge with current.
        // The setState() function is asynchronous and so we update only once
        // and use the callback to complete the save.
        this.setState(newStockItem, function () {
            if (this.originaID) {
                this.updateStockItem();
            } else {
                this.saveStockItem();
            }
        });

    }

    getStockItem(id) {
        StockItemDataService.get(id)
            .then(response => {
                this.originaID = response.data.id;

                // Discard these
                delete response.data['id'];
                delete response.data['createdAt'];
                delete response.data['updatedAt'];
                // We will implement a better means to select
                // and attached bin locations later
                delete response.data['stockItemCounts'];

                this.setState(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    saveStockItem() {
        const data = JSON.stringify(this.state);

        StockItemDataService.create(data)
            .then(response => {
                window.location.href = "/stockItems";
                //console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    updateStockItem() {
        StockItemDataService.update(
            this.originaID,
            this.state
        )
            .then(response => {
                window.location.href = "/stockItems";
                //console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        let newStockItem = this.state;

        // Prepare an array of currentStockItem JSON properties to display
        let stockItemElements = [];
        if (newStockItem) {
            Object.keys(newStockItem).forEach(function (key) {
                let value = newStockItem[key];

                // TODO: Provide a means to select items for an array!
                if (!Array.isArray(newStockItem[key])) {
                    stockItemElements.push({
                        label: key,
                        value: value
                    });
                }
            });
        }

        return (
            <form className="submit-form row-cols-1" onSubmit={this.handleSubmit}>
                <h4>
                    {this.originaID ? "Edit Existing " : "Create New "} Stock Item
                </h4>

                <div>
                    <div className="form-group">

                        {stockItemElements.map((item, idx) => {
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
                                window.location.href = "/stockItems";
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