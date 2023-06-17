/**
 * @typedef {Object} ExprData
 * @property {string} type
 * @property {Array.<string>} data 
 */


/**
 * @param {ExprData} expr
 * @returns {any}
 */
export default function(expr) {
    switch(expr.type) {
        case 'cout':
            return expr.data[0];
        case ''
    }
}