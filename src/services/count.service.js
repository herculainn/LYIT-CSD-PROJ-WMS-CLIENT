import http from "../http-common";

class CountDataService {
    create(data) {
        return http.post("/stockcount", data);
    }
}

export default new CountDataService();