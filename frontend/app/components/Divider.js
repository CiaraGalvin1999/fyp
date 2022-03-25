import React from 'react';
import { StyleSheet, View } from 'react-native';


const styles = StyleSheet.create({
    dividerContainer: {
        width: '100%',
        alignItems: 'center',
    },
    divider: {
        width: '15%',
        backgroundColor: '#2F7571',
        opacity: 0.75,
        height: 2
    },
  });




const Divider = () => {
  return (
    <View style={styles.dividerContainer}><View style={styles.divider}></View></View>
  );
}

export default Divider;