class Doctor {

    _id;
    _preferenceList;
    _assignment;
    _promoted;
    _exhausted;


    constructor(id) {
        this._id = id;
        this._preferenceList = [];
        this._assignment = undefined;
        this._promoted = false;
        this._exhausted = false;
    }

    get id() {
        return this._id;
    }

    get preferenceList() {
        return this._preferenceList;
    }

    get assignment() {
        return this._assignment;
    }

    get exhausted() {
        return this._exhausted;
    }

    get promoted() {
        return this._promoted;
    }

    set exhausted(bool) {
        this._exhausted = bool;
    }

    promote() {
        this._promoted = true;
    }

    addPref(hospital) {
        this._preferenceList.push(hospital);
    }

    assignTo(hospital) {
        this._assignment = hospital;
    }

    toString() {
        return String(this._id)
    }
}

module.exports = Doctor;