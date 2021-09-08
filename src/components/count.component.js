import React, { Component } from "react";
import CountDataService from "../services/count.service";
import queryString from 'query-string';

export default class AddCount extends Component {
    constructor(props) {
        super(props);

        this.createCount = this.createCount.bind(this);

        this.onChangeCount = this.onChangeCount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            count: 0
        };
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            let sQuery = queryString.parse(this.props.location.search);
            console.log("Query: " + JSON.stringify(sQuery));
            let newCount = {
                stockItem: this.props.match.params.id,
                binLocation: sQuery.binlocation
            };
            this.setState(newCount, function () {
                console.log(this.state);
            });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("handleSubmit: " + JSON.stringify(this.state));
        this.setState(this.state, function () {
            this.createCount();
        });
    }

    createCount() {
        console.log("createCount: " + JSON.stringify(this.state));

        CountDataService.create(this.state)
            .then(response => {
                window.location.href = `/stockItems/binLocationId/${this.state.binLocation}`;
                //console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    onChangeCount(e) {
        this.setState({
            count: e.target.value
        }, function() {
            console.log("onChangeCount: " + JSON.stringify(this.state));
        });
    }

    render() {
        return (

            <form className="submit-form row-cols-1" onSubmit={this.handleSubmit}>
                <h4>Create Existing Count</h4>
                <h5>TODO: Add stockItem and BinLocation</h5>

                <div>

                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            id="count"
                            name="count"
                            placeholder="count"
                            required
                            onChange={this.onChangeCount}
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