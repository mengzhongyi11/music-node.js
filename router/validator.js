const accountReg = /^[A-Za-z\u4e00-\u9fa5][A-Za-z0-9_\u4e00-\u9fa5]{2,19}$/;
const passwordReg = /^(?=.*[A-Za-z])(?=.*\d|.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{3,32}$/
const phoneReg = /^1[3-9]\d{9}$/
module.exports = {
    validateAccount: str => accountReg.test(str),
    validatePassword: str => passwordReg.test(str),
    validatePhone : str => phoneReg.test(str)
};