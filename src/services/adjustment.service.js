import http from "../http-common";

class AdjustmentDataService {
    create(data) {
        console.log("AdjustmentDataService:create: " + JSON.stringify(data));
        return http.post("/stockadjustment", data);
    }
}

export default new AdjustmentDataService();