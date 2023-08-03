Component({
  properties: {
    // fangdai | fangzu | jiaofei | yexiao | shenghuoyongp | lifa | jiekuan | touzi | shejiaotubiao-69 | gongzitiao | juhui | yinshi | youxi | gouwu | tushu | dianying | jiu | ziyuan | lingshi | qiche | xiangyan | yifu | electronics | yiliaoxiang | youfeixinxiguanli | shuma-shouji | dilanxianxingiconyihuifu_huabanfuben | jingdongicon- | Car | yinshi1 | digital | xiezi | yinshi2 | 26 | icon-15 | lvyouchuhang | jingdongbaitiao | jijin | yinhangqia | fuzhai | xianjin | zhinengjijin | huabei | weibiaoti- | weixin | weixin1 | zhifubao
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function(color) {
        this.setData({
          colors: this.fixColor(),
          isStr: typeof color === 'string',
        });
      }
    },
    size: {
      type: Number,
      value: 30,
      observer: function(size) {
        this.setData({
          svgSize: size,
        });
      },
    },
  },
  data: {
    colors: '',
    svgSize: 30,
    quot: '"',
    isStr: true,
  },
  methods: {
    fixColor: function() {
      var color = this.data.color;
      var hex2rgb = this.hex2rgb;

      if (typeof color === 'string') {
        return color.indexOf('#') === 0 ? hex2rgb(color) : color;
      }

      return color.map(function (item) {
        return item.indexOf('#') === 0 ? hex2rgb(item) : item;
      });
    },
    hex2rgb: function(hex) {
      var rgb = [];

      hex = hex.substr(1);

      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function(color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return 'rgb(' + rgb.join(',') + ')';
    }
  }
});
