import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Product QR/Barcode</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonIn]}
          onPress={() => navigation.navigate('QRScanner', { mode: 'in' })}
        >
          <Text style={styles.buttonText}>Inventory In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.buttonOut]}
          onPress={() => navigation.navigate('InventoryOut')}
        >
          <Text style={styles.buttonText}>Inventory Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  buttonContainer: {
    width: '80%',
    gap: 20,
    alignItems: 'stretch',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
  buttonIn: {
    backgroundColor: '#007AFF',  // Blue color for Inventory In
  },
  buttonOut: {
    backgroundColor: '#FF3B30',  // Red color for Inventory Out
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen; 