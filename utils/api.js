const API_BASE = 'https://api.wws.xywy.com/api.php';
const API_TEST_BASE = 'https://test.api.wws.xywy.com/api.php';
const API_XIAOCHENGXU = API_BASE + '/xiaochengxu';
const API_TEST_XIAOCHENGXU = API_TEST_BASE + '/xiaochengxu';

const HTTP_API_BASE = 'http://api.wws.xywy.com/api.php';
const COMMON_HTTP_GET_PARAM = 'os=weixin&source=xiaochengxu&pro=xywyf32l24WmcqquqqTdhXaIkw';

/**fdrugDetailListdrugDetailListdrugDetailList
 * 登录
 * @returns {string}
 */
function login() {
    return API_XIAOCHENGXU + '/user/userThird?' + COMMON_HTTP_GET_PARAM +'&api=1503&version=1.0';
}

function getWXDoctorInfo() {
    return API_XIAOCHENGXU + '/club/getDepart';
}

function checkCertifyCode(token) {
    return API_XIAOCHENGXU + '/user/userSmsCode?pro=xywyf32l24WmcqquqqTdhXaIkw&os=wexin&api=1501&source=xiaochengxu&version=1.0&token=' + token;
}
function checkMessageCode(token) {
    return API_BASE + '/user/userSmsBindPhone/index?'+COMMON_HTTP_GET_PARAM+'&api=787&version=1.2&token=' + token;
}
function submitQuestion(token){
    return API_BASE + '/payask/userPayAsk/ask?' +COMMON_HTTP_GET_PARAM + '&api=1491&version=1.0&token=' + token; 
}

function WXPay() {
  return API_BASE + '/pay/WechatServicePay/index';
}



function getQuestionList(token) {
    return API_BASE + '/payask/userPayAsk/userQueslist?api=1496&version=1.0&os=weixin&pro=xywyf32l24WmcqquqqTdhXaIkw&source=xiaochengxu&token=' + token;
}

function getQuestionDetail(token) {
    return API_BASE + '/payask/userPayAsk/userQuesDetail?api=1493&version=1.0&os=weixin&pro=xywyf32l24WmcqquqqTdhXaIkw&source=xiaochengxu&token=' + token;
}

function getQuestionAnswer(token) {
    return API_BASE + '/payask/userPayAsk/ansDetail?api=1495&os=weixin&source=xiaochengxu&pro=xywyf32l24WmcqquqqTdhXaIkw&version=1.0&token='+ token;
}

function continueAskQuestion(token) {
    return  API_BASE + '/club/zhuiwenNew/index?api=884&os=weixin&source=xiaochengxu&pro=xywyf32l24WmcqquqqTdhXaIkw&version=1.0&token=' + token;
}

function loginQuickly() {
    return API_BASE + '/user/userCodeLogin/index?' +COMMON_HTTP_GET_PARAM + '&api=1404&version=1.0'; 
}

function getCaptcha(){
    return API_BASE + "/common/captcha/getCaptcha?source=xiaochengxu&os=wexin&api=1423&version=1.0&pro=xywyf32l24WmcqquqqTdhXaIkw";
}
function getDrugDetailInfo(){
    return API_XIAOCHENGXU + '/yao/yao_detail?' + COMMON_HTTP_GET_PARAM +'&api=1514&version=1.0';


}

function getDrugHomepage() {
    return API_BASE + "/xiaochengxu/yao/index?api=1513&os=weixin&source=xiaochengxu&pro=xywyf32l24WmcqquqqTdhXaIkw&version=1.0"
}



module.exports = {
    login: login,
    getWXDoctorInfo : getWXDoctorInfo,
    checkCertifyCode :checkCertifyCode,
    checkMessageCode :checkMessageCode,
    submitQuestion :submitQuestion,
    WXPay : WXPay,
    getQuestionList:getQuestionList,
    getQuestionDetail:getQuestionDetail,
    getQuestionAnswer:getQuestionAnswer,
    continueAskQuestion:continueAskQuestion,
    loginQuickly : loginQuickly,
    API_BASE:API_BASE,
    getCaptcha:getCaptcha,
    getDrugDetailInfo:getDrugDetailInfo,
    getDrugHomepage:getDrugHomepage
};