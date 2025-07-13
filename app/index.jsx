import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function Home() {
  const [quotes, setQuotes] = useState([]);
  const [newQuote, setNewQuote] = useState('');
  const [showQuotes, setShowQuotes] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const fetchQuotes = async () => {
    const snapshot = await getDocs(collection(db, 'quotes'));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      text: doc.data().text
    }));
    setQuotes(data);
    setShowQuotes(true); // Show the list after fetching
  };

  const handleAddQuote = async () => {
    if (!newQuote.trim()) return;
    await addDoc(collection(db, 'quotes'), { text: newQuote });
    setNewQuote('');
    setShowInput(false);
    fetchQuotes(); // refresh list after adding
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🧠 Motivation App</Text>

      {/* 👁️ Show Quotes Button */}
      <Button
        title={showQuotes ? "Hide Quotes" : "Show All Quotes"}
        onPress={() => {
          if (!showQuotes) fetchQuotes();
          else setShowQuotes(false);
        }}
      />

      {/* ➕ Add Quote Button */}
      <Button
        title={showInput ? "Cancel" : "Add New Quote"}
        onPress={() => setShowInput(!showInput)}
        color="green"
      />

      {/* 📝 Add Quote Form */}
      {showInput && (
        <>
          <TextInput
            placeholder="Type your quote here..."
            value={newQuote}
            onChangeText={setNewQuote}
            style={styles.input}
          />
          <Button title="Save Quote" onPress={handleAddQuote} />
        </>
      )}

      {/* 📃 Quotes List */}
      {showQuotes && (
        <FlatList
          data={quotes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Text style={styles.quote}>• {item.text}</Text>}
          style={{ marginTop: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f7fa', // soft background
    justifyContent: 'flex-start',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1e3a8a', // deep blue
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#374151', // neutral gray
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#e0f2fe', // light blue card feel
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#60a5fa', // light blue border
    backgroundColor: '#fff',
    padding: 14,
    marginVertical: 14,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  button: {
    backgroundColor: '#2563eb', // blue
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
