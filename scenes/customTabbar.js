import React, {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomTabbar = React.createClass({
  tabIcons: [],
  tabIconNames:[],

  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
  },

  componentDidMount() {
    this.setAnimationValue({ value: this.props.activeTab, });
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  },

  setAnimationValue({ value, }) {
    this.tabIcons.forEach((icon, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
    this.tabIconNames.forEach((name, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      name.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  },

  //color between rgb(0,26,48) and rgb(204,204,204)
  iconColor(progress) {
    const red = 0 + (204 - 0) * progress;
    const green = 26 + (204 - 26) * progress;
    const blue = 48 + (204 - 48) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  },

  render() {
    const tabWidth = this.props.containerWidth / this.props.tabs.length;
    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [0, tabWidth],
    });

    return <View>
      <View style={[styles.tabs, this.props.style, ]}>
        {this.props.tabs.map((tab, i) => {
          var icon_name = tab.split('|')[0];
          var tab_name = tab.split('|')[1];
          return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
            <Icon
              name={icon_name}
              size={18}
              color={this.props.activeTab == i ? 'rgb(0,26,48)' : 'rgb(204,204,204)'}
              ref={(icon) => { this.tabIcons[i] = icon; }}/>
            <Text style={{fontSize: 10, color: 'rgb(0,26,48)'}}
                  ref={(iconname) => { this.tabIconNames[i] = iconname; }}>{tab_name}</Text>
          </TouchableOpacity>;
        })}
      </View>
      <Animated.View style={[styles.tabUnderlineStyle, { width: tabWidth }, { left, }]} />
    </View>;
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 45,
    flexDirection: 'row',
    paddingTop: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tabUnderlineStyle: {
    position: 'absolute',
    height: 3,
    backgroundColor: 'rgb(0,26,48)',
    bottom: 0,
  },
});

export default CustomTabbar;