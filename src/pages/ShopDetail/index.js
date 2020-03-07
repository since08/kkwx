import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { logMsg, isObjEmpty, urlEncode } from '../../utils/utils';
import { AtActivityIndicator,AtActionSheet } from 'taro-ui'
import Detail from './detail'

const baseUrl = 'https://cdn-upyun.deshpro.com/kk/uploads/';


@connect(({ ShopDetail }) => ({
  ...ShopDetail,
}))
export default class Shopdetail extends Component {



  config = {
    navigationBarTitleText: '商品详情',
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    let param = this.$router.params
    dispatch({ type: 'ShopDetail/detail', param })
};

  render() {
    const { shopDetail } = this.props;
    let param = this.$router.params
    return (<View>
      {isObjEmpty(shopDetail) ? <AtActivityIndicator mode='center' />
        : <Detail shopDetail={shopDetail}
                  buyStatus={param.buyStatus} />}
    </View>)
  }


}
