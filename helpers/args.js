const args = process.argv
    .slice(2)
    .map((val, i) => {
        let object = {};
        let [regexForProp, regexForVal] = (() => [new RegExp('^(.+?)='), new RegExp('\=(.*)')])();
        let [prop, value] = (() => [regexForProp.exec(val), regexForVal.exec(val)])();
        if (!prop) {
            object[val] = true;
            return object;
        } else {
            object[prop[1]] = value[1];
            return object
        }
    })
    .reduce((obj, item) => {
        let prop = Object.keys(item)[0];
        obj[prop] = item[prop];
        return obj;
    }, {});

module.exports = args;