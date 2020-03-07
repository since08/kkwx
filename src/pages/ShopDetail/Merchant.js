import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './index.scss';
import call_img from '../../images/tab/call_bg.png';
import location_img from '../../images/tab/location.png';

export default class Merchant extends Component {


      onLocation(merchant, e) {
            Taro.openLocation({
                  longitude: parseInt(merchant.longitude),
                  latitude: parseInt(merchant.latitude),
                  name: merchant.name
            })
      }

      onCall(merchant, e) {
            Taro.makePhoneCall({ phoneNumber: merchant.telephone })
      }

      render() {
            const { merchant } = this.props
            return <View className="main2_view">
                  <View className="btn_shop1"
                        onClick={this.onLocation.bind(this, merchant)}>
                        <Image className="location_img" src={location_img} />
                  </View>

                  <View className="info_middle_left_view">
                        <Text className="name1">{merchant.name}</Text>
                        <Text className="name2">{merchant.location}</Text>
                  </View>
                  <View style='display:flex;flex:1;' />
                  <View className="btn_shop1"
                        onClick={this.onCall.bind(this, merchant)}>
                        <Image className="call_img" src={call_img} />
                  </View>

            </View>
      }
}