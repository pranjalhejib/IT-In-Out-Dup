import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const InventoryOutScreen = () => {
  const navigation = useNavigation();
  const [distributor, setDistributor] = useState('');

  const handleStartScan = () => {
    if (!distributor.trim()) {
      Alert.alert('Error', 'Please enter distributor name');
      return;
    }
    navigation.navigate('QRScannerOut', { 
      distributor: { name: distributor }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Out</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Distributor Name</Text>
        <TextInput
          style={styles.input}
          value={distributor}
          onChangeText={setDistributor}
          placeholder="Enter distributor name"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={handleStartScan}
      >
        <Text style={styles.buttonText}>Start Scanning</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF3B30',
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
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default InventoryOutScreen; 