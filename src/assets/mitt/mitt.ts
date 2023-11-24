import mitt from 'mitt'
window.mitt = window.mitt || mitt()
let emitter = window.mitt;
export default emitter;
