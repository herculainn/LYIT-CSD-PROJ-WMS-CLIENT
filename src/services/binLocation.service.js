import http from "../http-common";

class BinLocationDataService {
    getAll(id) {
        if (id) {
            return http.get(`/binLocations/warehouseid/${id}`);
        } else {
            return http.get(`/binLocations`);
        }
    }

    get(id) {
        return http.get(`/binLocations/${id}`);
    }

    create(data) {
        return http.post("/binLocations", data);
    }

    update(id, data) {
        data.id = id; // use body method
        return http.put(`/binLocations`, data);
    }

    delete(id) {
        return http.delete(`/binLocations/${id}`);
    }
}

export default new BinLocationDataService();