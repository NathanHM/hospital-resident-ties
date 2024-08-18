class Hospital {

    _id;
    _rankList;
    _capacity;
    _numAssignees;
    _rankOfWorstAssignee;
    _assignees;
    _promoted;
    _worstPromoted;
    _preferenceList;

    static numDoctors;

    constructor(id) {
        this._id = id;
        this._preferenceList = []
        this._assignees = new Set;
        this._promoted = new Set;
        this._worstPromoted = false;
        this._capacity = 0;
        this.resetNumAssignees();
        this._rankList = [];
        for (let i = 0; i < this.numDoctors; i++) {
            this._rankList[i] = -1;
        }
        this._rankOfWorstAssignee = -1;
    }

    get id() {
        return this._id;
    }

    get rankList() {
        return this._rankList;
    }

    get capacity() {
        return this._capacity;
    }

    get numAssignees() {
        return this._numAssignees;
    }

    get rankOfWorstAssignee() {
        if (this._worstPromoted) {
            return this._rankOfWorstAssignee - 0.5;
        }
        return this._rankOfWorstAssignee
    }

    get preferenceList() {
        return this._preferenceList;
    }

    get assigneesList() {
        return this._assignees;
    }


    setCapacity(capacity) {
        this._capacity = capacity;
    }

    addPref(doctor, rank) {

        if (rank >= this._preferenceList.length || this._preferenceList[rank - 1] === undefined) {
            const rankSet = [];
            rankSet.push(doctor);
            this._preferenceList[rank - 1] = rankSet;
        } else {
            this._preferenceList[rank - 1].push(doctor);
        }

        this._rankList[doctor.id - 1] = rank;

        if (rank > this._rankOfWorstAssignee) {
            this._rankOfWorstAssignee = rank;
        }
    }

    resetNumAssignees() {
        this._numAssignees = 0;
    }

    incrementNumAssignees() {
        this._numAssignees++;
    }

    decrementNumAssignees() {
        this._numAssignees--;
    }

    atCapacity() {
        return (this._numAssignees >= this._capacity);
    }

    isOverSubscribed() {
        return (this._numAssignees > this._capacity);
    }

    toString() {
        return String(this._id);
    }

    getRank(doctor) {
        if (this._promoted.has(doctor)) {
            return this._rankList[doctor.id - 1] - 0.5;
        }
        return this._rankList[doctor.id - 1];
    }

    assign(doctor) {
        this._assignees.add(doctor);
        if (doctor.promoted) {
            this._promoted.push(doctor);
        }
        this.incrementNumAssignees();
    }

    updateWorstAssignee() {
        for (let i = this._rankOfWorstAssignee; i > 0; i--) {

            const rankList = this._preferenceList[i - 1];

            for (let j = 0; j < rankList.length; j++) {


                if (this._assignees.has(rankList[j]) && this._promoted.has(rankList[j])) {
                    for (const k = j; k < rankList.length; k++) {
                        if (this._assignees.has(rankList[k]) && !this._promoted.has(rankList[k])) {
                            this._worstPromoted = false;
                            this._rankOfWorstAssignee = i;
                            return;
                        }
                    }
                    this._worstPromoted = true;
                    this._rankOfWorstAssignee = i;
                    return;

                } else if (this._assignees.has(rankList[j])) {
                    this._worstPromoted = false;
                    this._rankOfWorstAssignee = i;
                    return;
                }
            }
        }
    }

    getWorst() {
        
        const worstRank = this._preferenceList[this._rankOfWorstAssignee - 1];

        if (this._worstPromoted) {
            for (const doctor of worstRank) {
                if (this._assignees.has(doctor) && this._promoted.has(doctor)) {
                    return doctor;
                }
            }
        } else {
            for (const doctor of worstRank) {
                if (this._assignees.has(doctor)) {
                    return doctor;
                }
            }
        }
        return undefined;

    }

    rejectWorst() {
        this._assignees.delete(this.getWorst());
        this.decrementNumAssignees();
    }

}

module.exports = Hospital;