import Taro, { Component } from '@tarojs/taro';
import { View, Button, FunctionalPageNavigator } from '@tarojs/components';
import './index.scss';
import { urlEncode } from '../../utils/utils';


export default class PreOrder extends Component {

  render() {
    const {title,image,original_price,price,} = this.props.item
    return (<View className="order_list_view">
      <View className="list_view" >
        <Image
          className="list_btn_img"
          src={image}
        />
        
        <View className="list_view_right">
          <View style="flex:1;">
          <Text className="intro_text">{title}</Text>
          </View>
          
          <Text className="origin_price_text">{`市价:¥${original_price}`}</Text>
          <Text className="price_text">{`活动价:¥${price}`}</Text>
        </View>
      </View>
    </View>)
  }
}