const Hospital = require("./Hospital");
const Doctor = require('./Doctor');

class Instance {

    _doctors;
    _hospitals;

    constructor(numDoctors, numHospitals) {

        Hospital.numDoctors = numDoctors;

        this._doctors = [];
        this._hospitals = [];

        for (let i = 1; i <= numDoctors; i++) {
            this._doctors[i - 1] = new Doctor(i);
        }
        for (let i = 1; i <= numHospitals; i++) {
            this._hospitals[i - 1] = new Hospital(i);
        }

    }

    get doctors() {
        return this._doctors;
    }

    get hospitals() {
        return this._hospitals;
    }

    getDoctorById(id) {
        return this._doctors[id - 1];
    }

    getHospitalById(id) {
        return this._hospitals[id - 1];
    }

}

module.exports = Instance;