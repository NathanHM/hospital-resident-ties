const fs = require('fs');
const Instance = require('./Instance');

class parser {

    _instance;

    parseInstance(filename) {
        const data = fs.readFileSync(filename, 'utf8');
        const lines = data.trim().split('\n');
        const numDoctors = parseInt(lines[0].trim());
        const numHospitals = parseInt(lines[1].trim());
        this._instance = new Instance(numDoctors, numHospitals);

        for (let i = 1; i <= numDoctors; i++) {
            const line = lines[i + 1].trim();
            const doctor = this._instance.getDoctorById(i);
            const doctorInfo = line.split(':');
            if (doctorInfo.length > 1) {
                const preferences = doctorInfo[1].trim().split(/\s+/);
                for (const preference of preferences) {
                    const hospitalId = parseInt(preference);
                    doctor.addPref(this._instance.getHospitalById(hospitalId));
                }
            }
        }

        for (let i = 1; i <= numHospitals; i++) {
            const line = lines[numDoctors + i + 1].trim();
            const hospital = this._instance.getHospitalById(i);
            const hospitalInfo = line.split(':');
            hospital.setCapacity(parseInt(hospitalInfo[1].trim()));

            if (hospitalInfo.length > 2) {
                let preferences = hospitalInfo[2].trim();
                let rank = 1;
                let inTie = false;
                while (preferences.length > 0) {
                    if (preferences.charAt(0) === ' ') {
                        preferences = preferences.slice(1);
                    } else if (preferences.charAt(0) === '(') {
                        inTie = true;
                        preferences = preferences.slice(1);
                    } else if (preferences.charAt(0) === ')') {
                        inTie = false;
                        rank++;
                        preferences = preferences.slice(1);
                    } else {
                        let j = 0;
                        while (j < preferences.length && !isNaN(parseInt(preferences.charAt(j)))) {
                            j++;
                        }
                        const doctorString = preferences.slice(0, j);
                        const doctorId = parseInt(doctorString);
                        hospital.addPref(this._instance.getDoctorById(doctorId), rank);
                        preferences = preferences.slice(j);
                        if (!inTie) rank++;
                    }
                }
            }
        }
        return this._instance;
    }

    parseMatching(filename) {

        const data = fs.readFileSync(filename, 'utf8');
        const lines = data.trim().split('\n');

        for (let i = 0; i < lines.length; i++) {

            const line = lines[i].trim();
            const tokens = line.split(/[(), ]+/);
            const doctorId = parseInt(tokens[1]);
            const hospitalId = parseInt(tokens[2]);
            const doctor = this._instance.getDoctorById(doctorId);
            const hospital = this._instance.getHospitalById(hospitalId);

            if (hospital.getRank(doctor) < 0) {
                console.log(`Hospital ${hospital.id} finds doctor ${doctor.id} unacceptable!`);
                return false;
            } else if (doctor.assignment != undefined) {
                console.log(`Doctor ${doctor.id} is multiply assigned!`);
                return false;
            } else {
                doctor.assignTo(hospital);
                hospital.incrementNumAssignees();
            }
        }

        const hospitals = this._instance.hospitals;
        for (const hospital of hospitals) {
            if (hospital.isOverSubscribed()) {
                console.log(`Hospital ${hospital.id} is oversubscribed!`);
                return false;
            }
        }

        return true;
    }

}

module.exports = parser;