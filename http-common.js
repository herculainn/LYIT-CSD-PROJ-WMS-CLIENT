import axios from "axios";

export default axios.create({
    baseURL: "http://192.168.178.84:24326/api",
    headers: {
        "Content-type": "application/json"
    }
});