import http from "../http-common";

class StockItemDataService {
    getAll(binLocationId) {
        if (binLocationId) {
            // New call to get the stock items belonging to a binlocation
            console.log("data getall with binloc " + binLocationId)
            return http.get(`/binlocations/stockItems/${binLocationId}`);
        } else {
            console.log("data get no bin")
            return http.get(`/stockItems`);
        }
    }

    get(id) {
        return http.get(`/stockItems/${id}`);
    }

    create(data) {
        return http.post("/stockItems", data);
    }

    update(id, data) {
        data.id = id; // use body method
        return http.put(`/stockItems`, data);
    }

    delete(id) {
        return http.delete(`/stockItems/${id}`);
    }
}

export default new StockItemDataService();