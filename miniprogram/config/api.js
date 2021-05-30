// 以下是业务服务器API地址
// 本机开发时使用
 //var WxApiRoot = 'http://127.0.0.1:8080/';
// 局域网测试使用
var WxApiRoot = 'http://project.guyubao.com/';
// 云平台部署时使用
// var WxApiRoot = 'http://122.51.199.160:8080/wx/';
// 云平台上线时使用
// var WxApiRoot = 'https://www.menethil.com.cn/wx/';

module.exports = {
  IndexUrl: WxApiRoot + 'home/index', //首页数据接口
  recordList:WxApiRoot+'userRecordList',//用户当日记录列表
  userInfo:WxApiRoot + 'mpWXLogin',//自登录接口
  debtAccountList:WxApiRoot + 'debtAccountList',//负债账户列表

  addRecord:WxApiRoot+'addRecord',//添加记账
  editRecord:WxApiRoot+'editRecord',//编辑记账记录
  delRecord:WxApiRoot+'delRecord',//删除记录

  addWallet:WxApiRoot+'addWallet',//添加钱包
  walletList:WxApiRoot+'WalletList',//钱包列表
  editWallet:WxApiRoot+'editWallet',//编辑钱包账户
  delWallet:WxApiRoot+'delWallet',//删除账户

  userChartList:WxApiRoot+'userChartList',//pie图表数据
}