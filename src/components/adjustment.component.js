import React, { Component } from "react";
import AdjustmentDataService from "../services/adjustment.service";
import queryString from 'query-string';

export default class AddAdjustment extends Component {
    constructor(props) {
        super(props);

        this.createAdjustment = this.createAdjustment.bind(this);

        this.onChangeAdjustment = this.onChangeAdjustment.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            adjustment: 0
        };
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            let sQuery = queryString.parse(this.props.location.search);
            console.log("Query: " + JSON.stringify(sQuery));
            let newAdjustment = {
                stockItem: this.props.match.params.id,
                binLocation: sQuery.binlocation
            };
            this.setState(newAdjustment, function () {
                console.log(this.state);
            });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("handleSubmit: " + JSON.stringify(this.state));
        this.setState(this.state, function () {
            this.createAdjustment();
        });
    }

    createAdjustment() {
        console.log("createAdjustment: " + JSON.stringify(this.state));

        AdjustmentDataService.create(this.state)
            .then(response => {
                window.location.href = `/stockItems/binLocationId/${this.state.binLocation}`;
                //console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    onChangeAdjustment(e) {
        this.setState({
            adjustment: e.target.value
        }, function() {
            console.log("onChangeAdjustment: " + JSON.stringify(this.state));
        });
    }

    render() {
        return (

            <form className="submit-form row-cols-1" onSubmit={this.handleSubmit}>
                <h4>Create Existing Adjustment</h4>
                <h5>TODO: Add stockItem and BinLocation</h5>

                <div>

                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            id="adjustment"
                            name="adjustment"
                            placeholder="adjustment"
                            required
                            onChange={this.onChangeAdjustment}
                        />
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
                                window.location.href = `/stockItems/binLocationId/${this.state.binLocation}`;
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