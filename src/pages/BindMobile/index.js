import Taro, { Component } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { AtInput, AtForm, AtButton, AtList, AtListItem } from 'taro-ui'
import { wxMobileBind, bindMobile } from '../../service/accountDao';
import { logMsg, isObjEmpty } from '../../utils/utils';
import { resolve } from 'path';
@connect(({ BindMobile }) => ({
  ...BindMobile,
}))
export default class BindMobile extends Component {
  config = {
    navigationBarTitleText: '绑定手机',
  };

  constructor() {
    super(...arguments)
    this.state = {
      code: '',
      mobile: '',
      disabled: false,
      second: 60,
      selector: ['大陆 +86', '香港 +852', '澳门 +853', '台湾 +886'],
      selectorValue: 0,
      btnLoading: false
    }
  }

  componentDidMount = () => {

  };

  showTipText() {
    return this.state.disabled ? `${this.state.second}s后重试` : '发送验证码'
  }

  submitBind = () => {
    const { selector, selectorValue, code, mobile } = this.state
    if (isObjEmpty(mobile) || isObjEmpty(code)) {
      this.handleResult('没有填写完成', 'none')
      return
    }
    let ext = selector[selectorValue].split('+')[1]
    const { access_token } = this.$router.params
    let param = {
      code,
      account: mobile,
      ext,
      access_token
    }
    logMsg('绑定参数',param)
    bindMobile(param, ret => {
      this.handleResult('手机绑定成功', 'success')
      Taro.navigateBack({ delta: 1 })
    }, err => {
      this.handleResult('手机绑定失败，稍后再试', 'none')
    },this.props.dispatch)


  }

  wxBindMobile() {
    if (this.state.disabled) return
    const { selector, selectorValue, mobile } = this.state
    let ext = selector[selectorValue].split('+')[1]
    let param = {
      option_type: 'bind_wx_account',
      vcode_type: 'mobile',
      mobile: mobile,
      ext
    }
    wxMobileBind(param, ret => {
      this.handleResult('已发送验证码', 'success')
      this.sendCode()

    }, err => {

    })
  }

  sendCode = () => {

    this.setState({
      disabled: true
    })
    // 倒计时
    const timer = setInterval(() => {
      if (this.state.second > 0) {
        this.setState({
          second: this.state.second - 1
        })
      } else {
        this.setState({
          second: 60,
          disabled: false
        })
        clearInterval(timer)
      }
    }, 1000)
  }

  handleInput(stateName, value) {
    this.setState({
      [stateName]: value
    })
  }
  handleResult = (title, icon) => {
    Taro.showToast({
      title,
      icon,
      duration: 2000
    })
  }

  handleChange = e => {
    this.setState({
      selectorValue: e.detail.value
    })
  }

  render() {
    const { selector, selectorValue, btnLoading } = this.state;
    return (
      <View className="BindMobile-page">
        <View className='panel'>
          <View className='panel__content no-padding'>
            <View className='component-item'>
              <View style="margin-top:20px;">
                <AtList>
                  <Picker mode='selector' range={selector} value={selectorValue} onChange={this.handleChange}>
                    <AtListItem title='国家地区' extraText={selector[selectorValue]} />
                  </Picker>
                </AtList>
              </View>
              <AtForm>
                <AtInput name='mobile'
                  border={true}
                  type='phone'
                  clear
                  placeholder='请输入手机号码'
                  value={this.state.mobile}
                  onChange={this.handleInput.bind(this, 'mobile')}>
                  <View
                    style={{
                      'color': this.state.disabled ? '#FF4949' : '',
                      'fontSize': '12px',
                      'width': '90px'
                    }}
                    onClick={this.wxBindMobile.bind(this)}
                  >
                    {this.showTipText()}
                  </View>
                </AtInput>
                <View style="height:1px;" />

                <AtInput name='code'
                  title='验证码'
                  type='number'
                  maxlength='6'
                  clear
                  placeholder='验证码'
                  value={this.state.code}
                  onChange={this.handleInput.bind(this, 'code')} />


              </AtForm>
            </View>
          </View>

          <View className='btn-item btn-bind'>
            <AtButton type='primary'
              loading={btnLoading}
              onClick={this.submitBind}>绑定手机</AtButton>
          </View>
        </View>
      </View>

    )
  }
}
