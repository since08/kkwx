import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { AtButton, AtAvatar } from 'taro-ui'
import { reLogin, showToast, loginUser, logMsg } from '../../utils/utils';

@connect(({ Login }) => ({
  ...Login,
}))
export default class Login extends Component {
  config = {
    navigationBarTitleText: '登录',
  };

  componentDidMount = () => {
    Taro.login({
      success: (res) => {
        logMsg('微信登录code', res)
        this.loginCode = res.code
      }
    })
    showToast(loginUser && loginUser.user ? '请登录后操作' : '登录过期,请重新登录')
  };

  onUserInfo(e) {
    reLogin(e, this.props.dispatch, 'loginpage', this.loginCode)
  }

  render() {

    return (
      <View className="Login-page">

        <AtAvatar
          size='large'
          style='margin-top:40px;'
          circle
          text={'头像'}
          image={'https://cdn-upyun.deshpro.com/test//uploads/shop/image/4b55e1b5cc71fc175385a565e395fbc9.png!md'}></AtAvatar>
        <AtButton type='primary'
          openType='getUserInfo'
          style='width:80%;margin-top:40px;'
          onGetUserInfo={this.onUserInfo.bind(this)}>
          登录
      </AtButton>

      </View>
    )
  }
}
