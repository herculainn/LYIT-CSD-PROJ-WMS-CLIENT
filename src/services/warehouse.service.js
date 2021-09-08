import http from "../http-common";

class WarehouseDataService {
    getAll() {
        return http.get("/warehouses");
    }

    get(id) {
        return http.get(`/warehouses/${id}`);
    }

    create(data) {
        return http.post("/warehouses", data);
    }

    update(id, data) {
        data.id = id; // use body method
        return http.put(`/warehouses`, data);
    }

    delete(id) {
        return http.delete(`/warehouses/${id}`);
    }
}

export default new WarehouseDataService();