class Algorithm {

    _instance;

    constructor(instance) {
        this._instance = instance;
    }

    run() {
        let queue = [...this._instance.doctors];

        while (queue.length > 0) {

            const doctor = queue.shift();

            if (doctor.exhausted) {
                doctor.promote();
                doctor.exhausted = false;
            }

            for (const hospital of doctor.preferenceList) {
                if (!hospital.atCapacity()) {
                    doctor.assignTo(hospital);
                    hospital.assign(doctor);
                    break;
                } else {
                    hospital.updateWorstAssignee();
                    if (hospital.getRank(doctor) < hospital.rankOfWorstAssignee) {
                        hospital.getWorst().assignTo(undefined);
                        queue.push(hospital.getWorst());
                        hospital.rejectWorst();

                        hospital.assign(doctor);
                        doctor.assignTo(hospital);
                        break;
                    }
                }
            }

            if (doctor.assignment === undefined && doctor.promoted === false) {
                doctor.exhausted = true;
                queue.push(doctor);
            }

        }
    }

    printMatching() {
        console.log('Matching:');
        let matching = 0;

        for (const doctor of this._instance.doctors) {
            if (doctor.assignment !== undefined) {
                console.log(`Doctor ${doctor.toString()} is assigned to hospital ${doctor.assignment.toString()}.`);
                matching++;
            } else {
                console.log(`Doctor ${doctor.toString()} is unmatched.`);
            }
        }
        console.log(`Matching size: ${matching}`);
    }

    checkStability() {

        for (const doctor of this._instance.doctors) {
            if (doctor.assignment !== undefined) {
                doctor.assignment.assign(doctor);
            }
        }

        let stable = true;

        for (const doctor of this._instance.doctors) {
            for (const hospital of doctor.preferenceList) {

                if (doctor.assignment === hospital) {
                    break;
                }

                hospital.updateWorstAssignee();

                if (hospital.getRank(doctor) <= hospital.rankOfWorstAssignee) {
                    console.log(`Blocking pair between doctor ${doctor.id} and hospital ${hospital.id}.`)
                    stable = false;
                }
            }
        }

        if (stable) {
            console.log('Matching is stable.');
        } else {
            console.log('Matching is not stable.')
        }

    }

    checkMatching() {

        const doctors = this._instance.doctors;
        const hospitals = this._instance.hospitals;

        for (const hospital of hospitals) {
            hospital.resetNumAssignees();
        }

        for (const doctor of doctors) {
            if (doctor.assignment !== undefined) {
                const hospital = doctor.assignment;

                if (hospital.getRank(doctor) < 0) {
                    console.log(`Hospital ${hospital.id} does not find doctor ${doctot.id} acceptable!`)
                    return false;
                }

                hospital.incrementNumAssignees();
            }
        }

        for (const hospital of hospitals) {
            if (hospital.isOverSubscribed()) {
                console.log(`Hospital ${hospital.id} is over subscribed!`);
                return false;
            }
        }

        return true;

    }

}

module.exports = Algorithm;