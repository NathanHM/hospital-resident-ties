const Parser = require('./Parser');
const Algorithm = require('./Algorithm');

function main(args) {

    const parser = new Parser();
    const instance = parser.parseInstance(args[0]);
    const algorithm = new Algorithm(instance);
    let matchingValid;

    if (args.length > 1) {
        matchingValid = parser.parseMatching(args[1]);

    } else {
        algorithm.run();
        matchingValid = algorithm.checkMatching();
    }

    if (matchingValid) {
        algorithm.printMatching();
        algorithm.checkStability();
    } else {
        console.log('The matching is invalid!')
    }

}

main(process.argv.slice(2));